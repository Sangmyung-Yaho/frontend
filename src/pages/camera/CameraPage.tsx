import type { FaceLandmarker, NormalizedLandmark } from '@mediapipe/tasks-vision';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cameraBackIcon from '../../assets/icons/camera-back.svg';
import cameraShutterIcon from '../../assets/icons/camera-shutter.svg';
import { BackButton } from '../../components/common';
import { THEME_COLORS, useThemeColor } from '../../hooks/useThemeColor';
import { useCameraCaptureStore } from '../../stores/cameraCaptureStore';
import { readImageFile } from '../../utils/imageFile';
import { getFaceLandmarker } from './faceLandmarker';
import { evaluateFacePosition } from './faceValidation';

const ANALYSIS_INTERVAL_MS = 120;
const CAPTURE_PREVIEW_MS = 1200;
const RECENT_IMAGE_KEY = 'camera-recent-image';

type CameraStatus = 'loading' | 'ready' | 'permission-denied' | 'unavailable' | 'error';

function getInstruction(
  status: CameraStatus,
  hasFace: boolean,
  isAligned: boolean,
  isFrontFacing: boolean,
  hasGoodLighting: boolean,
  capturedImage: string | null,
) {
  if (capturedImage) return '촬영이 완료됐어요';
  if (status === 'loading') return '카메라와 얼굴 인식을 준비하고 있어요';
  if (status === 'permission-denied') return '카메라 권한을 허용해주세요';
  if (status === 'unavailable') return '사용할 수 있는 카메라가 없어요';
  if (status === 'error') return '카메라를 불러오지 못했어요';
  if (!hasFace) return '얼굴을 원 안에 맞춰주세요';
  if (!isAligned) return '얼굴 크기와 위치를 원에 맞춰주세요';
  if (!isFrontFacing) return '고개를 기울이지 말고 정면을 바라봐주세요';
  if (!hasGoodLighting) return '조금 더 밝은 곳에서 촬영해주세요';
  return '촬영 준비가 완료됐어요';
}

function CameraPage() {
  useThemeColor(THEME_COLORS.camera);

  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const guideRef = useRef<HTMLDivElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const lightCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const analyzeFrameRef = useRef<(timestamp: number) => void>(() => undefined);
  const lastAnalysisTimeRef = useRef(0);
  const lastVideoTimeRef = useRef(-1);
  const navigationTimeoutRef = useRef<number | null>(null);

  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('loading');
  const [hasCameraFeed, setHasCameraFeed] = useState(false);
  const [hasFace, setHasFace] = useState(false);
  const [isAligned, setIsAligned] = useState(false);
  const [isFrontFacing, setIsFrontFacing] = useState(false);
  const [hasGoodLighting, setHasGoodLighting] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [galleryThumbnail, setGalleryThumbnail] = useState<string | null>(() =>
    sessionStorage.getItem(RECENT_IMAGE_KEY),
  );
  const setCapture = useCameraCaptureStore((state) => state.setCapture);

  const isFrontConditionMet = hasFace && isAligned && isFrontFacing;
  const conditionsMet = isFrontConditionMet && hasGoodLighting;

  const stopCamera = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const measureLighting = useCallback((video: HTMLVideoElement) => {
    const canvas = lightCanvasRef.current ?? document.createElement('canvas');
    lightCanvasRef.current = canvas;
    canvas.width = 32;
    canvas.height = 32;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return false;

    context.drawImage(video, 0, 0, 32, 32);
    const pixels = context.getImageData(0, 0, 32, 32).data;
    let luminanceTotal = 0;
    for (let index = 0; index < pixels.length; index += 4) {
      luminanceTotal +=
        pixels[index] * 0.2126 + pixels[index + 1] * 0.7152 + pixels[index + 2] * 0.0722;
    }
    const averageLuminance = luminanceTotal / (pixels.length / 4);
    return averageLuminance >= 55 && averageLuminance <= 235;
  }, []);

  const analyzeFrame = useCallback(
    (timestamp: number) => {
      const video = videoRef.current;
      const preview = previewRef.current;
      const guide = guideRef.current;
      const landmarker = landmarkerRef.current;

      if (
        video &&
        preview &&
        guide &&
        landmarker &&
        video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
        timestamp - lastAnalysisTimeRef.current >= ANALYSIS_INTERVAL_MS &&
        video.currentTime !== lastVideoTimeRef.current
      ) {
        lastAnalysisTimeRef.current = timestamp;
        lastVideoTimeRef.current = video.currentTime;

        let landmarks: NormalizedLandmark[] | undefined;
        try {
          landmarks = landmarker.detectForVideo(video, timestamp).faceLandmarks[0];
        } catch {
          landmarks = undefined;
        }

        const result = evaluateFacePosition(
          landmarks,
          { width: video.videoWidth, height: video.videoHeight },
          { width: preview.clientWidth, height: preview.clientHeight },
          guide.getBoundingClientRect(),
          preview.getBoundingClientRect(),
        );
        setHasFace(result.hasFace);
        setIsAligned(result.isAligned);
        setIsFrontFacing(result.isFrontFacing);
        setHasGoodLighting(measureLighting(video));
      }

      animationFrameRef.current = requestAnimationFrame((nextTimestamp) =>
        analyzeFrameRef.current(nextTimestamp),
      );
    },
    [measureLighting],
  );

  useEffect(() => {
    analyzeFrameRef.current = analyzeFrame;
  }, [analyzeFrame]);

  useEffect(() => {
    let cancelled = false;

    async function initializeCamera() {
      stopCamera();
      setCameraStatus('loading');
      setHasCameraFeed(false);
      setCapturedImage(null);
      setHasFace(false);
      setIsAligned(false);
      setIsFrontFacing(false);
      setHasGoodLighting(false);

      try {
        const landmarkerPromise = getFaceLandmarker();
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: 'user' },
            width: { ideal: 1280 },
            height: { ideal: 1280 },
          },
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setHasCameraFeed(true);

        landmarkerRef.current = await landmarkerPromise;

        if (!cancelled) {
          setCameraStatus('ready');
          animationFrameRef.current = requestAnimationFrame((timestamp) =>
            analyzeFrameRef.current(timestamp),
          );
        }
      } catch (error) {
        if (cancelled) return;
        stopCamera();
        const errorName = error instanceof DOMException ? error.name : '';
        if (errorName === 'NotAllowedError' || errorName === 'SecurityError') {
          setCameraStatus('permission-denied');
          navigate('/camera/reception', { replace: true });
        } else if (errorName === 'NotFoundError' || !navigator.mediaDevices) {
          setCameraStatus('unavailable');
        } else {
          setCameraStatus('error');
        }
      }
    }

    void initializeCamera();
    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [navigate, stopCamera]);

  useEffect(
    () => () => {
      if (navigationTimeoutRef.current !== null) {
        window.clearTimeout(navigationTimeoutRef.current);
      }
    },
    [],
  );

  const showResultAndContinue = (imageUrl: string, imageBlob: Blob) => {
    setCapturedImage(imageUrl);
    setGalleryThumbnail(imageUrl);
    setCapture(imageBlob, imageUrl);
    try {
      sessionStorage.setItem(RECENT_IMAGE_KEY, imageUrl);
    } catch {
      // Large images can exceed browser storage; the in-memory thumbnail still works.
    }
    if (navigationTimeoutRef.current !== null) {
      window.clearTimeout(navigationTimeoutRef.current);
    }
    navigationTimeoutRef.current = window.setTimeout(
      () => navigate('/analysis/loading'),
      CAPTURE_PREVIEW_MS,
    );
  };

  const capturePhoto = () => {
    if (capturedImage) return;
    const video = videoRef.current;
    if (!video || !conditionsMet) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const previewUrl = canvas.toDataURL('image/jpeg', 0.92);
    canvas.toBlob(
      (imageBlob) => {
        if (imageBlob) showResultAndContinue(previewUrl, imageBlob);
      },
      'image/jpeg',
      0.92,
    );
  };

  const handleGalleryImage = async (file: File | undefined) => {
    if (!file) return;

    const previewUrl = await readImageFile(file);
    showResultAndContinue(previewUrl, file);
  };

  const instruction = getInstruction(
    cameraStatus,
    hasFace,
    isAligned,
    isFrontFacing,
    hasGoodLighting,
    capturedImage,
  );

  return (
    <main className="relative min-h-dvh overflow-hidden bg-gray-200 text-card">
      <div
        ref={previewRef}
        className="absolute inset-x-0 bottom-[calc(108px+env(safe-area-inset-bottom))] top-[calc(57px+env(safe-area-inset-top))] overflow-hidden"
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`h-full w-full scale-x-[-1] object-cover ${capturedImage ? 'invisible' : ''}`}
          aria-label="전면 카메라 미리보기"
        />
        {capturedImage && (
          <img
            src={capturedImage}
            alt="촬영한 피부 사진"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {!hasCameraFeed && !capturedImage && (
          <div className="absolute inset-0 bg-gray-200" aria-hidden="true" />
        )}
      </div>

      <header className="absolute inset-x-0 top-0 z-20 h-[calc(57px+env(safe-area-inset-top))] bg-text-primary">
        <BackButton
          onClick={() => navigate('/onboarding?step=4')}
          iconSrc={cameraBackIcon}
          iconClassName="scale-x-[-1]"
          className="absolute left-[26.5px] top-[calc(9px+env(safe-area-inset-top))] h-9 w-6"
          aria-label="온보딩 촬영 안내로 돌아가기"
        />
        <div className="absolute left-1/2 top-[calc(16px+env(safe-area-inset-top))] flex -translate-x-1/2 gap-4">
          <span
            className={`flex h-[25px] min-w-[57px] items-center justify-center rounded-[14px] px-4 py-1 text-caption-3 ${
              isFrontConditionMet
                ? 'border border-main-500 bg-card text-text-primary'
                : 'bg-gray-200 text-card'
            }`}
          >
            정면
          </span>
          <span
            className={`flex h-[25px] min-w-[57px] items-center justify-center rounded-[14px] px-4 py-1 text-caption-3 ${
              hasGoodLighting
                ? 'border border-main-500 bg-card text-text-primary'
                : 'bg-gray-200 text-card'
            }`}
          >
            조명
          </span>
        </div>
      </header>

      <section className="pointer-events-none absolute left-1/2 top-[calc(50%-14.5px)] z-10 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-6 px-6">
        <div
          ref={guideRef}
          className={`h-[344px] w-[266px] rounded-[152.5px] border-2 ${
            conditionsMet ? 'border-solid border-main-500' : 'border-dashed border-card'
          }`}
          aria-hidden="true"
        />
        <p className="h-[19px] text-center text-body leading-[19px] text-card" aria-live="polite">
          {instruction}
        </p>
      </section>

      <footer className="absolute inset-x-0 bottom-0 z-20 flex h-[calc(108px+env(safe-area-inset-bottom))] items-center justify-center bg-text-primary px-4 pb-[calc(16px+env(safe-area-inset-bottom))] pt-4">
        <button
          type="button"
          onClick={() => galleryInputRef.current?.click()}
          className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-[10px] bg-card text-[9px] font-medium text-text-primary"
          aria-label="기기 갤러리에서 사진 선택"
        >
          {galleryThumbnail ? (
            <img
              src={galleryThumbnail}
              alt="최근 선택한 사진"
              className="h-full w-full rounded-[10px] object-cover"
            />
          ) : (
            '갤러리'
          )}
        </button>
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
          onChange={(event) => void handleGalleryImage(event.target.files?.[0])}
        />

        <button
          type="button"
          onClick={capturePhoto}
          disabled={!capturedImage && !conditionsMet}
          className="relative h-[76px] w-[76px] shrink-0 disabled:cursor-not-allowed"
          aria-label={capturedImage ? '다시 촬영하기' : '사진 촬영하기'}
        >
          <img
            src={cameraShutterIcon}
            alt=""
            className="absolute inset-0 h-full w-full max-w-none"
            aria-hidden="true"
          />
        </button>
      </footer>
    </main>
  );
}

export default CameraPage;

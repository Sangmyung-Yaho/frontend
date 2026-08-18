import { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import galleryErrorIcon from '../../assets/icons/gallery-error.svg';
import { Button } from '../../components/common';
import { THEME_COLORS, useThemeColor } from '../../hooks/useThemeColor';
import { useCameraCaptureStore } from '../../stores/cameraCaptureStore';
import { readImageFile } from '../../utils/imageFile';

function GalleryAnalysisFailurePage() {
  useThemeColor(THEME_COLORS.onboarding);

  const navigate = useNavigate();
  const location = useLocation();
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const setCapture = useCameraCaptureStore((state) => state.setCapture);

  const handleImageSelection = async (file: File | undefined) => {
    if (!file) return;

    const previewUrl = await readImageFile(file);
    setCapture(file, previewUrl);
    navigate('/analysis/loading', {
      replace: true,
      state: { ...location.state, imageSource: 'gallery' },
    });
  };

  return (
    <main className="relative h-dvh overflow-hidden bg-background">
      <section className="absolute left-[calc(50%+0.5px)] top-[calc(50%+0.5px)] flex h-[245px] w-[368px] max-w-[calc(100%-25px)] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-between">
        <div className="flex w-full flex-col items-center">
          <div className="flex size-[88px] items-center justify-center rounded-full bg-danger-light">
            <img src={galleryErrorIcon} alt="" className="size-[45px]" />
          </div>
          <div className="flex w-full flex-col items-center gap-2">
            <h1 className="pt-4 text-center text-headline leading-[normal] text-text-analysis">
              분석을 마치지 못했어요.
            </h1>
            <p className="text-center text-body-small leading-[normal] text-text-analysis-muted">
              사진이 흐리거나 얼굴이 잘 보이지 않아요.
              <br />
              밝은 곳에서 다시 촬영해주세요.
            </p>
          </div>
        </div>

        <Button onClick={() => galleryInputRef.current?.click()}>갤러리에서 다시 불러오기</Button>
      </section>

      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => void handleImageSelection(event.target.files?.[0])}
      />
    </main>
  );
}

export default GalleryAnalysisFailurePage;

import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { requestSkinAnalysis } from '../../api/skinAnalysis';
import { LoadingIndicator } from '../../components/common';
import { THEME_COLORS, useThemeColor } from '../../hooks/useThemeColor';
import {
  clearPendingOnboardingSkinImageId,
  getPendingOnboardingSkinImageId,
  setPendingOnboardingSkinImageId,
} from '../../services/pendingOnboardingSkinImage';
import {
  ANALYSIS_ESTIMATED_DURATION_MS,
  analyzeSkinPhoto,
  uploadSkinPhoto,
} from '../../services/skinAnalysis';
import { useCameraCaptureStore } from '../../stores/cameraCaptureStore';
import { useCheckinStore } from '../../stores/checkinStore';

const MAX_PROGRESS_BEFORE_RESPONSE = 95;
const COMPLETION_DISPLAY_MS = 300;

function AnalysisLoadingPage() {
  useThemeColor(THEME_COLORS.onboarding);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const imageBlob = useCameraCaptureStore((state) => state.imageBlob);
  const setAnalysisResult = useCameraCaptureStore((state) => state.setAnalysisResult);
  const [isCheckinPhotoAnalysis] = useState(
    () => location.state?.source === 'checkin' || useCheckinStore.getState().isPhotoAnalysisPending,
  );
  const [progress, setProgress] = useState(0);
  const isGalleryUpload =
    location.state?.source === 'gallery' || location.state?.imageSource === 'gallery';

  useEffect(() => {
    let cancelled = false;
    let animationFrameId = 0;
    let navigationTimeoutId = 0;
    const startedAt = performance.now();

    const updateProgress = (timestamp: number) => {
      const elapsedRatio = (timestamp - startedAt) / ANALYSIS_ESTIMATED_DURATION_MS;
      setProgress(
        Math.min(elapsedRatio * MAX_PROGRESS_BEFORE_RESPONSE, MAX_PROGRESS_BEFORE_RESPONSE),
      );

      if (elapsedRatio >= 1) return;
      animationFrameId = window.requestAnimationFrame(updateProgress);
    };

    animationFrameId = window.requestAnimationFrame(updateProgress);

    const processSkinPhoto = async () => {
      if (isCheckinPhotoAnalysis) {
        const usePendingOnboardingImage = location.state?.usePendingOnboardingImage === true;
        const pendingSkinImageId = usePendingOnboardingImage
          ? getPendingOnboardingSkinImageId()
          : null;

        if (usePendingOnboardingImage && pendingSkinImageId === null) {
          throw new Error('저장된 온보딩 피부 이미지가 없습니다.');
        }

        const analysisResult = pendingSkinImageId
          ? await requestSkinAnalysis(pendingSkinImageId)
          : await analyzeSkinPhoto(imageBlob);

        if (pendingSkinImageId) {
          clearPendingOnboardingSkinImageId();
        }
        setAnalysisResult(analysisResult);
        useCheckinStore.getState().completePhotoAnalysis();
        return;
      }

      const { skin_image_id: skinImageId } = await uploadSkinPhoto(imageBlob);
      setPendingOnboardingSkinImageId(skinImageId);
    };

    void processSkinPhoto()
      .then(async () => {
        if (cancelled) return;

        window.cancelAnimationFrame(animationFrameId);
        setProgress(100);
        if (isCheckinPhotoAnalysis) {
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['home-dashboard'] }),
            queryClient.invalidateQueries({ queryKey: ['today-checkin'] }),
            queryClient.invalidateQueries({ queryKey: ['checkins'] }),
            queryClient.invalidateQueries({ queryKey: ['today-routine'] }),
          ]);
          useCheckinStore.getState().reset();
        }
        navigationTimeoutId = window.setTimeout(
          () =>
            navigate(isCheckinPhotoAnalysis ? '/home' : '/onboarding?step=5', {
              replace: true,
            }),
          COMPLETION_DISPLAY_MS,
        );
      })
      .catch(() => {
        if (cancelled) return;

        window.cancelAnimationFrame(animationFrameId);
        navigate(isGalleryUpload ? '/analysis/gallery-failure' : '/analysis/failure', {
          replace: true,
          state: {
            source: isCheckinPhotoAnalysis ? 'checkin' : location.state?.source,
            imageSource: location.state?.imageSource,
          },
        });
      });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(animationFrameId);
      window.clearTimeout(navigationTimeoutId);
    };
  }, [
    imageBlob,
    isCheckinPhotoAnalysis,
    isGalleryUpload,
    location.state,
    navigate,
    queryClient,
    setAnalysisResult,
  ]);

  return (
    <main className="relative h-dvh overflow-hidden bg-[linear-gradient(180deg,var(--color-main-100)_0%,var(--color-background)_47.596%,var(--color-background)_100%)]">
      <section className="absolute left-1/2 top-1/2 flex w-[210px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-8">
        <LoadingIndicator label="피부 분석 중" />
        <div className="flex h-11 w-full flex-col items-center gap-4">
          <h1 className="h-[23px] whitespace-nowrap text-center text-[19px] font-bold leading-[23px] tracking-[-0.19px] text-text-analysis">
            AI가 피부를 분석하고 있어요
          </h1>
          <div
            className="h-[5px] w-[190px] overflow-hidden rounded-full bg-main-100"
            role="progressbar"
            aria-label="피부 분석 진행률"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="h-full rounded-full bg-main-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </section>
    </main>
  );
}

export default AnalysisLoadingPage;

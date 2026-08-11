import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingIndicator } from '../../components/common';
import { THEME_COLORS, useThemeColor } from '../../hooks/useThemeColor';
import {
  ANALYSIS_ESTIMATED_DURATION_MS,
  analyzeSkinPhoto,
} from '../../services/skinAnalysis';
import { useCameraCaptureStore } from '../../stores/cameraCaptureStore';

const MAX_PROGRESS_BEFORE_RESPONSE = 95;
const COMPLETION_DISPLAY_MS = 300;

function AnalysisLoadingPage() {
  useThemeColor(THEME_COLORS.onboarding);

  const navigate = useNavigate();
  const imageBlob = useCameraCaptureStore((state) => state.imageBlob);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let animationFrameId = 0;
    let navigationTimeoutId = 0;
    const startedAt = performance.now();

    const updateProgress = (timestamp: number) => {
      const elapsedRatio = (timestamp - startedAt) / ANALYSIS_ESTIMATED_DURATION_MS;
      setProgress(Math.min(elapsedRatio * MAX_PROGRESS_BEFORE_RESPONSE, MAX_PROGRESS_BEFORE_RESPONSE));

      if (elapsedRatio >= 1) return;
      animationFrameId = window.requestAnimationFrame(updateProgress);
    };

    animationFrameId = window.requestAnimationFrame(updateProgress);

    void analyzeSkinPhoto(imageBlob)
      .then(() => {
        if (cancelled) return;

        window.cancelAnimationFrame(animationFrameId);
        setProgress(100);
        navigationTimeoutId = window.setTimeout(
          () => navigate('/onboarding?step=5', { replace: true }),
          COMPLETION_DISPLAY_MS,
        );
      })
      .catch(() => {
        if (cancelled) return;

        window.cancelAnimationFrame(animationFrameId);
        navigate('/analysis/failure', { replace: true });
      });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(animationFrameId);
      window.clearTimeout(navigationTimeoutId);
    };
  }, [imageBlob, navigate]);

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
            <div
              className="h-full rounded-full bg-main-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

export default AnalysisLoadingPage;

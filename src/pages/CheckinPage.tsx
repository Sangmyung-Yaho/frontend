import { type FormEvent, useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { createCheckin, getCheckinsByDateRange, getTodayCheckin } from '../api/checkins';
import cameraIcon from '../assets/icons/camera.svg';
import { Button, Input, NumberOption } from '../components/common';
import { BackHeader } from '../layouts';
import { getPendingOnboardingSkinImageId } from '../services/pendingOnboardingSkinImage';
import { useCheckinStore } from '../stores/checkinStore';

const CHECKIN_HISTORY_START_DATE = '2000-01-01';

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function CheckinPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const isStartingAnalysisRef = useRef(false);
  const sleepHours = useCheckinStore((state) => state.sleepHours);
  const stress = useCheckinStore((state) => state.stress);
  const water = useCheckinStore((state) => state.water);
  const isPhotoComplete = useCheckinStore((state) => state.isPhotoComplete);
  const setSleepHours = useCheckinStore((state) => state.setSleepHours);
  const setStress = useCheckinStore((state) => state.setStress);
  const setWater = useCheckinStore((state) => state.setWater);
  const startPhotoAnalysis = useCheckinStore((state) => state.startPhotoAnalysis);
  const resetCheckin = useCheckinStore((state) => state.reset);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { data: todayCheckin } = useQuery({
    queryKey: ['today-checkin'],
    queryFn: getTodayCheckin,
    staleTime: 30_000,
    retry: 1,
  });
  const today = formatLocalDate(new Date());
  const { data: checkinHistory } = useQuery({
    queryKey: ['checkins', 'history', CHECKIN_HISTORY_START_DATE, today],
    queryFn: async () => (await getCheckinsByDateRange(CHECKIN_HISTORY_START_DATE, today)).data,
    staleTime: 30_000,
    retry: 1,
  });
  const isFirstCheckin = checkinHistory?.length === 0;
  const pendingOnboardingSkinImageId = getPendingOnboardingSkinImageId();
  const hasReusableOnboardingPhoto = isFirstCheckin && pendingOnboardingSkinImageId !== null;
  const isPhotoReady = isPhotoComplete || hasReusableOnboardingPhoto;

  const waterIntake = Number(water);
  const canAnalyze =
    stress !== null &&
    water.trim().length > 0 &&
    Number.isInteger(waterIntake) &&
    waterIntake >= 0 &&
    isPhotoReady;

  useEffect(() => {
    if (todayCheckin && !isStartingAnalysisRef.current) {
      resetCheckin();
      navigate('/home', { replace: true });
    }
  }, [navigate, resetCheckin, todayCheckin]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canAnalyze || stress === null || isSubmitting) return;

    setSubmitError('');
    setIsSubmitting(true);
    isStartingAnalysisRef.current = true;

    try {
      await createCheckin({
        sleep_hours: sleepHours,
        stress_level: stress,
        water_intake_ml: waterIntake,
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['home-dashboard'], refetchType: 'none' }),
        queryClient.invalidateQueries({ queryKey: ['checkins'], refetchType: 'none' }),
        queryClient.invalidateQueries({ queryKey: ['today-routine'], refetchType: 'none' }),
      ]);

      navigate('/analysis/loading', {
        replace: true,
        state: {
          source: 'checkin',
          imageSource: location.state?.imageSource,
          usePendingOnboardingImage: hasReusableOnboardingPhoto && !isPhotoComplete,
        },
      });
    } catch {
      isStartingAnalysisRef.current = false;
      setSubmitError('체크인을 저장하지 못했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-dvh bg-background px-4 pb-24">
      <BackHeader
        title="오늘의 체크인"
        onBack={() => navigate('/home')}
        className="!w-full !px-0"
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-7 pt-5">
        <section>
          <div className="flex items-center justify-between text-caption-3 leading-normal text-text-primary">
            <label htmlFor="sleep-hours">어젯밤 수면시간</label>
            <output htmlFor="sleep-hours" className="text-body font-normal">
              {sleepHours}시간
            </output>
          </div>
          <input
            id="sleep-hours"
            type="range"
            min="0"
            max="12"
            step="0.5"
            value={sleepHours}
            onChange={(event) => setSleepHours(Number(event.target.value))}
            className="mt-4 h-1 w-full cursor-pointer accent-main-500"
          />
          <div className="mt-2 flex justify-between text-caption text-text-secondary">
            <span>0h</span>
            <span>12h</span>
          </div>
        </section>

        <fieldset>
          <legend className="mb-3 text-caption-3 leading-normal text-text-primary">
            오늘 스트레스
          </legend>
          <div className="grid grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((value) => (
              <NumberOption
                key={value}
                value={value}
                selected={stress === value}
                onClick={() => setStress(value)}
                className="w-full"
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-caption text-text-secondary">
            <span>괜찮아요</span>
            <span>많이 힘들어요</span>
          </div>
        </fieldset>

        <label className="flex flex-col gap-2 text-caption-3 leading-normal text-text-primary">
          물 섭취량
          <Input
            value={water}
            onChange={(event) => setWater(event.target.value.replace(/\D/g, ''))}
            inputMode="numeric"
            suffix="ml"
            isValid={water.trim().length > 0}
            aria-label="물 섭취량"
          />
        </label>

        <section>
          <h2 className="mb-2 text-caption-3 leading-normal text-text-primary">피부 촬영</h2>
          <button
            type="button"
            onClick={() => {
              startPhotoAnalysis();
              navigate('/camera', { state: { source: 'checkin' } });
            }}
            className={`flex flex-col items-start gap-[10px] rounded-[10px] border px-6 py-3 text-body transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-500 ${
              isPhotoReady
                ? 'border-main-500 bg-main-50 text-main-500'
                : 'border-gray-100 bg-card text-text-primary hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center gap-2">
              {isPhotoReady ? (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="size-6 shrink-0 fill-none stroke-current"
                >
                  <path
                    d="m5 12 4 4L19 6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <img src={cameraIcon} alt="" aria-hidden="true" className="size-6 shrink-0" />
              )}
              <span>{isPhotoReady ? '촬영완료' : '촬영하기'}</span>
            </span>
          </button>
        </section>

        <div className="fixed bottom-[max(24px,env(safe-area-inset-bottom))] left-1/2 z-20 w-[calc(100%-32px)] max-w-[361px] -translate-x-1/2">
          {submitError && (
            <p role="alert" className="mb-2 text-center text-caption text-danger">
              {submitError}
            </p>
          )}
          <Button type="submit" disabled={!canAnalyze || isSubmitting} className="w-full">
            {isSubmitting ? '저장 중...' : '분석하기'}
          </Button>
        </div>
      </form>
    </main>
  );
}

export default CheckinPage;

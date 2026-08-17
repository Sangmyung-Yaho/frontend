import { type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import cameraIcon from '../assets/icons/camera.svg';
import { Button, Input, NumberOption } from '../components/common';
import { BackHeader } from '../layouts';
import { useCheckinStore } from '../stores/checkinStore';

function CheckinPage() {
  const navigate = useNavigate();
  const sleepHours = useCheckinStore((state) => state.sleepHours);
  const stress = useCheckinStore((state) => state.stress);
  const water = useCheckinStore((state) => state.water);
  const isPhotoComplete = useCheckinStore((state) => state.isPhotoComplete);
  const setSleepHours = useCheckinStore((state) => state.setSleepHours);
  const setStress = useCheckinStore((state) => state.setStress);
  const setWater = useCheckinStore((state) => state.setWater);
  const startPhotoAnalysis = useCheckinStore((state) => state.startPhotoAnalysis);

  const canAnalyze = stress !== null && water.trim().length > 0 && isPhotoComplete;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canAnalyze) return;
    navigate('/home?state=completed');
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
          <legend className="mb-3 text-caption-3 leading-normal text-text-primary">오늘 스트레스</legend>
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
              isPhotoComplete
                ? 'border-main-500 bg-main-50 text-main-500'
                : 'border-gray-100 bg-card text-text-primary hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center gap-2">
              {isPhotoComplete ? (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="size-6 shrink-0 fill-none stroke-current"
                >
                  <path d="m5 12 4 4L19 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <img src={cameraIcon} alt="" aria-hidden="true" className="size-6 shrink-0" />
              )}
              <span>{isPhotoComplete ? '촬영완료' : '촬영하기'}</span>
            </span>
          </button>
        </section>

        <Button
          type="submit"
          disabled={!canAnalyze}
          className="fixed bottom-[max(24px,env(safe-area-inset-bottom))] left-1/2 z-20 w-[calc(100%-32px)] max-w-[361px] -translate-x-1/2"
        >
          분석하기
        </Button>
      </form>
    </main>
  );
}

export default CheckinPage;

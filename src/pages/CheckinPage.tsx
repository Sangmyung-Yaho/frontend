import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, NumberOption } from '../components/common';
import { BackHeader } from '../layouts';

function CheckinPage() {
  const navigate = useNavigate();
  const [sleepHours, setSleepHours] = useState(5.5);
  const [stress, setStress] = useState<number | null>(null);
  const [water, setWater] = useState('');

  const canAnalyze = stress !== null && water.trim().length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canAnalyze) return;
    navigate('/camera');
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
            aria-label="물 섭취량"
          />
        </label>

        <section>
          <h2 className="mb-2 text-caption-3 leading-normal text-text-primary">피부 촬영</h2>
          <button
            type="button"
            onClick={() => navigate('/camera')}
            className="flex flex-col items-start gap-[10px] rounded-[10px] border border-gray-100 bg-card px-6 py-3 text-body text-text-primary transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-500"
          >
            <span className="flex items-center gap-2">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-6 shrink-0 fill-current"
              >
                <path d="M9 3 7.2 5H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.2L15 3H9Zm3 14.5A5.5 5.5 0 1 1 12 6a5.5 5.5 0 0 1 0 11.5Zm0-2A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z" />
              </svg>
              <span>촬영하기</span>
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

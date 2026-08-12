interface RoutineProgressCardProps {
  completedCount: number;
  totalCount: number;
}

function RoutineProgressCard({ completedCount, totalCount }: RoutineProgressCardProps) {
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <section
      className={`flex h-[102px] w-[361px] max-w-full items-center gap-6 rounded-[10px] border border-main-500 p-4 ${
        completedCount > 0 ? 'bg-main-50/30' : 'bg-routine-progress'
      }`}
    >
      <div
        className="relative flex size-[76px] shrink-0 items-center justify-center rounded-full shadow-[0_4px_2px_rgba(0,0,0,0.25)]"
        style={{
          background: `conic-gradient(var(--color-main-500) ${progress}%, var(--color-gray-50) ${progress}% 100%)`,
        }}
        role="progressbar"
        aria-label="오늘 루틴 달성률"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="flex size-[56px] items-center justify-center rounded-full bg-background text-title-3 text-text-primary">
          {progress}%
        </div>
      </div>

      <div className="flex flex-col gap-2 font-semibold">
        <p className="text-caption-3 text-main-800">오늘 달성률</p>
        <p className="whitespace-nowrap text-title-2 text-text-primary">
          {completedCount} / {totalCount} 완료
        </p>
      </div>
    </section>
  );
}

export default RoutineProgressCard;

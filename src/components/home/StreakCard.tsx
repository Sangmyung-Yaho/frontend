import partyPopperIcon from '../../assets/home/party-popper.svg';

interface StreakCardProps {
  days: number;
  hasRecord: boolean;
}

function StreakCard({ days, hasRecord }: StreakCardProps) {
  const weeklyDays = Math.min(7, Math.max(0, Math.floor(days)));
  const isMilestone = weeklyDays === 7;

  return (
    <section
      className={`flex w-full flex-col gap-2 rounded-[10px] border p-4 ${
        isMilestone ? 'h-[109px] border-main-500 bg-main-50' : 'h-[102px] bg-card'
      } ${!isMilestone && hasRecord ? 'border-main-500' : 'border-gray-100'}`}
    >
      <h2 className="h-[21px] text-headline leading-[21px]">주간 기록</h2>

      {isMilestone ? (
        <div className="flex h-7 items-center gap-1">
          <img src={partyPopperIcon} alt="" className="size-7 shrink-0" />
          <div className="flex items-center gap-[9px]">
            <strong className="text-headline leading-[21px]">{weeklyDays}일</strong>
            <span className="text-caption leading-[normal] text-text-secondary">
              째! 일주일을 채웠어요.
            </span>
          </div>
        </div>
      ) : (
        <div className="flex h-[21px] items-center gap-[9px]">
          <strong className="text-headline leading-[21px]">{weeklyDays}일</strong>
          <span className="text-caption leading-[normal] text-text-secondary">
            {weeklyDays === 0 ? '오늘부터 시작해요' : '째 이어가는 중'}
          </span>
        </div>
      )}

      <div
        className="flex h-[10px] items-center gap-3"
        aria-label={`이번 주 7일 중 ${weeklyDays}일 기록`}
      >
        {Array.from({ length: 7 }, (_, index) => (
          <span
            key={index}
            aria-hidden="true"
            className={`size-[10px] rounded-full ${index < weeklyDays ? 'bg-main-500' : 'bg-gray-50'}`}
          />
        ))}
      </div>
    </section>
  );
}

export default StreakCard;

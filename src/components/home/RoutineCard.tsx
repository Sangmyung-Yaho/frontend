import chevronRightIcon from '../../assets/home/chevron-right.svg';

interface RoutineCardProps {
  isCheckedIn: boolean;
  progress: number;
  routines: Array<{ title: string; duration: string }>;
  onClick: () => void;
}

function RoutineCard({ isCheckedIn, progress, routines, onClick }: RoutineCardProps) {
  return (
    <section
      className={`w-full rounded-[10px] border bg-card p-4 ${
        isCheckedIn ? 'h-[141px] border-main-500' : 'h-[78px] border-gray-100'
      }`}
    >
      <button
        type="button"
        onClick={onClick}
        className="flex h-[21px] w-full items-center justify-between text-left focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-main-500"
      >
        <span className="text-headline leading-[21px]">오늘의 루틴</span>
        <img src={chevronRightIcon} alt="" className="h-3 w-1.5" />
      </button>

      {isCheckedIn ? (
        <>
          <div className="mt-4 h-[5px] w-[317px] max-w-full overflow-hidden rounded-full bg-gray-50">
            <div className="h-full rounded-full bg-main-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-4 flex h-[51px] w-[317px] max-w-full flex-col gap-2 text-body-small leading-[normal]">
            {routines.map((routine, index) => (
              <div
                key={routine.title}
                className={`flex items-center justify-between ${index === 0 ? 'border-b border-gray-100 pb-2' : ''}`}
              >
                <span>{routine.title}</span>
                <span className="text-text-secondary">{routine.duration}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="mt-2 text-body-small leading-[normal] text-text-secondary">
          체크인을 완료하면 루틴이 생겨요.
        </p>
      )}
    </section>
  );
}

export default RoutineCard;

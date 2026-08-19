import routineEmptyIcon from '../../assets/icons/routine-empty.svg';
import Button from './Button/Button';

export interface CheckinEmptyStateProps {
  description: string;
  onCheckin: () => void;
}

function CheckinEmptyState({ description, onCheckin }: CheckinEmptyStateProps) {
  return (
    <section className="absolute left-1/2 top-1/2 flex w-[368px] max-w-[calc(100%-25px)] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-6">
      <div className="flex w-full flex-col items-center">
        <div className="flex size-[88px] items-center justify-center rounded-full bg-main-50">
          <img src={routineEmptyIcon} alt="" className="size-[50px]" />
        </div>
        <div className="flex flex-col items-center gap-2 pt-4 text-center">
          <h2 className="text-[17px] font-semibold leading-none text-text-analysis">
            체크인 기록이 없어요.
          </h2>
          <p className="text-[13px] leading-none text-text-analysis-muted">{description}</p>
        </div>
      </div>
      <Button className="!h-[50px]" onClick={onCheckin}>
        체크인 하러가기
      </Button>
    </section>
  );
}

export default CheckinEmptyState;

export interface TrendEmptyCardProps {
  className?: string;
}

function TrendEmptyCard({ className = '' }: TrendEmptyCardProps) {
  return (
    <section
      className={`min-h-[178px] rounded-[10px] border border-gray-100 bg-card p-4 ${className}`}
    >
      <h2 className="text-title-3 leading-normal text-text-primary">최근 피부 지표 추이</h2>

      <div className="flex min-h-[112px] flex-col items-center justify-center text-center">
        <p className="text-body-small leading-normal text-text-secondary">
          두 번째 기록부터 변화 추이를 보여드릴게요.
        </p>
        <p className="mt-2 text-caption leading-normal text-gray-100">오늘 기록은 저장했어요.</p>
      </div>
    </section>
  );
}

export default TrendEmptyCard;

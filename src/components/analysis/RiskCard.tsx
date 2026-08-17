export interface RiskCardProps {
  title?: string;
  sleepRiskLabel?: string;
  stressRiskLabel?: string;
  description?: string;
  className?: string;
}

function RiskCard({
  title = '오늘은 몸을 쉬게 해주세요.',
  sleepRiskLabel = '수면 3시간 미만',
  stressRiskLabel = '높은 스트레스',
  description = '무리하지 말고 오늘은 회복을 우선해 보세요.',
  className = '',
}: RiskCardProps) {
  return (
    <section
      role="alert"
      aria-labelledby="risk-card-title"
      className={`rounded-[10px] border border-danger bg-danger-light p-6 ${className}`}
    >
      <span className="inline-flex w-fit rounded-full border border-danger bg-card px-3 py-[7px] text-body-small font-semibold leading-none text-danger">
        고위험 조합 감지
      </span>
      <h2 id="risk-card-title" className="mt-[11px] text-title-2 font-bold leading-7 text-text-primary">
        {title}
      </h2>
      <p className="mt-[11px] text-body-small leading-5 text-text-secondary">
        <strong className="font-semibold text-danger">{sleepRiskLabel}</strong>과{' '}
        <strong className="font-semibold text-danger">{stressRiskLabel}</strong>가 함께 확인됐어요.
        <br />
        {description}
      </p>
    </section>
  );
}

export default RiskCard;

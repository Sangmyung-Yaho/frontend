import { CauseBadge } from '../common';
import CauseCard, { type CauseCardProps } from './CauseCard';
import RiskCard from './RiskCard';

export interface CauseSectionProps {
  factors?: CauseCardProps[];
  interactionMessage?: string;
  warning?: {
    headline: string;
    message: string;
  };
  className?: string;
}

function CauseSection({
  factors = [],
  interactionMessage,
  warning,
  className = '',
}: CauseSectionProps) {
  return (
    <section className={className} aria-labelledby="cause-section-title">
      <CauseBadge>영향 높은 요인 {factors.length}개</CauseBadge>
      <h1 id="cause-section-title" className="mt-4 text-title-2 leading-7 text-text-primary">
        주요 원인을 확인해보세요.
      </h1>
      {factors.length > 0 && (
        <div className="mt-5 grid grid-cols-2 gap-3">
          {factors.map((factor) => (
            <CauseCard key={factor.title} {...factor} />
          ))}
        </div>
      )}
      {interactionMessage && (
        <div className="mt-4 rounded-[10px] border border-gray-100 bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <h2 className="text-body-small font-semibold leading-5 text-text-secondary">
            상호작용 설명
          </h2>
          <p className="mt-2 text-body-small leading-5 text-text-secondary">{interactionMessage}</p>
        </div>
      )}
      {warning && (
        <RiskCard className="mt-4" title={warning.headline} description={warning.message} />
      )}
    </section>
  );
}

export default CauseSection;

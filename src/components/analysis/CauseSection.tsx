import { CauseBadge } from '../common';
import CauseCard, { type CauseCardProps } from './CauseCard';
import RiskCard from './RiskCard';

export interface CauseSectionProps {
  factors?: [CauseCardProps, CauseCardProps];
  isHighRiskCombination?: boolean;
  className?: string;
}

const defaultFactors: [CauseCardProps, CauseCardProps] = [
  { title: '수면 부족', value: '5.2', unit: '시간', description: '평소보다 1.6시간 짧아요.' },
  { title: '스트레스', value: '4', unit: '/ 5단계', description: '최근 7일 중 가장 높아요.' },
];

function CauseSection({ factors = defaultFactors, isHighRiskCombination = true, className = '' }: CauseSectionProps) {
  return (
    <section className={className} aria-labelledby="cause-section-title">
      <CauseBadge>영향 높은 요인 {factors.length}개</CauseBadge>
      <h1 id="cause-section-title" className="mt-4 text-title-2 leading-7 text-text-primary">
        두 요인이 함께 작용하고 있어요
      </h1>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {factors.map((factor) => <CauseCard key={factor.title} {...factor} />)}
      </div>
      <div className="mt-4 rounded-[10px] border border-gray-100 bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <h2 className="text-body-small font-semibold leading-5 text-text-secondary">상호작용 설명</h2>
        <p className="mt-2 text-body-small leading-5 text-text-secondary">
          물 섭취가 부족한 상태에서 <strong className="font-semibold text-danger">수면까지 짧았던 날</strong>이라,
          <br />
          스트레스가 겹치면 피부 회복이 <strong className="font-semibold text-danger">더디질 수 있어요.</strong>
        </p>
        <p className="mt-2 text-caption leading-4 text-text-secondary">영향이 큰 상위 2개 요인만 설명에 포함했어요.</p>
      </div>
      {isHighRiskCombination && <RiskCard className="mt-4" />}
    </section>
  );
}

export default CauseSection;

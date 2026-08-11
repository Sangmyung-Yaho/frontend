import rednessIcon from '../../assets/home/redness.svg';
import troubleIcon from '../../assets/home/trouble.svg';
import type { CSSProperties } from 'react';

interface SkinAnalysisSectionProps {
  hasRecord: boolean;
  rednessGrade: string | null;
  troubleGrade: string | null;
  onViewDetails: () => void;
}

function AnalysisItem({
  label,
  value,
  icon,
  hasRecord,
  style,
}: {
  label: string;
  value: string;
  icon: string;
  hasRecord: boolean;
  style: CSSProperties;
}) {
  return (
    <div
      style={style}
      className={`flex h-[72px] min-w-0 shrink-0 items-center gap-3 rounded-[10px] border bg-card p-4 ${
        hasRecord ? 'border-main-500' : 'border-gray-100'
      }`}
    >
      <img src={icon} alt="" className="size-8 shrink-0" />
      <div className="flex flex-col gap-0.5 whitespace-nowrap">
        <strong className="text-caption-3 leading-[normal]">{label}</strong>
        <span className="text-body leading-[normal] text-text-secondary">{value}</span>
      </div>
    </div>
  );
}

function SkinAnalysisSection({
  hasRecord,
  rednessGrade,
  troubleGrade,
  onViewDetails,
}: SkinAnalysisSectionProps) {
  return (
    <section className="flex h-[109px] w-full flex-col gap-2">
      <div className="flex h-[29px] items-center gap-3 overflow-hidden">
        <h2 className="shrink-0 text-headline leading-[21px] text-text-section">피부 AI 분석</h2>
        <span className="h-px min-w-0 flex-1" />
        <button
          type="button"
          onClick={onViewDetails}
          className="shrink-0 text-body-small leading-[normal] text-text-secondary hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-main-500"
        >
          자세히 보러가기
        </button>
      </div>

      <div className="flex h-[72px] gap-4">
        <AnalysisItem
          label="붉은기"
          value={rednessGrade ?? '측정 전'}
          icon={rednessIcon}
          hasRecord={hasRecord}
          style={{ width: 'calc((100% - 15px) / 2)' }}
        />
        <AnalysisItem
          label="트러블"
          value={troubleGrade ?? '측정 전'}
          icon={troubleIcon}
          hasRecord={hasRecord}
          style={{ width: 'calc((100% - 17px) / 2)' }}
        />
      </div>
    </section>
  );
}

export default SkinAnalysisSection;

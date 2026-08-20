import { formatReportText } from '../../utils/reportText';

export interface AnalysisMetric {
  label: string;
  value: string;
  iconSrc?: string;
  iconClassName?: string;
}

export interface AnalysisSummaryCardProps {
  dateLabel: string;
  title: string;
  metrics: [AnalysisMetric, AnalysisMetric];
  onDetails?: () => void;
  className?: string;
}

function AnalysisSummaryCard({
  dateLabel,
  title,
  metrics,
  onDetails,
  className = '',
}: AnalysisSummaryCardProps) {
  return (
    <section className={`min-h-[178px] rounded-[10px] bg-main-500 p-4 text-white ${className}`}>
      <div className="flex items-center justify-between text-body-small">
        <span className="text-caption-3 leading-normal text-main-100">{dateLabel}</span>
        <button
          type="button"
          onClick={onDetails}
          className="text-caption text-main-100 underline-offset-2 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          자세히 보러가기 ›
        </button>
      </div>

      <h2 className="mt-4 whitespace-pre-line break-keep text-[18px] font-semibold leading-6">
        {formatReportText(title)}
      </h2>

      <div className="mt-4 grid grid-cols-2 border-t border-white/30 pt-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex flex-col gap-2">
            <span className="flex items-center gap-2 text-caption">
              {metric.iconSrc && (
                <span
                  aria-hidden="true"
                  className={`size-[9px] shrink-0 ${metric.iconClassName ?? 'bg-white'}`}
                  style={{
                    WebkitMask: `url("${metric.iconSrc}") center / contain no-repeat`,
                    mask: `url("${metric.iconSrc}") center / contain no-repeat`,
                  }}
                />
              )}
              {metric.label}
            </span>
            <strong className="text-[16px] font-semibold leading-none">{metric.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AnalysisSummaryCard;

import ComparisonItem, { type ComparisonDetail } from './ComparisonItem';

export interface ComparisonMetric {
  label: string;
  direction: 'up' | 'down' | 'steady';
  status?: 'caution' | 'safe' | 'danger';
  detail?: ComparisonDetail;
  onClick?: () => void;
}

export interface ComparisonCardProps {
  title: string;
  metrics: ComparisonMetric[];
  analysisCount?: number;
  className?: string;
}

function ComparisonCard({
  title,
  metrics,
  analysisCount = 2,
  className = '',
}: ComparisonCardProps) {
  return (
    <section
      className={`overflow-hidden rounded-[10px] border border-main-500 bg-main-50 ${className}`}
    >
      <h2 className="bg-main-100 px-4 py-4 text-title-3 leading-normal text-text-primary">
        {title}
      </h2>

      <div className="space-y-2 px-4 py-2">
        {metrics.map((metric) => (
          <ComparisonItem
            key={metric.label}
            {...metric}
            showTrend={analysisCount >= 2}
            showAveragePrefix={analysisCount >= 2}
          />
        ))}
      </div>
    </section>
  );
}

export default ComparisonCard;

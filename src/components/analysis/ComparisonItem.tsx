import { useId, useState } from 'react';
import { formatReportText } from '../../utils/reportText';
import { MetricBadge, StatusBadge, TrendBadge } from '../common';

export interface ComparisonDetail {
  status?: 'caution' | 'safe' | 'danger';
  description: string;
  factors: string[];
  footer?: string;
}

export interface ComparisonItemProps {
  label: string;
  direction: 'up' | 'down' | 'steady';
  status?: 'caution' | 'safe' | 'danger';
  showTrend?: boolean;
  showAveragePrefix?: boolean;
  detail?: ComparisonDetail;
  onClick?: () => void;
  className?: string;
}

function ComparisonItem({
  label,
  direction,
  status = 'caution',
  showTrend = true,
  showAveragePrefix = false,
  detail,
  onClick,
  className = '',
}: ComparisonItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const detailId = useId();

  const handleClick = () => {
    if (detail) setIsExpanded((expanded) => !expanded);
    onClick?.();
  };

  return (
    <article className={`w-full rounded-[10px] ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        aria-expanded={detail ? isExpanded : undefined}
        aria-controls={detail ? detailId : undefined}
        className="flex h-[43px] w-full shrink-0 items-center justify-between rounded-[10px] px-4 py-2 text-left hover:bg-[rgba(93,171,34,0.30)] focus-visible:bg-[rgba(93,171,34,0.30)] focus-visible:outline-none"
      >
        <span className="text-caption-3 leading-normal text-text-primary">{label}</span>
        {!isExpanded && showTrend ? (
          <TrendBadge
            trend={direction === 'down' ? 'decrease' : direction === 'up' ? 'increase' : 'steady'}
          />
        ) : (
          <StatusBadge status={detail?.status ?? status} />
        )}
      </button>

      {detail && isExpanded && (
        <div id={detailId} className="px-4 pb-4">
          <p className="whitespace-pre-line break-keep text-body-small leading-normal text-text-primary">
            {formatReportText(detail.description)}
          </p>

          <ul className="mt-5 flex flex-col items-start gap-2">
            {detail.factors.map((factor) => {
              const [value, recommendation] = factor.split(' · ');

              return (
                <li key={factor}>
                  <MetricBadge
                    value={showAveragePrefix ? `평균 ${value}` : value}
                    recommendation={recommendation ?? ''}
                  />
                </li>
              );
            })}
          </ul>

          {detail.footer && (
            <p className="mt-3 whitespace-pre-line break-keep text-body-small leading-5 text-text-secondary">
              {formatReportText(detail.footer)}
            </p>
          )}
        </div>
      )}
    </article>
  );
}

export default ComparisonItem;

export interface TrendBadgeProps {
  trend?: 'decrease' | 'increase' | 'steady';
  className?: string;
}

const TREND_STYLES = {
  decrease: {
    label: '▼ 하강',
    className: 'border-main-500 bg-main-50 text-main-500',
  },
  increase: {
    label: '▲ 상승',
    className: 'border-danger bg-danger-light text-danger',
  },
  steady: {
    label: '-- 유지',
    className: 'border-gray-200 bg-card text-text-secondary',
  },
} as const;

function TrendBadge({ trend = 'decrease', className = '' }: TrendBadgeProps) {
  const { label, className: trendClassName } = TREND_STYLES[trend];

  return (
    <span
      className={`inline-flex h-[27px] w-[60px] shrink-0 items-center justify-center gap-[10px] whitespace-nowrap rounded-xl border px-2 py-1 text-caption-3 ${trendClassName} ${className}`}
    >
      {label}
    </span>
  );
}

export default TrendBadge;

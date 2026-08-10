interface TrendBadgeProps {
  trend?: 'decrease' | 'increase' | 'steady';
  className?: string;
}

const TREND_STYLES = {
  decrease: {
    label: '▼ 하강',
    className: 'w-[60px] border-main-500 bg-main-50 text-main-500',
  },
  increase: {
    label: '▲ 상승',
    className: 'w-[60px] border-danger bg-danger-light text-danger',
  },
  steady: {
    label: '-- 유지',
    className: 'w-[58px] border-gray-200 bg-card text-text-secondary',
  },
} as const;

function TrendBadge({ trend = 'decrease', className = '' }: TrendBadgeProps) {
  const { label, className: trendClassName } = TREND_STYLES[trend];

  return (
    <span
      className={`inline-flex h-[27px] items-center justify-center gap-[10px] whitespace-nowrap rounded-xl border px-2 py-1 text-caption-3 ${trendClassName} ${className}`}
    >
      {label}
    </span>
  );
}

export default TrendBadge;

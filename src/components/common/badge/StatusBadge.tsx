export interface StatusBadgeProps {
  status?: 'caution' | 'safe' | 'danger';
  className?: string;
}

const STATUS_STYLES = {
  caution: {
    label: '주의',
    className: 'border-warning bg-warning-light text-warning',
  },
  safe: {
    label: '안전',
    className: 'border-main-500 bg-main-50 text-main-500',
  },
  danger: {
    label: '위험',
    className: 'border-danger bg-danger-light text-danger',
  },
} as const;

function StatusBadge({ status = 'caution', className = '' }: StatusBadgeProps) {
  const { label, className: statusClassName } = STATUS_STYLES[status];

  return (
    <span
      className={`inline-flex items-center justify-center gap-[10px] whitespace-nowrap rounded-xl border px-2 py-1 text-caption-2 ${statusClassName} ${className}`}
    >
      {label}
    </span>
  );
}

export default StatusBadge;

import type { HTMLAttributes } from 'react';

export interface MetricBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  value: string;
  recommendation: string;
}

function MetricBadge({ value, recommendation, className = '', ...props }: MetricBadgeProps) {
  return (
    <span
      className={`flex w-fit items-center justify-center gap-[10px] rounded-[14px] border border-gray-100 bg-card px-3 py-1 text-caption leading-normal text-gray-200 ${className}`}
      {...props}
    >
      <span>{value}</span>
      <span>
        <span aria-hidden="true">· </span>
        <span className="text-main-800">{recommendation}</span>
      </span>
    </span>
  );
}

export default MetricBadge;

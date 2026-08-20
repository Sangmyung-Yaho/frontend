import { type HTMLAttributes, type ReactNode } from 'react';

export interface FactorBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
}

function FactorBadge({
  children = '영향 높은 요인 없음',
  className = '',
  ...props
}: FactorBadgeProps) {
  return (
    <span
      className={`flex w-fit self-start flex-col items-start rounded-2xl border border-gray-100 bg-card px-2 py-1 text-caption-2 leading-normal text-main-800 ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export default FactorBadge;

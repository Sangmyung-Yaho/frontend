import type { HTMLAttributes, ReactNode } from 'react';

export interface CauseBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
}

function CauseBadge({
  children = '영향 높은 요인 2개',
  className = '',
  ...props
}: CauseBadgeProps) {
  return (
    <span
      className={`flex w-fit flex-col items-start rounded-2xl border border-danger bg-danger-light px-2 py-1 text-caption-3 leading-normal text-danger ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export default CauseBadge;

import { type HTMLAttributes, type ReactNode } from 'react';
import { BackButton } from '../components/common';

export interface BackHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  onBack?: () => void;
  backLabel?: string;
}

function BackHeader({
  title,
  onBack,
  backLabel = '뒤로 가기',
  className = '',
  ...props
}: BackHeaderProps) {
  return (
    <header
      className={`flex h-14 w-[393px] max-w-full items-center gap-4 bg-background py-4 pl-8 pr-4 ${className}`}
      {...props}
    >
      <BackButton
        aria-label={backLabel}
        onClick={onBack}
      />
      <h1 className="text-title-2 leading-6 text-text-primary">{title}</h1>
    </header>
  );
}

export default BackHeader;

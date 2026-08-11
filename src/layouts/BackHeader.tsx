import { type HTMLAttributes, type ReactNode } from 'react';
import arrowLeftIcon from '../assets/icons/arrow-left.svg';

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
  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    window.history.back();
  };

  return (
    <header
      className={`flex h-14 w-[393px] max-w-full items-center gap-4 bg-background py-4 pl-8 pr-4 ${className}`}
      {...props}
    >
      <button
        type="button"
        aria-label={backLabel}
        onClick={handleBack}
        className="flex h-6 w-[9px] shrink-0 items-center justify-center text-text-primary focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-500"
      >
        <img src={arrowLeftIcon} alt="" className="h-[18px] w-[9px] shrink-0 aspect-[1/2]" />
      </button>
      <h1 className="text-title-2 leading-6 text-text-primary">{title}</h1>
    </header>
  );
}

export default BackHeader;

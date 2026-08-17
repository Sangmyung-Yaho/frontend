import { type ButtonHTMLAttributes } from 'react';
import arrowLeftIcon from '../../../assets/icons/arrow-left.svg';

export interface BackButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  iconSrc?: string;
  iconClassName?: string;
}

function BackButton({
  iconSrc = arrowLeftIcon,
  iconClassName = '',
  className = '',
  onClick,
  type = 'button',
  'aria-label': ariaLabel = '뒤로 가기',
  ...props
}: BackButtonProps) {
  const sizeClassName = className || 'h-6 w-[9px]';

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      onClick={onClick ?? (() => window.history.back())}
      className={`flex shrink-0 items-center justify-center focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-500 ${sizeClassName}`}
      {...props}
    >
      <img
        src={iconSrc}
        alt=""
        className={`h-[18px] w-[9px] shrink-0 ${iconClassName}`}
        aria-hidden="true"
      />
    </button>
  );
}

export default BackButton;

import { forwardRef, type ButtonHTMLAttributes } from 'react';

type AgreementModalCloseButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const AgreementModalCloseButton = forwardRef<
  HTMLButtonElement,
  AgreementModalCloseButtonProps
>(({ className = '', ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={`group absolute flex size-[10px] items-center justify-center ${className}`}
    {...props}
  >
    <svg
      width="10"
      height="10"
      viewBox="0 0 11.5 11.5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="text-[#686868] transition-colors group-hover:text-main-500 group-focus-visible:text-main-500"
    >
      <path
        d="M0.75 10.75L5.75 5.75M5.75 5.75L10.75 0.75M5.75 5.75L0.75 0.75M5.75 5.75L10.75 10.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
));

AgreementModalCloseButton.displayName = 'AgreementModalCloseButton';

export default AgreementModalCloseButton;

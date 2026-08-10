import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  suffix?: string;
  errorMessage?: string;
  wrapperClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className = '', wrapperClassName = '', suffix, errorMessage, id, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = errorMessage ? `${inputId}-error` : undefined;
  const ringClassName = errorMessage
    ? 'ring-danger focus-within:ring-danger'
    : 'ring-gray-100 focus-within:ring-main-500';

  return (
    <div className={`flex w-full flex-col gap-1 ${wrapperClassName}`}>
      <div
        className={`flex h-[49px] w-full items-center rounded-lg bg-card p-4 ring-1 ring-inset ${ringClassName}`}
      >
        <div className="flex h-[17px] w-full items-center gap-2 overflow-hidden">
          <input
            {...props}
            ref={ref}
            id={inputId}
            aria-invalid={Boolean(errorMessage)}
            aria-describedby={errorId}
            className={`h-[19px] min-w-0 flex-1 bg-transparent font-sans text-body leading-[19px] text-text-primary outline-none placeholder:text-text-primary disabled:cursor-not-allowed ${className}`}
          />
          {suffix && (
            <span className="inline-flex h-5 w-[22px] shrink-0 items-center justify-end text-body leading-5 text-text-secondary opacity-80">
              {suffix}
            </span>
          )}
        </div>
      </div>
      {errorMessage && (
        <p id={errorId} className="h-[14px] text-caption leading-[14px] text-danger">
          {errorMessage}
        </p>
      )}
    </div>
  );
});

export default Input;

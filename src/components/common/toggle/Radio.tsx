import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: ReactNode;
  size?: 'default' | 'compact';
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, className = '', disabled, size = 'default', ...props }, ref) => {
    const indicatorClassName =
      size === 'compact' ? 'h-5 w-5 after:h-3 after:w-3' : 'h-6 w-6 after:h-3 after:w-3';

    return (
      <label
        className={`inline-flex items-center gap-3 ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${className}`}
      >
        <input ref={ref} type="radio" disabled={disabled} className="peer sr-only" {...props} />
        <span
          className={`flex shrink-0 items-center justify-center rounded-full border border-gray-100 bg-white transition-colors after:scale-0 after:rounded-full after:bg-main-500 after:transition-transform after:content-[''] peer-checked:border-main-500 peer-checked:after:scale-100 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-main-500 ${indicatorClassName}`}
        />
        {label && <span className="text-body text-text-primary">{label}</span>}
      </label>
    );
  },
);

Radio.displayName = 'Radio';

export default Radio;

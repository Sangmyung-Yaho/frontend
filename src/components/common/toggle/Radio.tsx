import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, className = '', disabled, ...props }, ref) => (
    <label
      className={`inline-flex items-center gap-3 ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${className}`}
    >
      <input ref={ref} type="radio" disabled={disabled} className="peer sr-only" {...props} />
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-gray-100 bg-white transition-colors after:h-3 after:w-3 after:scale-0 after:rounded-full after:bg-main-500 after:transition-transform after:content-[''] peer-checked:border-main-500 peer-checked:after:scale-100 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-main-500" />
      {label && <span className="text-body text-text-primary">{label}</span>}
    </label>
  ),
);

Radio.displayName = 'Radio';

export default Radio;

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

export interface ToggleSwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
}

const ToggleSwitch = forwardRef<HTMLInputElement, ToggleSwitchProps>(
  ({ label, className = '', disabled, ...props }, ref) => (
    <label
      className={`inline-flex items-center gap-3 ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${className}`}
    >
      <input
        ref={ref}
        type="checkbox"
        role="switch"
        disabled={disabled}
        className="peer sr-only"
        {...props}
      />
      <span className="relative h-6 w-12 shrink-0 rounded-full bg-gray-100 transition-colors after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform after:content-[''] peer-checked:bg-main-500 peer-checked:after:translate-x-6 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-main-500 peer-disabled:bg-gray-50" />
      {label && <span className="text-body text-text-primary">{label}</span>}
    </label>
  ),
);

ToggleSwitch.displayName = 'ToggleSwitch';

export default ToggleSwitch;

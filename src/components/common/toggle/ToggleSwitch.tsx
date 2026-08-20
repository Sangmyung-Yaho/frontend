import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

export interface ToggleSwitchProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> {
  label?: ReactNode;
  size?: 'default' | 'compact';
}

const ToggleSwitch = forwardRef<HTMLInputElement, ToggleSwitchProps>(
  ({ label, className = '', disabled, size = 'default', ...props }, ref) => {
    const switchClassName =
      size === 'compact'
        ? 'h-5 w-10 after:left-0.5 after:top-0.5 after:h-4 after:w-4 peer-checked:after:translate-x-5'
        : 'h-6 w-12 after:left-1 after:top-1 after:h-4 after:w-4 peer-checked:after:translate-x-6';

    return (
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
        <span
          className={`relative shrink-0 rounded-full bg-gray-100 transition-colors after:absolute after:rounded-full after:bg-white after:transition-transform after:content-[''] peer-checked:bg-main-500 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-main-500 peer-disabled:bg-gray-50 ${switchClassName}`}
        />
        {label && <span className="text-body text-text-primary">{label}</span>}
      </label>
    );
  },
);

ToggleSwitch.displayName = 'ToggleSwitch';

export default ToggleSwitch;

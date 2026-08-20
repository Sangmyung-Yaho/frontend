import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface NumberOptionProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  value: ReactNode;
  selected?: boolean;
}

function NumberOption({
  value,
  selected = false,
  className = '',
  type = 'button',
  ...props
}: NumberOptionProps) {
  const stateClassName = selected
    ? 'w-16 rounded-[11px] border-main-500 bg-main-50 text-main-500'
    : 'w-16 rounded-[10px] border-gray-100 bg-card text-text-secondary';

  return (
    <button
      {...props}
      type={type}
      aria-pressed={selected}
      className={`flex h-[54px] items-center justify-center border p-px ${stateClassName} ${className}`}
    >
      <span className="inline-flex h-[21px] w-[8.97px] items-center justify-center font-sans text-body leading-[21px]">
        {value}
      </span>
    </button>
  );
}

export default NumberOption;

interface LoadingIndicatorProps {
  className?: string;
  label?: string;
}

function LoadingIndicator({ className = '', label = '로딩 중' }: LoadingIndicatorProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={`flex size-[132px] items-center justify-center overflow-hidden ${className}`}
    >
      <svg
        aria-hidden="true"
        className="size-[122px] shrink-0"
        viewBox="0 0 122 122"
        fill="none"
      >
        <circle cx="61" cy="61" r="58" className="stroke-main-100" strokeWidth="6" />
        <circle
          cx="61"
          cy="61"
          r="58"
          className="origin-center animate-[spin_1.2s_steps(3,end)_infinite] stroke-main-500 motion-reduce:animate-none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="24 67.1"
        />
      </svg>
    </div>
  );
}

export default LoadingIndicator;

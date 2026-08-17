interface OnboardingProgressProps {
  currentStep: number;
  totalSteps?: number;
}

function OnboardingProgress({ currentStep, totalSteps = 6 }: OnboardingProgressProps) {
  const progressWidth =
    currentStep === totalSteps ? '100%' : `calc(${currentStep} * (100% - 1px) / ${totalSteps})`;

  return (
    <div
      className="flex w-full shrink-0 flex-col gap-2 py-2"
      aria-label={`온보딩 ${currentStep}/${totalSteps} 단계`}
    >
      <span className="text-[10.5px] font-bold tracking-[0.525px] text-main-500">
        STEP {currentStep} / {totalSteps}
      </span>
      <div className="h-1 w-full overflow-hidden rounded-full bg-gray-50">
        <div
          className="h-full rounded-full bg-main-500 transition-[width] duration-300"
          style={{ width: progressWidth }}
        />
      </div>
    </div>
  );
}

export default OnboardingProgress;

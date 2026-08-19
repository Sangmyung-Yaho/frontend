interface HomeCheckinCardProps {
  isCheckedIn: boolean;
  checkinSummary: string;
  onAction: () => void;
}

function HomeCheckinCard({ isCheckedIn, checkinSummary, onAction }: HomeCheckinCardProps) {
  return (
    <section className="flex min-h-[178px] w-full flex-col gap-2 rounded-[10px] bg-main-800 px-6 py-4 text-card">
      <p
        className={`flex h-[19px] items-center text-caption-2 leading-[normal] ${
          isCheckedIn ? 'text-card' : 'text-main-100'
        }`}
      >
        {isCheckedIn ? '오늘의 체크인 완료' : '아직 오늘 체크인 전이에요.'}
      </p>

      <h2 className="flex min-h-[72px] items-start text-[19px] font-semibold leading-[23px]">
        {isCheckedIn ? (
          checkinSummary
        ) : (
          <>
            30초면
            <br />
            오늘 원인을 알 수 있어요.
          </>
        )}
      </h2>

      <button
        type="button"
        onClick={onAction}
        className="flex h-[30px] w-full shrink-0 items-center justify-center rounded-[10px] bg-card text-caption-3 text-text-primary transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-500"
      >
        {isCheckedIn ? '리포트 보기' : '체크인 시작하기'}
      </button>
    </section>
  );
}

export default HomeCheckinCard;

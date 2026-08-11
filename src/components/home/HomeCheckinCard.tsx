interface HomeCheckinCardProps {
  isCheckedIn: boolean;
  checkinTitleLines: [string, string];
  onAction: () => void;
}

function HomeCheckinCard({ isCheckedIn, checkinTitleLines, onAction }: HomeCheckinCardProps) {
  return (
    <section className="flex h-[158px] w-full flex-col gap-2 rounded-[10px] bg-main-800 px-6 py-4 text-card">
      <p
        className={`flex h-[19px] items-center text-caption-2 leading-[normal] ${
          isCheckedIn ? 'text-card' : 'text-main-100'
        }`}
      >
        {isCheckedIn ? '오늘의 체크인 완료' : '아직 오늘 체크인 전이에요.'}
      </p>

      <h2 className="flex h-[61px] items-start pb-[11px] text-title-2 leading-[24px]">
        {isCheckedIn ? (
          <>
            {checkinTitleLines[0]}
            <br />
            {checkinTitleLines[1]}
          </>
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
        className="flex h-[30px] w-full items-center justify-center rounded-[10px] bg-card text-caption-3 text-text-primary transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-500"
      >
        {isCheckedIn ? '리포트 보기' : '체크인 시작하기'}
      </button>
    </section>
  );
}

export default HomeCheckinCard;

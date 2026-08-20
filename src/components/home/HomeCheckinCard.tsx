import { formatReportText } from '../../utils/reportText';

interface HomeCheckinCardProps {
  isCheckedIn: boolean;
  isReportReady: boolean;
  checkinSummary: string;
  onAction: () => void;
}

function HomeCheckinCard({
  isCheckedIn,
  isReportReady,
  checkinSummary,
  onAction,
}: HomeCheckinCardProps) {
  const isAnalysisIncomplete = isCheckedIn && !isReportReady;

  return (
    <section className="flex min-h-[178px] w-full flex-col gap-2 rounded-[10px] bg-main-800 px-6 py-4 text-card">
      <p
        className={`flex h-[19px] items-center text-caption-2 leading-[normal] ${
          isCheckedIn ? 'text-card' : 'text-main-100'
        }`}
      >
        {isReportReady
          ? '오늘의 체크인 완료'
          : isAnalysisIncomplete
            ? '피부 분석을 완료해주세요.'
            : '아직 오늘 체크인 전이에요.'}
      </p>

      <h2 className="-mr-1 flex min-h-[72px] items-start whitespace-pre-line break-keep text-[17px] font-semibold leading-[23px]">
        {isReportReady ? (
          formatReportText(checkinSummary)
        ) : isAnalysisIncomplete ? (
          <>
            사진을 다시 등록하면
            <br />
            분석을 이어갈 수 있어요.
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
        className="flex h-[30px] w-full shrink-0 items-center justify-center rounded-[10px] bg-card text-caption-3 text-text-primary transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-500"
      >
        {isReportReady ? '리포트 보기' : isAnalysisIncomplete ? '분석 다시하기' : '체크인 시작하기'}
      </button>
    </section>
  );
}

export default HomeCheckinCard;

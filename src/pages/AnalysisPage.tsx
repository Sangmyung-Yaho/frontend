import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getReports, type ReportListItem, type SkinLevel } from '../api/reports';
import { getSkinAnalysisHistory } from '../api/skinAnalysis';
import calendarIcon from '../assets/icons/calender.svg';
import emptyAnalysisIcon from '../assets/icons/emptyAnalysisIcon.svg';
import statusCircleIcon from '../assets/icons/status-circle.svg';
import { AnalysisSummaryCard, CalendarModal } from '../components/analysis';
import { Button, StatusBadge } from '../components/common';
import { BottomNavigation, type NavigationItem } from '../layouts';

const levelLabel: Record<SkinLevel, string> = {
  SAFE: '낮음',
  CAUTION: '보통',
  DANGER: '높음',
};

const levelStatus: Record<SkinLevel, 'safe' | 'caution' | 'danger'> = {
  SAFE: 'safe',
  CAUTION: 'caution',
  DANGER: 'danger',
};

const levelColor: Record<SkinLevel, string> = {
  SAFE: 'bg-main-100',
  CAUTION: 'bg-warning',
  DANGER: 'bg-danger',
};

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatSearchDate(date: Date) {
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}

function formatRecordDate(date: string) {
  const [, month, day] = date.split('-');
  return `${Number(month)}/${Number(day)}`;
}

function formatSummaryDate(date: string) {
  const formatted = new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
  }).format(new Date(`${date}T00:00:00`));
  return date === formatDateKey(new Date()) ? `오늘 · ${formatted}` : formatted;
}

function AnalysisPage() {
  const navigate = useNavigate();
  const reportsQuery = useQuery({
    queryKey: ['reports'],
    queryFn: getReports,
    staleTime: 30_000,
    retry: 1,
  });
  const historyQuery = useQuery({
    queryKey: ['skin-analysis-history', 28],
    queryFn: () => getSkinAnalysisHistory(28),
    staleTime: 30_000,
    retry: 1,
  });

  const handleNavigation = (item: NavigationItem) => {
    const routeByItem: Record<NavigationItem, string> = {
      home: '/home',
      analysis: '/analysis',
      mission: '/mission',
      my: '/my',
    };
    navigate(routeByItem[item]);
  };

  const isPending = reportsQuery.isPending || historyQuery.isPending;
  const isError = reportsQuery.isError || historyQuery.isError;
  const reports = reportsQuery.data ?? [];

  return (
    <main className="relative flex min-h-dvh flex-col bg-background">
      {isPending ? (
        <CenteredMessage message="분석 기록을 불러오고 있어요." />
      ) : isError ? (
        <CenteredMessage message="분석 기록을 불러오지 못했어요.">
          <Button
            onClick={() => {
              void reportsQuery.refetch();
              void historyQuery.refetch();
            }}
          >
            다시 시도
          </Button>
        </CenteredMessage>
      ) : reports.length === 0 ? (
        <EmptyAnalysis onCheckin={() => navigate('/checkin')} />
      ) : (
        <AnalysisReport reports={reports} history={historyQuery.data?.history ?? []} />
      )}

      <BottomNavigation
        activeItem="analysis"
        onChange={handleNavigation}
        className="fixed bottom-0 left-1/2 z-20 h-[calc(62px+env(safe-area-inset-bottom))] -translate-x-1/2 pb-[calc(8px+env(safe-area-inset-bottom))]"
      />
    </main>
  );
}

function EmptyAnalysis({ onCheckin }: { onCheckin: () => void }) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center pb-[calc(62px+env(safe-area-inset-bottom))] pt-[10px]">
      <div className="flex w-full -translate-y-5 flex-col items-center">
        <div className="mb-5 flex size-[88px] shrink-0 items-center justify-center rounded-[999px] bg-main-50">
          <img src={emptyAnalysisIcon} alt="" className="shrink-0" />
        </div>
        <h1 className="text-body-small font-semibold leading-5 text-text-primary">
          체크인 기록이 없어요.
        </h1>
        <p className="mt-1 text-caption leading-4 text-text-secondary">
          체크인을 하면 리포트가 여기에 쌓여요.
        </p>
        <Button className="mt-6 !h-[42px] text-body-small font-medium" onClick={onCheckin}>
          체크인 하러가기
        </Button>
      </div>
    </section>
  );
}

interface AnalysisReportProps {
  reports: ReportListItem[];
  history: Array<{ date: string; redness_level: SkinLevel; trouble_level: SkinLevel }>;
}

function AnalysisReport({ reports, history }: AnalysisReportProps) {
  const navigate = useNavigate();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const selectedDateKey = selectedDate ? formatDateKey(selectedDate) : null;
  const visibleReports = selectedDateKey
    ? reports.filter((report) => report.report_date === selectedDateKey)
    : reports;
  const summaryReport = visibleReports[0] ?? reports[0];
  const summaryHistory = history.find((item) => item.date === summaryReport.report_date);
  const rednessLevel = summaryHistory?.redness_level ?? summaryReport.skin_level;
  const troubleLevel = summaryHistory?.trouble_level ?? summaryReport.skin_level;

  return (
    <div className="flex flex-1 flex-col pb-[calc(78px+env(safe-area-inset-bottom))] pt-[10px]">
      <AnalysisSummaryCard
        dateLabel={formatSummaryDate(summaryReport.report_date)}
        title={summaryReport.summary}
        metrics={[
          {
            label: '붉은기',
            value: levelLabel[rednessLevel],
            iconSrc: statusCircleIcon,
            iconClassName: levelColor[rednessLevel],
          },
          {
            label: '트러블',
            value: levelLabel[troubleLevel],
            iconSrc: statusCircleIcon,
            iconClassName: levelColor[troubleLevel],
          },
        ]}
        onDetails={() => navigate(`/analysis/detail?reportId=${summaryReport.report_id}`)}
      />

      <button
        type="button"
        onClick={() => setIsCalendarOpen(true)}
        className={`mt-6 flex h-[54px] shrink-0 items-center gap-3 rounded-[10px] border bg-card px-4 text-left text-body-small shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${
          selectedDate ? 'border-main-500 text-text-primary' : 'border-gray-100 text-text-secondary'
        }`}
      >
        <img src={calendarIcon} alt="" className="size-[19px] shrink-0 aspect-square" />
        <span className="font-medium">
          {selectedDate ? formatSearchDate(selectedDate) : '지난 기록을 날짜로 찾아보세요.'}
        </span>
      </button>

      <div className="mb-4 mt-5 flex items-center justify-between">
        <h2 className="text-title-3">날짜별 기록</h2>
        <span className="text-caption-2 leading-normal text-gray-200">최근 30일</span>
      </div>

      <ol className="space-y-[18px]">
        {visibleReports.map((report) => (
          <li
            key={report.report_id}
            className="grid grid-cols-[max-content_minmax(0,1fr)] items-center gap-x-2"
          >
            <time dateTime={report.report_date} className="text-body-small font-medium">
              {formatRecordDate(report.report_date)}
            </time>
            <button
              type="button"
              onClick={() => navigate(`/analysis/detail?reportId=${report.report_id}`)}
              className="flex min-h-[62px] flex-1 items-center justify-between gap-3 rounded-[10px] border border-gray-50 bg-card px-4 py-3 text-left shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            >
              <span className="min-w-0 text-body-small font-semibold leading-5">
                {report.summary}
              </span>
              <StatusBadge status={levelStatus[report.skin_level]} className="shrink-0" />
            </button>
          </li>
        ))}
      </ol>

      {selectedDate && visibleReports.length === 0 && (
        <p className="py-8 text-center text-body-small text-text-secondary">
          선택한 날짜에 기록이 없어요.
        </p>
      )}

      <p className="mt-auto pt-8 text-caption leading-4 text-text-secondary">
        이 결과는 참고용 정보이며 의료적 진단이 아니에요.
      </p>

      <CalendarModal
        open={isCalendarOpen}
        selectedDate={selectedDate}
        onClose={() => setIsCalendarOpen(false)}
        onSelect={(date) => {
          setSelectedDate(date);
          setIsCalendarOpen(false);
        }}
      />
    </div>
  );
}

function CenteredMessage({ message, children }: { message: string; children?: React.ReactNode }) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-5 pb-[calc(62px+env(safe-area-inset-bottom))] text-center">
      <p className="text-body-small text-text-secondary">{message}</p>
      {children}
    </section>
  );
}

export default AnalysisPage;

import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import emptyAnalysisIcon from '../assets/icons/emptyAnalysisIcon.svg';
import { AnalysisSummaryCard, CalendarModal } from '../components/analysis';
import { Button } from '../components/common';
import StatusBadge from '../components/common/StatusBadge';
import { BottomNavigation, type NavigationItem } from '../layouts';

import calendarIcon from '../assets/icons/calender.svg';
import statusCircleIcon from '../assets/icons/status-circle.svg';

const records = [
  { date: '8/7', description: '수면 부족이 영향을 줬을 수 있어요.', status: 'caution' as const },
  { date: '8/6', description: '수면 부족+스트레스가 겹친 날이에요.', status: 'danger' as const },
  { date: '8/5', description: '전반적으로 양호한 상태예요.', status: 'safe' as const },
];

function formatToday(date: Date) {
  return `오늘 · ${new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
  }).format(date)}`;
}

function AnalysisPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEmpty = searchParams.get('state') === 'empty';

  const handleNavigation = (item: NavigationItem) => {
    const routeByItem: Record<NavigationItem, string> = {
      home: '/home',
      analysis: '/analysis',
      mission: '/mission',
      my: '/my',
    };
    navigate(routeByItem[item]);
  };

  return (
    <main className="relative flex min-h-dvh w-full flex-col bg-background">
      {isEmpty ? <EmptyAnalysis onCheckin={() => navigate('/checkin')} /> : <AnalysisReport />}

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
    <section className="flex flex-1 flex-col items-center justify-center px-4 pb-[calc(62px+env(safe-area-inset-bottom))] pt-[10px]">
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

function AnalysisReport() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();

  return (
    <div className="flex flex-1 flex-col px-4 pb-[calc(78px+env(safe-area-inset-bottom))] pt-[10px]">
      <AnalysisSummaryCard
        dateLabel={formatToday(new Date())}
        title="수면 부족이 트러블 원인일 수 있어요."
        metrics={[
          {
            label: '붉은기',
            value: '낮음',
            iconSrc: statusCircleIcon,
            iconClassName: 'bg-danger',
          },
          {
            label: '트러블',
            value: '보통',
            iconSrc: statusCircleIcon,
            iconClassName: 'bg-warning',
          },
        ]}
      />

      <button
        type="button"
        onClick={() => setIsCalendarOpen(true)}
        className="mt-6 flex h-[54px] shrink-0 items-center gap-3 rounded-[10px] border border-gray-100 bg-card px-4 text-left text-body-small text-text-secondary shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
      >
        <img src={calendarIcon} alt="" className="size-[19px] shrink-0 aspect-square" />
        <span className="font-medium">지난 기록을 날짜로 찾아보세요.</span>
      </button>

      <div className="mb-4 mt-5 flex items-center justify-between">
        <h2 className="text-title-3">날짜별 기록</h2>
        <span className="text-caption-2 leading-normal text-gray-200">최근 30일</span>
      </div>

      <ol className="space-y-[18px]">
        {records.map((record) => (
          <li
            key={record.date}
            className="grid grid-cols-[max-content_minmax(0,1fr)] items-center gap-x-2"
          >
            <time className="text-body-small font-medium">{record.date}</time>
            <article className="flex h-[62px] flex-1 items-center justify-between gap-3 rounded-[10px] border border-gray-50 bg-card px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <p className="text-body-small font-semibold leading-5">{record.description}</p>
              <StatusBadge status={record.status} className="shrink-0" />
            </article>
          </li>
        ))}
      </ol>

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

export default AnalysisPage;

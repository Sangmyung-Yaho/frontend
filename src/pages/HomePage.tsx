import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getHomeDashboard, getUserProfile, type SkinGrade } from '../api/home';
import wave1 from '../assets/home/wave-1.svg';
import wave2 from '../assets/home/wave-2.svg';
import wave3 from '../assets/home/wave-3.svg';
import wave4 from '../assets/home/wave-4.svg';
import { HomeCheckinCard, RoutineCard, SkinAnalysisSection, StreakCard } from '../components/home';
import { BottomNavigation, type NavigationItem } from '../layouts';

const WAVE_ASSETS = [
  { src: wave4, top: 40.06 },
  { src: wave3, top: 74.11 },
  { src: wave1, top: 108.16 },
  { src: wave2, top: 142.21 },
];

const FIGMA_STATUS_BAR_HEIGHT = 54;
const GRADE_LABELS: Record<SkinGrade, string> = {
  SAFE: '낮음',
  CAUTION: '보통',
  DANGER: '높음',
};

function formatToday(date: Date) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(date);
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function HomePage() {
  const navigate = useNavigate();
  const {
    data: dashboard,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['home-dashboard'],
    queryFn: async () => (await getHomeDashboard()).data.data,
    retry: 1,
  });
  const { data: profile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => (await getUserProfile()).data.data,
    staleTime: 5 * 60_000,
    retry: 1,
  });

  const latestAnalysis = dashboard?.latest_skin_analysis ?? null;
  const todayRoutine = dashboard?.today_routine;
  const isTodayCheckedIn = todayRoutine?.is_checkin_completed ?? false;
  const isTodayReportReady =
    isTodayCheckedIn && dashboard?.latest_report?.report_date === formatDateKey(new Date());
  const displayedWeeklyCheckinCount = Math.max(
    0,
    (dashboard?.weekly_checkins.checked_count ?? 0) -
      (isTodayCheckedIn && !isTodayReportReady ? 1 : 0),
  );
  const hasPreviousRecord = latestAnalysis !== null;
  const routines = (todayRoutine?.routines ?? []).slice(0, 2).map((routine) => ({
    title: routine.title,
    duration: `${routine.estimated_minutes}분`,
  }));

  useEffect(() => {
    const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    const previousColor = themeColor?.content;
    themeColor?.setAttribute('content', '#DCEECC');

    return () => {
      if (previousColor) themeColor?.setAttribute('content', previousColor);
    };
  }, []);

  const handleNavigation = (item: NavigationItem) => {
    const routeByItem: Record<NavigationItem, string> = {
      home: '/home',
      analysis: '/analysis',
      mission: '/mission',
      my: '/my',
    };
    navigate(routeByItem[item]);
  };

  const handleCheckinAction = () => {
    if (isTodayReportReady) {
      navigate('/analysis');
      return;
    }

    if (isTodayCheckedIn) {
      navigate('/camera', {
        state: { source: 'checkin', resumeExistingCheckin: true },
      });
      return;
    }

    navigate('/checkin');
  };

  return (
    <main className="relative bg-background">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[calc(137px+env(safe-area-inset-top))] w-[393px] max-w-[100vw] -translate-x-1/2 overflow-hidden bg-gradient-to-b from-main-100 to-background">
        {WAVE_ASSETS.map(({ src, top }) => (
          <img
            key={src}
            src={src}
            alt=""
            className="absolute left-1/2 h-[92.14px] w-[471.21px] max-w-none -translate-x-1/2"
            style={{
              top: `calc(${top - FIGMA_STATUS_BAR_HEIGHT}px + env(safe-area-inset-top))`,
            }}
          />
        ))}
      </div>

      <header className="relative z-10 flex w-[253px] flex-col gap-2 pt-[calc(env(safe-area-inset-top)+24px)] text-main-800">
        <p className="text-caption-3 leading-[17px]">{formatToday(new Date())}</p>
        <h1 className="whitespace-nowrap text-title-1 leading-[29px]">
          {profile?.nickname ?? '사용자'}님, 좋은 아침이에요.
        </h1>
      </header>

      <div
        className="relative z-10 mt-6 flex w-full flex-col gap-6 pb-[calc(78px+env(safe-area-inset-bottom))]"
        aria-busy={isLoading}
      >
        {isError && (
          <div
            role="alert"
            className="flex items-center justify-between rounded-[10px] border border-danger/30 bg-card px-4 py-3 text-body-small"
          >
            <span>홈 정보를 불러오지 못했어요.</span>
            <button
              type="button"
              onClick={() => void refetch()}
              className="font-semibold text-main-700 hover:underline focus-visible:underline"
            >
              다시 시도
            </button>
          </div>
        )}
        <HomeCheckinCard
          isCheckedIn={isTodayCheckedIn}
          isReportReady={isTodayReportReady}
          checkinSummary={dashboard?.latest_report?.summary ?? '오늘 체크인을 완료했어요.'}
          onAction={handleCheckinAction}
        />
        <StreakCard
          days={displayedWeeklyCheckinCount}
          hasRecord={displayedWeeklyCheckinCount > 0}
        />
        <SkinAnalysisSection
          hasRecord={hasPreviousRecord}
          rednessGrade={latestAnalysis ? GRADE_LABELS[latestAnalysis.redness] : null}
          troubleGrade={latestAnalysis ? GRADE_LABELS[latestAnalysis.trouble] : null}
          onViewDetails={() => navigate('/analysis')}
        />
        <RoutineCard
          isCheckedIn={isTodayCheckedIn}
          isAnalysisComplete={isTodayReportReady}
          progress={todayRoutine?.today_progress_percent ?? 0}
          routines={routines}
          onClick={() => {
            if (isTodayCheckedIn && !isTodayReportReady) {
              handleCheckinAction();
              return;
            }
            navigate(isTodayCheckedIn ? '/mission?state=default' : '/mission?state=empty');
          }}
        />
      </div>

      <BottomNavigation
        activeItem="home"
        onChange={handleNavigation}
        className="fixed bottom-0 left-1/2 z-20 h-[calc(62px+env(safe-area-inset-bottom))] -translate-x-1/2 pb-[calc(8px+env(safe-area-inset-bottom))]"
      />
    </main>
  );
}

export default HomePage;

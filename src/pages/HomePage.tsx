import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import wave1 from '../assets/home/wave-1.svg';
import wave2 from '../assets/home/wave-2.svg';
import wave3 from '../assets/home/wave-3.svg';
import wave4 from '../assets/home/wave-4.svg';
import { HomeCheckinCard, RoutineCard, SkinAnalysisSection, StreakCard } from '../components/home';
import { BottomNavigation, type NavigationItem } from '../layouts';
import { HOME_MOCK_DATA, isHomeViewState } from '../mocks/home';

const WAVE_ASSETS = [
  { src: wave4, top: 40.06 },
  { src: wave3, top: 74.11 },
  { src: wave1, top: 108.16 },
  { src: wave2, top: 142.21 },
];

const FIGMA_STATUS_BAR_HEIGHT = 54;

function formatToday(date: Date) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(date);
}

function HomePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedState = searchParams.get('state');
  const viewState = isHomeViewState(requestedState) ? requestedState : 'pending';
  const data = HOME_MOCK_DATA[viewState];

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
      home: '/',
      analysis: '/analysis',
      mission: '/mission',
      my: '/my',
    };
    navigate(routeByItem[item]);
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
          {data.userName}님, 좋은 아침이에요.
        </h1>
      </header>

      <div className="relative z-10 mt-6 flex w-full flex-col gap-6 pb-[calc(78px+env(safe-area-inset-bottom))]">
        <HomeCheckinCard
          isCheckedIn={data.isTodayCheckedIn}
          checkinTitleLines={data.checkinTitleLines}
          onAction={() => navigate(data.isTodayCheckedIn ? '/analysis' : '/checkin')}
        />
        <StreakCard days={data.weeklyRecordDays} hasRecord={data.hasPreviousRecord} />
        <SkinAnalysisSection
          hasRecord={data.hasPreviousRecord}
          rednessGrade={data.rednessGrade}
          troubleGrade={data.troubleGrade}
          onViewDetails={() => navigate('/analysis')}
        />
        <RoutineCard
          isCheckedIn={data.isTodayCheckedIn}
          progress={data.routineProgress}
          routines={data.routines}
          onClick={() => navigate('/mission')}
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

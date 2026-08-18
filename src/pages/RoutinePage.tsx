import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import routineEmptyIcon from '../assets/icons/routine-empty.svg';
import { Button } from '../components/common';
import { RoutineChecklist, RoutineProgressCard } from '../components/routine';
import { BackHeader, BottomNavigation, type NavigationItem } from '../layouts';
import { createRoutineItems, getRoutineViewState } from '../mocks/routine';

interface RoutinePageContentProps {
  viewState: ReturnType<typeof getRoutineViewState>;
}

function RoutinePageContent({ viewState }: RoutinePageContentProps) {
  const navigate = useNavigate();
  const [routines, setRoutines] = useState(() => createRoutineItems(viewState));

  const completedCount = routines.filter((routine) => routine.completed).length;

  const handleNavigation = (item: NavigationItem) => {
    const routeByItem: Record<NavigationItem, string> = {
      home: '/home',
      analysis: '/analysis',
      mission: '/mission',
      my: '/my',
    };
    navigate(routeByItem[item]);
  };

  const handleToggle = (id: string) => {
    setRoutines((current) =>
      current.map((routine) =>
        routine.id === id ? { ...routine, completed: !routine.completed } : routine,
      ),
    );
  };

  return (
    <main className="relative min-h-dvh w-full overflow-x-hidden bg-background text-text-primary">
      <div className="h-[env(safe-area-inset-top)]" aria-hidden="true" />
      <BackHeader title="오늘의 루틴" onBack={() => navigate(-1)} className="!pl-4" />

      {viewState === 'empty' ? (
        <section className="absolute left-1/2 top-1/2 flex w-[368px] max-w-[calc(100%-25px)] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-6">
          <div className="flex w-full flex-col items-center">
            <div className="flex size-[88px] items-center justify-center rounded-full bg-main-50">
              <img src={routineEmptyIcon} alt="" className="size-[50px]" />
            </div>
            <div className="flex flex-col items-center gap-2 pt-4 text-center">
              <h2 className="text-title-3 text-text-analysis">체크인 기록이 없어요.</h2>
              <p className="text-body-small text-text-analysis-muted">
                오늘 체크인하면 맞춤 미션이 나와요.
              </p>
            </div>
          </div>
          <Button onClick={() => navigate('/checkin')}>체크인 하러가기</Button>
        </section>
      ) : (
        <div className="mx-4 flex w-[calc(100%-32px)] flex-col gap-6 pb-[calc(78px+env(safe-area-inset-bottom))]">
          <RoutineProgressCard completedCount={completedCount} totalCount={routines.length} />
          <RoutineChecklist routines={routines} onToggle={handleToggle} />
        </div>
      )}

      <BottomNavigation
        activeItem="mission"
        onChange={handleNavigation}
        className="fixed bottom-0 left-1/2 z-20 h-[calc(62px+env(safe-area-inset-bottom))] -translate-x-1/2 pb-[calc(8px+env(safe-area-inset-bottom))]"
      />
    </main>
  );
}

function RoutinePage() {
  const [searchParams] = useSearchParams();
  const viewState = getRoutineViewState(searchParams.get('state'));

  return <RoutinePageContent key={viewState} viewState={viewState} />;
}

export default RoutinePage;

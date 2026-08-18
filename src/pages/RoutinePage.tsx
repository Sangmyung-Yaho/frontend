import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  getTodayRoutines,
  updateRoutineCheck,
  type RoutineItem,
  type TodayRoutineData,
} from '../api/routines';
import routineEmptyIcon from '../assets/icons/routine-empty.svg';
import { Button } from '../components/common';
import { RoutineChecklist, RoutineProgressCard } from '../components/routine';
import { BackHeader, BottomNavigation, type NavigationItem } from '../layouts';

const TODAY_ROUTINE_QUERY_KEY = ['today-routine'] as const;

function RoutinePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    data: todayRoutine,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: TODAY_ROUTINE_QUERY_KEY,
    queryFn: getTodayRoutines,
    staleTime: 30_000,
    retry: 1,
    refetchInterval: (query) => {
      const routine = query.state.data;
      return routine?.is_generating ||
        (routine?.is_checkin_completed && routine.routines.length === 0)
        ? 2_000
        : false;
    },
  });
  const checkMutation = useMutation({
    mutationFn: ({ routineId, isCompleted }: { routineId: number; isCompleted: boolean }) =>
      updateRoutineCheck(routineId, isCompleted),
    onMutate: async ({ routineId, isCompleted }) => {
      await queryClient.cancelQueries({ queryKey: TODAY_ROUTINE_QUERY_KEY });
      const previousRoutine = queryClient.getQueryData<TodayRoutineData>(TODAY_ROUTINE_QUERY_KEY);

      if (previousRoutine) {
        const completedCount = Math.min(
          previousRoutine.total_count,
          Math.max(0, previousRoutine.completed_count + (isCompleted ? 1 : -1)),
        );
        queryClient.setQueryData<TodayRoutineData>(TODAY_ROUTINE_QUERY_KEY, {
          ...previousRoutine,
          completed_count: completedCount,
          today_progress_percent:
            previousRoutine.total_count === 0
              ? 0
              : Math.round((completedCount / previousRoutine.total_count) * 100),
          routines: previousRoutine.routines.map((routine) =>
            routine.routine_id === routineId ? { ...routine, is_completed: isCompleted } : routine,
          ),
        });
      }

      return { previousRoutine };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousRoutine) {
        queryClient.setQueryData(TODAY_ROUTINE_QUERY_KEY, context.previousRoutine);
      }
    },
    onSuccess: (result) => {
      queryClient.setQueryData<TodayRoutineData>(TODAY_ROUTINE_QUERY_KEY, (current) =>
        current
          ? {
              ...current,
              completed_count: result.completed_count,
              total_count: result.total_count,
              today_progress_percent: result.today_progress_percent,
              routines: current.routines.map((routine) =>
                routine.routine_id === result.routine_id
                  ? { ...routine, is_completed: result.is_completed }
                  : routine,
              ),
            }
          : current,
      );
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: TODAY_ROUTINE_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: ['home-dashboard'] });
    },
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

  const handleToggle = (routine: RoutineItem) => {
    if (checkMutation.isPending) return;

    checkMutation.mutate({
      routineId: routine.routine_id,
      isCompleted: !routine.is_completed,
    });
  };

  const isEmpty = todayRoutine && !todayRoutine.is_checkin_completed;
  const isGenerating =
    todayRoutine?.is_checkin_completed &&
    (todayRoutine.is_generating || todayRoutine.routines.length === 0);

  return (
    <main className="relative min-h-dvh w-full overflow-x-hidden bg-background text-text-primary">
      <div className="h-[env(safe-area-inset-top)]" aria-hidden="true" />
      <BackHeader title="오늘의 루틴" onBack={() => navigate(-1)} className="!pl-4" />

      {isPending ? (
        <StatusSection title="오늘의 루틴을 불러오고 있어요." />
      ) : isError ? (
        <StatusSection title="루틴을 불러오지 못했어요.">
          <Button onClick={() => void refetch()}>다시 시도</Button>
        </StatusSection>
      ) : isEmpty ? (
        <StatusSection
          icon={routineEmptyIcon}
          title="체크인 기록이 없어요."
          description="오늘 체크인하면 맞춤 미션을 받을 수 있어요."
        >
          <Button onClick={() => navigate('/checkin')}>체크인 하러가기</Button>
        </StatusSection>
      ) : isGenerating ? (
        <StatusSection
          title="오늘의 루틴을 만들고 있어요."
          description="잠시 후 다시 확인해주세요."
        />
      ) : todayRoutine ? (
        <div className="mx-4 flex w-[calc(100%-32px)] flex-col gap-6 pb-[calc(78px+env(safe-area-inset-bottom))]">
          <RoutineProgressCard
            completedCount={todayRoutine.completed_count}
            totalCount={todayRoutine.total_count}
          />
          <RoutineChecklist
            routines={todayRoutine.routines}
            onToggle={handleToggle}
            disabledRoutineId={
              checkMutation.isPending ? checkMutation.variables.routineId : undefined
            }
          />
          {checkMutation.isError && (
            <p role="alert" className="text-center text-caption text-danger">
              루틴 상태를 변경하지 못했어요. 다시 시도해주세요.
            </p>
          )}
        </div>
      ) : null}

      <BottomNavigation
        activeItem="mission"
        onChange={handleNavigation}
        className="fixed bottom-0 left-1/2 z-20 h-[calc(62px+env(safe-area-inset-bottom))] -translate-x-1/2 pb-[calc(8px+env(safe-area-inset-bottom))]"
      />
    </main>
  );
}

interface StatusSectionProps {
  icon?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

function StatusSection({ icon, title, description, children }: StatusSectionProps) {
  return (
    <section className="absolute left-1/2 top-1/2 flex w-[368px] max-w-[calc(100%-25px)] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-6">
      <div className="flex w-full flex-col items-center">
        {icon && (
          <div className="flex size-[88px] items-center justify-center rounded-full bg-main-50">
            <img src={icon} alt="" className="size-[50px]" />
          </div>
        )}
        <div className="flex flex-col items-center gap-2 pt-4 text-center">
          <h2 className="text-title-3 text-text-analysis">{title}</h2>
          {description && <p className="text-body-small text-text-analysis-muted">{description}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

export default RoutinePage;

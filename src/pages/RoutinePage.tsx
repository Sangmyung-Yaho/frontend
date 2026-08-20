import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHomeDashboard } from '../api/home';
import {
  getTodayRoutines,
  updateRoutineCheck,
  type RoutineItem,
  type TodayRoutineData,
} from '../api/routines';
import {
  getRecommendedIngredients,
  getRecommendedProducts,
  type IngredientRecommendationResponse,
  type ProductRecommendationResponse,
} from '../api/skinAnalysis';
import { Button, CheckinEmptyState } from '../components/common';
import { RoutineChecklist, RoutineProgressCard } from '../components/routine';
import { BackHeader, BottomNavigation, type NavigationItem } from '../layouts';

const TODAY_ROUTINE_QUERY_KEY = ['today-routine'] as const;

function RoutinePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [openRecommendation, setOpenRecommendation] = useState<'ingredients' | 'products' | null>(
    null,
  );
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
    refetchOnMount: 'always',
    refetchInterval: (query) => {
      const routine = query.state.data;
      return routine?.is_generating ? 2_000 : false;
    },
  });
  const homeDashboardQuery = useQuery({
    queryKey: ['home-dashboard'],
    queryFn: async () => (await getHomeDashboard()).data.data,
    staleTime: 30_000,
    retry: 1,
  });
  const latestSkinAnalysisId = homeDashboardQuery.data?.latest_skin_analysis?.skin_analysis_id;
  const ingredientsQuery = useQuery({
    queryKey: ['skin-analysis-recommendations', latestSkinAnalysisId, 'ingredients'],
    queryFn: () => getRecommendedIngredients(latestSkinAnalysisId!),
    enabled: openRecommendation === 'ingredients' && latestSkinAnalysisId !== undefined,
    staleTime: 30_000,
    retry: 1,
  });
  const productsQuery = useQuery({
    queryKey: ['skin-analysis-recommendations', latestSkinAnalysisId, 'products'],
    queryFn: () => getRecommendedProducts(latestSkinAnalysisId!),
    enabled: openRecommendation === 'products' && latestSkinAnalysisId !== undefined,
    staleTime: 30_000,
    retry: 1,
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
      void queryClient.invalidateQueries({ queryKey: ['home-dashboard'], refetchType: 'none' });
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
  const isGenerating = todayRoutine?.is_checkin_completed && todayRoutine.is_generating;
  const isUnavailable =
    todayRoutine?.is_checkin_completed &&
    !todayRoutine.is_generating &&
    todayRoutine.routines.length === 0;

  return (
    <main
      className={`relative w-full overflow-x-hidden bg-background text-text-primary ${
        isEmpty ? 'h-dvh overflow-y-hidden overscroll-none' : 'min-h-dvh'
      }`}
    >
      <div className="h-[env(safe-area-inset-top)]" aria-hidden="true" />
      <BackHeader title="오늘의 루틴" onBack={() => navigate(-1)} className="!pl-4" />

      {isPending ? (
        <StatusSection title="오늘의 루틴을 불러오고 있어요." />
      ) : isError ? (
        <StatusSection title="루틴을 불러오지 못했어요.">
          <Button onClick={() => void refetch()}>다시 시도</Button>
        </StatusSection>
      ) : isEmpty ? (
        <CheckinEmptyState
          description="오늘 체크인하면 맞춤 미션을 받을 수 있어요."
          onCheckin={() => navigate('/checkin')}
        />
      ) : isGenerating ? (
        <StatusSection
          title="오늘의 루틴을 만들고 있어요."
          description="잠시 후 다시 확인해주세요."
        />
      ) : isUnavailable ? (
        <StatusSection
          title="오늘의 루틴을 만들지 못했어요."
          description="피부 분석을 완료한 뒤 다시 확인해주세요."
        >
          <Button
            onClick={() =>
              navigate('/camera', {
                state: { source: 'checkin', resumeExistingCheckin: true },
              })
            }
          >
            분석 다시하기
          </Button>
        </StatusSection>
      ) : todayRoutine ? (
        <div className="mx-4 flex w-[calc(100%-32px)] flex-col gap-6 pb-[calc(78px+env(safe-area-inset-bottom))]">
          <RoutineProgressCard
            completedCount={todayRoutine.completed_count}
            totalCount={todayRoutine.total_count}
          />
          <RoutineChecklist routines={todayRoutine.routines} onToggle={handleToggle} />
          {checkMutation.isError && (
            <p role="alert" className="text-center text-caption text-danger">
              루틴 상태를 변경하지 못했어요. 다시 시도해주세요.
            </p>
          )}
          <section className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                aria-expanded={openRecommendation === 'ingredients'}
                className={`h-[46px] rounded-[10px] border px-2 text-[15px] font-normal transition-colors ${
                  openRecommendation === 'ingredients'
                    ? 'border-main-800 bg-main-800 text-white'
                    : 'border-main-500 bg-main-500 text-white'
                }`}
                onClick={() =>
                  setOpenRecommendation((current) =>
                    current === 'ingredients' ? null : 'ingredients',
                  )
                }
              >
                추천 성분 보기
              </button>
              <button
                type="button"
                aria-expanded={openRecommendation === 'products'}
                className={`h-[46px] rounded-[10px] border px-2 text-[15px] font-normal transition-colors ${
                  openRecommendation === 'products'
                    ? 'border-main-800 bg-main-800 text-white'
                    : 'border-main-500 bg-main-500 text-white'
                }`}
                onClick={() =>
                  setOpenRecommendation((current) => (current === 'products' ? null : 'products'))
                }
              >
                추천 제품 보기
              </button>
            </div>
            {openRecommendation && (
              <div>
                {openRecommendation === 'ingredients' && (
                  <RecommendationContentGate
                    latestSkinAnalysisId={latestSkinAnalysisId}
                    isAnalysisPending={homeDashboardQuery.isPending}
                    isAnalysisError={homeDashboardQuery.isError}
                    onRetryAnalysis={() => void homeDashboardQuery.refetch()}
                  >
                    <IngredientRecommendationPanel
                      data={ingredientsQuery.data}
                      isPending={ingredientsQuery.isPending}
                      isError={ingredientsQuery.isError}
                      onRetry={() => void ingredientsQuery.refetch()}
                    />
                  </RecommendationContentGate>
                )}
                {openRecommendation === 'products' && (
                  <RecommendationContentGate
                    latestSkinAnalysisId={latestSkinAnalysisId}
                    isAnalysisPending={homeDashboardQuery.isPending}
                    isAnalysisError={homeDashboardQuery.isError}
                    onRetryAnalysis={() => void homeDashboardQuery.refetch()}
                  >
                    <ProductRecommendationPanel
                      data={productsQuery.data}
                      isPending={productsQuery.isPending}
                      isError={productsQuery.isError}
                      onRetry={() => void productsQuery.refetch()}
                    />
                  </RecommendationContentGate>
                )}
              </div>
            )}
          </section>
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
  title: string;
  description?: string;
  children?: React.ReactNode;
}

function isRecommendationPending(status?: string) {
  return status === 'PENDING' || status === 'PROCESSING';
}

interface RecommendationPanelProps {
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
}

function RecommendationContentGate({
  latestSkinAnalysisId,
  isAnalysisPending,
  isAnalysisError,
  onRetryAnalysis,
  children,
}: {
  latestSkinAnalysisId?: number;
  isAnalysisPending: boolean;
  isAnalysisError: boolean;
  onRetryAnalysis: () => void;
  children: React.ReactNode;
}) {
  if (isAnalysisPending) {
    return <RecommendationStatusPanel message="최근 피부 분석을 확인하고 있어요." />;
  }
  if (isAnalysisError) {
    return (
      <RecommendationStatusPanel
        message="최근 피부 분석을 확인하지 못했어요."
        onRetry={onRetryAnalysis}
      />
    );
  }
  if (latestSkinAnalysisId === undefined) {
    return <RecommendationStatusPanel message="피부 분석을 완료하면 확인할 수 있어요." />;
  }
  return children;
}

function RecommendationStatusPanel({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex min-h-[88px] flex-col items-center justify-center gap-3 rounded-[10px] border border-gray-100 bg-card p-4 text-center">
      <p className="text-body-small leading-[17px] text-text-secondary">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="text-caption-3 text-main-600 underline">
          다시 확인
        </button>
      )}
    </div>
  );
}

function IngredientRecommendationPanel({
  data,
  isPending,
  isError,
  onRetry,
}: RecommendationPanelProps & { data?: IngredientRecommendationResponse }) {
  if (isPending || isRecommendationPending(data?.status)) {
    return <RecommendationStatusPanel message="추천 성분을 준비하고 있어요." onRetry={onRetry} />;
  }
  if (isError) {
    return <RecommendationStatusPanel message="추천 성분을 불러오지 못했어요." onRetry={onRetry} />;
  }
  if (data?.status === 'FAILED') {
    return <RecommendationStatusPanel message="이번 분석의 추천 성분을 만들지 못했어요." />;
  }
  if (!data || data.ingredients.length === 0) {
    return <RecommendationStatusPanel message="표시할 추천 성분이 없어요." />;
  }

  return (
    <ul className="flex flex-col gap-2">
      {data.ingredients.map((ingredient) => (
        <li key={ingredient.name} className="rounded-[10px] border border-gray-100 bg-card p-4">
          <strong className="text-caption-3 leading-normal text-main-700">{ingredient.name}</strong>
          <p className="mt-2 text-body-small leading-[17px] text-text-secondary">
            {ingredient.reason}
          </p>
        </li>
      ))}
    </ul>
  );
}

function ProductRecommendationPanel({
  data,
  isPending,
  isError,
  onRetry,
}: RecommendationPanelProps & { data?: ProductRecommendationResponse }) {
  if (isPending || isRecommendationPending(data?.status)) {
    return <RecommendationStatusPanel message="추천 제품을 준비하고 있어요." onRetry={onRetry} />;
  }
  if (isError) {
    return <RecommendationStatusPanel message="추천 제품을 불러오지 못했어요." onRetry={onRetry} />;
  }
  if (data?.status === 'FAILED') {
    return <RecommendationStatusPanel message="이번 분석의 추천 제품을 만들지 못했어요." />;
  }
  if (!data || data.products.length === 0) {
    return <RecommendationStatusPanel message="표시할 추천 제품이 없어요." />;
  }

  return (
    <ul className="flex flex-col gap-2">
      {data.products.map((product) => (
        <li
          key={`${product.brand}-${product.name}`}
          className="rounded-[10px] border border-gray-100 bg-card p-4"
        >
          <p className="text-caption leading-normal text-text-secondary">{product.brand}</p>
          <strong className="mt-1 block text-caption-3 leading-normal text-text-primary">
            {product.name}
          </strong>
          <p className="mt-2 text-body-small leading-[17px] text-text-secondary">
            {product.reason}
          </p>
          {product.matchedIngredient && (
            <p className="mt-2 text-caption leading-normal text-main-700">
              추천 성분 · {product.matchedIngredient}
            </p>
          )}
          {product.productUrl && (
            <a
              href={product.productUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-caption-3 text-main-600 underline underline-offset-2"
            >
              제품 보러가기
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

function StatusSection({ title, description, children }: StatusSectionProps) {
  return (
    <section className="absolute left-1/2 top-1/2 flex w-[368px] max-w-[calc(100%-25px)] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-6">
      <div className="flex w-full flex-col items-center">
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

import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import {
  getLatestReportInteractions,
  getLatestReportSkinSignal,
  getLatestReportWarnings,
  getReport,
  getReports,
  type ChangeStatus,
  type ReportPrimaryCause,
  type SignalDirection,
  type SkinLevel,
} from '../api/reports';
import { getHomeDashboard } from '../api/home';
import { getTodayRoutines } from '../api/routines';
import {
  compareSkinAnalyses,
  getSkinAnalysisDetail,
  getSkinAnalysisHistory,
} from '../api/skinAnalysis';
import statusCircleIcon from '../assets/icons/status-circle.svg';
import { Button } from '../components/common';
import { CauseSection, ComparisonCard, TrendEmptyCard } from '../components/analysis';
import { BackHeader, BottomNavigation, type NavigationItem } from '../layouts';

const levelScore: Record<SkinLevel, number> = { SAFE: 0, CAUTION: 1, DANGER: 2 };
const scoreStatus = ['safe', 'caution', 'danger'] as const;

function AnalysisDetailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedReportId = Number(searchParams.get('reportId'));
  const reportsQuery = useQuery({
    queryKey: ['reports'],
    queryFn: getReports,
    staleTime: 30_000,
    retry: 1,
  });
  const reportId =
    Number.isInteger(requestedReportId) && requestedReportId > 0
      ? requestedReportId
      : reportsQuery.data?.[0]?.report_id;
  const isLatestReport = reportId !== undefined && reportId === reportsQuery.data?.[0]?.report_id;
  const reportQuery = useQuery({
    queryKey: ['report', reportId],
    queryFn: () => getReport(reportId!),
    enabled: reportId !== undefined,
    staleTime: 30_000,
    retry: 1,
  });
  const historyQuery = useQuery({
    queryKey: ['skin-analysis-history', 28],
    queryFn: () => getSkinAnalysisHistory(28),
    staleTime: 30_000,
    retry: 1,
  });
  const homeQuery = useQuery({
    queryKey: ['home-dashboard'],
    queryFn: async () => (await getHomeDashboard()).data.data,
    staleTime: 30_000,
    retry: 1,
  });
  const latestSkinAnalysisId = isLatestReport
    ? homeQuery.data?.latest_skin_analysis?.skin_analysis_id
    : undefined;
  const skinDetailQuery = useQuery({
    queryKey: ['skin-analysis-detail', latestSkinAnalysisId],
    queryFn: () => getSkinAnalysisDetail(latestSkinAnalysisId!),
    enabled: latestSkinAnalysisId !== undefined,
    staleTime: 30_000,
    retry: 1,
  });
  const comparisonQuery = useQuery({
    queryKey: [
      'skin-comparison',
      skinDetailQuery.data?.skin_analysis_id,
      skinDetailQuery.data?.previous_skin_analysis_id,
    ],
    queryFn: () =>
      compareSkinAnalyses(
        skinDetailQuery.data!.skin_analysis_id,
        skinDetailQuery.data!.previous_skin_analysis_id,
      ),
    enabled:
      skinDetailQuery.data !== undefined && skinDetailQuery.data.previous_skin_analysis_id !== null,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });
  const warningsQuery = useQuery({
    queryKey: ['latest-report-warnings'],
    queryFn: getLatestReportWarnings,
    enabled: isLatestReport,
    staleTime: 30_000,
    retry: false,
  });
  const signalQuery = useQuery({
    queryKey: ['latest-report-skin-signal'],
    queryFn: getLatestReportSkinSignal,
    enabled: isLatestReport,
    staleTime: 30_000,
    retry: false,
  });
  const interactionsQuery = useQuery({
    queryKey: ['latest-report-interactions'],
    queryFn: getLatestReportInteractions,
    enabled: isLatestReport,
    staleTime: 30_000,
    retry: false,
  });
  const routinesQuery = useQuery({
    queryKey: ['today-routine'],
    queryFn: getTodayRoutines,
    staleTime: 30_000,
    retry: false,
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

  const isPending = reportsQuery.isPending || reportQuery.isPending || historyQuery.isPending;
  const isError = reportsQuery.isError || reportQuery.isError || historyQuery.isError;
  const report = reportQuery.data;

  return (
    <main className="relative flex min-h-dvh flex-col bg-background">
      <BackHeader title="원인 리포트" onBack={() => navigate(-1)} />

      {isPending ? (
        <DetailMessage message="리포트를 불러오고 있어요." />
      ) : isError || !report ? (
        <DetailMessage message="리포트를 불러오지 못했어요.">
          <Button
            onClick={() => {
              void reportsQuery.refetch();
              void reportQuery.refetch();
              void historyQuery.refetch();
            }}
          >
            다시 시도
          </Button>
        </DetailMessage>
      ) : (
        <ReportDetailContent
          report={report}
          history={historyQuery.data?.history ?? []}
          warning={warningsQuery.data?.[0]}
          interactionMessage={interactionsQuery.data?.[0]?.message}
          signal={signalQuery.data}
          comparison={comparisonQuery.data}
          routines={routinesQuery.data?.routines ?? []}
        />
      )}

      <BottomNavigation
        activeItem="analysis"
        onChange={handleNavigation}
        className="fixed bottom-0 left-1/2 z-20 h-[calc(62px+env(safe-area-inset-bottom))] -translate-x-1/2 pb-[calc(8px+env(safe-area-inset-bottom))]"
      />
    </main>
  );
}

interface ReportDetailContentProps {
  report: Awaited<ReturnType<typeof getReport>>;
  history: Array<{ date: string; redness_level: SkinLevel; trouble_level: SkinLevel }>;
  warning?: { headline: string; message: string };
  interactionMessage?: string;
  signal?: {
    redness: { direction: SignalDirection; message: string };
    trouble: { direction: SignalDirection; message: string };
  };
  comparison?: {
    redness_change: SignalDirection | null;
    trouble_change: SignalDirection | null;
  };
  routines: Array<{ routine_id: number; title: string; estimated_minutes: number }>;
}

function ReportDetailContent({
  report,
  history,
  warning,
  interactionMessage,
  signal,
  comparison,
  routines,
}: ReportDetailContentProps) {
  const trendData = history.slice(-4).map((item, index, items) => ({
    date: index === items.length - 1 ? '오늘' : formatChartDate(item.date),
    redness: levelScore[item.redness_level],
    trouble: levelScore[item.trouble_level],
  }));
  const comparisonFactors = report.primary_causes.map(formatCauseMetric);

  return (
    <div className="flex flex-1 flex-col gap-2 pb-[calc(70px+env(safe-area-inset-bottom))]">
      <CauseSection
        factors={report.primary_causes.slice(0, 2).map((cause) => ({
          title: cause.name,
          value: String(cause.current_value),
          unit: cause.unit,
          description: cause.description,
        }))}
        interactionMessage={interactionMessage}
        warning={warning}
      />

      <p className="text-caption leading-4 text-text-secondary">
        오늘 체크인한 항목을 기준으로 분석했어요.
      </p>

      <ComparisonCard
        className="mt-3"
        analysisCount={report.has_previous_analysis ? 2 : 1}
        title={report.summary}
        metrics={[
          {
            label: '붉은기',
            direction:
              (comparison?.redness_change ?? signal?.redness.direction)
                ? mapSignalDirection(
                    comparison?.redness_change ?? signal?.redness.direction ?? null,
                  )
                : mapChangeDirection(report.skin_change.redness.status),
            status: scoreStatus[report.skin_change.redness.current_score] ?? 'caution',
            detail: {
              status: scoreStatus[report.skin_change.redness.current_score] ?? 'caution',
              description: signal?.redness.message ?? report.summary,
              factors: comparisonFactors,
              footer: report.has_previous_analysis
                ? undefined
                : '다음 기록부터 오늘과 비교해서 변화를 알려드릴게요.',
            },
          },
          {
            label: '트러블',
            direction:
              (comparison?.trouble_change ?? signal?.trouble.direction)
                ? mapSignalDirection(
                    comparison?.trouble_change ?? signal?.trouble.direction ?? null,
                  )
                : mapChangeDirection(report.skin_change.trouble.status),
            status: scoreStatus[report.skin_change.trouble.current_score] ?? 'caution',
            detail: {
              status: scoreStatus[report.skin_change.trouble.current_score] ?? 'caution',
              description: signal?.trouble.message ?? report.summary,
              factors: comparisonFactors,
              footer: report.has_previous_analysis
                ? undefined
                : '다음 기록부터 오늘과 비교해서 변화를 알려드릴게요.',
            },
          },
        ]}
      />

      {!report.has_previous_analysis || trendData.length < 2 ? (
        <TrendEmptyCard className="mt-1" />
      ) : (
        <section className="mt-1 rounded-[10px] border border-gray-100 bg-card p-4">
          <h2 className="text-title-3">최근 피부 지표 추이</h2>
          <TrendChart label="붉은기" dataKey="redness" color="#E53E3E" data={trendData} />
          <TrendChart label="트러블" dataKey="trouble" color="#F59E0B" data={trendData} />
        </section>
      )}

      {routines.length > 0 && (
        <section className="mt-3">
          <h2 className="mb-3 text-title-3">오늘 이렇게 해보세요.</h2>
          <ul className="space-y-2">
            {routines.slice(0, 2).map((routine) => (
              <ActionItem
                key={routine.routine_id}
                label={routine.title}
                duration={`${routine.estimated_minutes}분`}
              />
            ))}
          </ul>
        </section>
      )}

      <p className="mt-auto pt-1 text-caption-2 leading-normal text-gray-200">
        이 결과는 참고용 정보이며 의료적 진단이 아니에요.
      </p>
    </div>
  );
}

function formatCauseMetric(cause: ReportPrimaryCause) {
  return `${cause.name} ${cause.current_value}${cause.unit} · 기준 ${cause.baseline_value}${cause.unit}`;
}

function mapSignalDirection(direction: SignalDirection | null): 'up' | 'down' | 'steady' {
  if (direction === 'INCREASED') return 'up';
  if (direction === 'DECREASED') return 'down';
  return 'steady';
}

function mapChangeDirection(status: ChangeStatus | null): 'up' | 'down' | 'steady' {
  if (status === 'WORSENED') return 'up';
  if (status === 'IMPROVED') return 'down';
  return 'steady';
}

function formatChartDate(date: string) {
  const [, month, day] = date.split('-');
  return `${Number(month)}/${Number(day)}`;
}

interface TrendPoint {
  date: string;
  redness: number;
  trouble: number;
}

function TrendChart({
  label,
  dataKey,
  color,
  data,
}: {
  label: string;
  dataKey: 'redness' | 'trouble';
  color: string;
  data: TrendPoint[];
}) {
  return (
    <div className="mt-5">
      <div className="mb-3 flex items-center gap-2 text-caption-3 leading-normal text-text-primary">
        <span
          aria-hidden="true"
          className="size-[9px] shrink-0"
          style={{
            backgroundColor: color,
            WebkitMask: `url("${statusCircleIcon}") center / contain no-repeat`,
            mask: `url("${statusCircleIcon}") center / contain no-repeat`,
          }}
        />
        <span>{label}</span>
      </div>
      <div className="h-[112px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, bottom: 3, left: 8 }}>
            <CartesianGrid horizontal={false} stroke="#D0D0D0" strokeWidth={1} />
            <XAxis
              dataKey="date"
              axisLine={{ stroke: '#D0D0D0' }}
              tickLine={false}
              tick={<TrendXAxisTick />}
              tickMargin={12}
              height={32}
              interval={0}
              padding={{ left: 24, right: 24 }}
            />
            <YAxis hide domain={[0, 2]} />
            <Line
              type="linear"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={1.5}
              dot={(props) => <TrendDot {...props} color={color} total={data.length} />}
              activeDot={{ r: 4, fill: color, stroke: color }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface TrendXAxisTickProps {
  x?: number;
  y?: number;
  payload?: { value: string };
}

function TrendXAxisTick({ x = 0, y = 0, payload }: TrendXAxisTickProps) {
  const value = payload?.value ?? '';
  const isToday = value === '오늘';
  return (
    <text
      x={x}
      y={y + 10}
      textAnchor="middle"
      fill={isToday ? '#242424' : '#686868'}
      fontFamily="Pretendard, sans-serif"
      fontSize={12}
      fontWeight={isToday ? 500 : 400}
    >
      {value}
    </text>
  );
}

interface TrendDotProps {
  cx?: number;
  cy?: number;
  index?: number;
  color: string;
  total: number;
}

function TrendDot({ cx = 0, cy = 0, index = 0, color, total }: TrendDotProps) {
  const isLast = index === total - 1;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={isLast ? 4 : 3.5}
      fill={isLast ? color : '#FBFBFB'}
      stroke={color}
      strokeWidth={2}
    />
  );
}

function ActionItem({ label, duration }: { label: string; duration: string }) {
  return (
    <li className="flex h-10 items-center justify-between rounded-[10px] border border-gray-100 bg-card px-4">
      <span className="text-body-small font-normal leading-normal text-text-primary">{label}</span>
      <span className="text-body-small font-normal leading-normal text-gray-200">{duration}</span>
    </li>
  );
}

function DetailMessage({ message, children }: { message: string; children?: React.ReactNode }) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
      <p className="text-body-small text-text-secondary">{message}</p>
      {children}
    </section>
  );
}

export default AnalysisDetailPage;

import { useNavigate } from 'react-router-dom';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import statusCircleIcon from '../assets/icons/status-circle.svg';
import { FactorBadge, TrendBadge } from '../components/common';
import { BackHeader, BottomNavigation, type NavigationItem } from '../layouts';

const trendData = [
  { date: '8/1', redness: 74, trouble: 28 },
  { date: '8/3', redness: 62, trouble: 31 },
  { date: '8/4', redness: 50, trouble: 43 },
  { date: '오늘', redness: 34, trouble: 61 },
];

function AnalysisDetailPage() {
  const navigate = useNavigate();

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
    <main className="relative flex flex-col bg-background">
      <BackHeader title="원인 리포트" onBack={() => navigate(-1)} />

      <div className="flex flex-1 flex-col gap-2 pb-[calc(70px+env(safe-area-inset-bottom))]">
        <section className="rounded-[10px] border border-main-500 bg-main-50 p-4">
          <FactorBadge />
          <h1 className="mt-3 text-body-small font-semibold leading-5">
            뚜렷하게 연결되는 요인을 찾지 못했어요.
          </h1>
          <p className="mt-3 text-caption leading-4 text-text-secondary">
            피부 변화가 없다는 뜻은 아니에요. 수면 시간과 물 섭취량에 변화가 있어 참고 요인으로 함께
            보여드려요.
          </p>
        </section>

        <p className="text-caption leading-4 text-text-secondary">
          오늘 체크인한 항목을 기준으로 분석했어요.
        </p>

        <section className="mt-3 overflow-hidden rounded-[10px] border border-main-500 bg-main-50">
          <h2 className="bg-main-100 px-4 py-4 text-body-small font-semibold leading-5">
            오늘은 저번 분석 때보다 붉은기가 줄었어요.
          </h2>
          <div className="divide-y divide-gray-100 px-4 py-2">
            <MetricChange label="붉은기" direction="down" />
            <MetricChange label="트러블" direction="up" />
          </div>
        </section>

        <section className="mt-1 rounded-[10px] border border-gray-100 bg-card p-4">
          <h2 className="text-title-3">최근 피부 지표 추이</h2>
          <TrendChart label="붉은기" dataKey="redness" color="#E53E3E" />
          <TrendChart label="트러블" dataKey="trouble" color="#F59E0B" />
        </section>

        <section className="mt-3">
          <h2 className="mb-3 text-title-3">오늘 이렇게 해보세요.</h2>
          <ul className="space-y-2">
            <ActionItem label="지금 물 한 컵 마시기" duration="1분" />
            <ActionItem label="21시 이전취침 알림 걸기" duration="2분" />
          </ul>
        </section>

        <p className="mt-auto pt-1 text-caption-2 leading-normal text-gray-200">
          이 결과는 참고용 정보이며 의료적 진단이 아니에요.
        </p>
      </div>

      <BottomNavigation
        activeItem="analysis"
        onChange={handleNavigation}
        className="fixed bottom-0 left-1/2 z-20 h-[calc(62px+env(safe-area-inset-bottom))] -translate-x-1/2 pb-[calc(8px+env(safe-area-inset-bottom))]"
      />
    </main>
  );
}

function MetricChange({ label, direction }: { label: string; direction: 'up' | 'down' }) {
  return (
    <div className="flex h-11 items-center justify-between">
      <span className="text-caption-3">{label}</span>
      <TrendBadge trend={direction === 'down' ? 'decrease' : 'increase'} />
    </div>
  );
}

function TrendChart({
  label,
  dataKey,
  color,
}: {
  label: string;
  dataKey: 'redness' | 'trouble';
  color: string;
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
          <LineChart data={trendData} margin={{ top: 4, right: 8, bottom: 0, left: 8 }}>
            <CartesianGrid horizontal={false} stroke="#D0D0D0" strokeWidth={1} />
            <XAxis
              dataKey="date"
              axisLine={{ stroke: '#D0D0D0' }}
              tickLine={false}
              tick={<TrendXAxisTick />}
              tickMargin={12}
              height={30}
              interval={0}
              padding={{ left: 24, right: 24 }}
            />
            <YAxis hide domain={[0, 100]} />
            <Line
              type="linear"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={1.5}
              dot={(props) => <TrendDot {...props} color={color} />}
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
      y={y + 12}
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
}

function TrendDot({ cx = 0, cy = 0, index = 0, color }: TrendDotProps) {
  const isLast = index === trendData.length - 1;

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

export default AnalysisDetailPage;

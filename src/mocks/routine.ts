export type RoutineViewState = 'default' | 'achieved' | 'empty';

export interface RoutineItem {
  id: string;
  title: string;
  completed: boolean;
}

const ROUTINE_TITLES = [
  '오늘 베개커버 교체하기',
  '좋아하는 음악 듣기',
  '취침 전 스마트폰 30분 멀리하기',
  '오늘 하루 생수 1.5L 다 비우기',
];

export function createRoutineItems(state: RoutineViewState): RoutineItem[] {
  return ROUTINE_TITLES.map((title, index) => ({
    id: `routine-${index + 1}`,
    title,
    completed: state === 'achieved' && index < 2,
  }));
}

export function getRoutineViewState(value: string | null): RoutineViewState {
  if (value === 'default' || value === 'achieved') return value;
  return 'empty';
}

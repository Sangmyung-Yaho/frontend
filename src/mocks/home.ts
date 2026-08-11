export type HomeViewState = 'empty' | 'pending' | 'completed' | 'streak7' | 'streak7-completed';

export interface HomeMockData {
  userName: string;
  hasPreviousRecord: boolean;
  isTodayCheckedIn: boolean;
  weeklyRecordDays: number;
  rednessGrade: string | null;
  troubleGrade: string | null;
  checkinTitleLines: [string, string];
  routineProgress: number;
  routines: Array<{ title: string; duration: string }>;
}

const baseData = {
  userName: '김멋사',
  rednessGrade: '낮음',
  troubleGrade: '보통',
  checkinTitleLines: ['수면 부족이', '오늘 트러블의 원인이에요.'] as [string, string],
  routineProgress: 0,
  routines: [],
};

export const HOME_MOCK_DATA: Record<HomeViewState, HomeMockData> = {
  empty: {
    ...baseData,
    hasPreviousRecord: false,
    isTodayCheckedIn: false,
    weeklyRecordDays: 0,
    rednessGrade: null,
    troubleGrade: null,
  },
  pending: {
    ...baseData,
    hasPreviousRecord: true,
    isTodayCheckedIn: false,
    weeklyRecordDays: 5,
  },
  completed: {
    ...baseData,
    hasPreviousRecord: true,
    isTodayCheckedIn: true,
    weeklyRecordDays: 1,
    routineProgress: 52.68,
    routines: [
      { title: '지금 물 한 컵 마시기', duration: '1분' },
      { title: '21시 이전 취침 알림 걸기', duration: '2분' },
    ],
  },
  streak7: {
    ...baseData,
    hasPreviousRecord: true,
    isTodayCheckedIn: false,
    weeklyRecordDays: 7,
  },
  'streak7-completed': {
    ...baseData,
    hasPreviousRecord: true,
    isTodayCheckedIn: true,
    weeklyRecordDays: 7,
    routineProgress: 52.68,
    routines: [
      { title: '지금 물 한 컵 마시기', duration: '1분' },
      { title: '21시 이전 취침 알림 걸기', duration: '2분' },
    ],
  },
};

export function isHomeViewState(value: string | null): value is HomeViewState {
  return (
    value === 'empty' ||
    value === 'pending' ||
    value === 'completed' ||
    value === 'streak7' ||
    value === 'streak7-completed'
  );
}

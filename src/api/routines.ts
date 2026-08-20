import { apiClient } from './client';

interface ApiResponse<T> {
  is_success: boolean;
  message: string;
  data: T;
}

export interface RoutineItem {
  routine_id: number;
  category: string;
  title: string;
  intensity: string;
  is_completed: boolean;
  estimated_minutes: number;
}

export interface TodayRoutineData {
  is_checkin_completed: boolean;
  is_generating: boolean;
  total_count: number;
  completed_count: number;
  today_progress_percent: number;
  routines: RoutineItem[];
}

export interface RoutineCheckData {
  routine_id: number;
  is_completed: boolean;
  completed_count: number;
  total_count: number;
  today_progress_percent: number;
}

export async function getTodayRoutines() {
  const { data } = await apiClient.get<ApiResponse<TodayRoutineData>>('/api/v1/routines/today');
  return data.data;
}

export async function updateRoutineCheck(routineId: number, isCompleted: boolean) {
  const { data } = await apiClient.patch<ApiResponse<RoutineCheckData>>(
    `/api/v1/routines/${routineId}/check`,
    { is_completed: isCompleted },
  );

  return data.data;
}

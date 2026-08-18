import { apiClient } from './client';

export type SkinGrade = 'SAFE' | 'CAUTION' | 'DANGER';

interface ApiResponse<T> {
  is_success: boolean;
  message: string;
  data: T;
}

export interface HomeRoutineItem {
  routine_id: number;
  category: string;
  title: string;
  intensity: string;
  is_completed: boolean;
  estimated_minutes: number;
}

export interface HomeDashboardData {
  weekly_checkins: {
    days: Array<{
      date: string;
      checked: boolean;
    }>;
    checked_count: number;
  };
  latest_skin_analysis: {
    skin_analysis_id: number;
    skin_image_id: number;
    redness: SkinGrade;
    trouble: SkinGrade;
    skin_level: SkinGrade;
    analyzed_at: string;
    is_baseline: boolean;
    previous_skin_analysis_id: number | null;
    redness_change_status: 'IMPROVED' | 'WORSENED' | 'UNCHANGED' | null;
    trouble_change_status: 'IMPROVED' | 'WORSENED' | 'UNCHANGED' | null;
  } | null;
  latest_report: {
    report_id: number;
    report_date: string;
    summary: string;
  } | null;
  today_routine: {
    is_checkin_completed: boolean;
    is_generating: boolean;
    total_count: number;
    completed_count: number;
    today_progress_percent: number;
    routines: HomeRoutineItem[];
  };
}

export interface UserProfileData {
  nickname: string;
  height: number | null;
  weight: number | null;
  skin_type: string | null;
  marketing_agreed: boolean;
  water_goal_ml: number | null;
}

export function getHomeDashboard() {
  return apiClient.get<ApiResponse<HomeDashboardData>>('/api/v1/home');
}

export function getUserProfile() {
  return apiClient.get<ApiResponse<UserProfileData>>('/api/v1/users/profile');
}

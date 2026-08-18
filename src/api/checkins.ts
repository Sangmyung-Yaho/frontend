import axios from 'axios';
import { apiClient } from './client';

export interface CheckinData {
  checkin_id: number;
  sleep_hours: number;
  stress_level: number;
  water_intake_ml: number;
  checked_date: string;
}

export interface CreateCheckinRequest {
  sleep_hours: number;
  stress_level: number;
  water_intake_ml: number;
}

export function createCheckin(checkin: CreateCheckinRequest) {
  return apiClient.post<CheckinData>('/api/v1/checkins', checkin);
}

export function getCheckinsByDateRange(startDate: string, endDate: string) {
  return apiClient.get<CheckinData[]>('/api/v1/checkins', {
    params: { startDate, endDate },
  });
}

export async function getTodayCheckin() {
  try {
    const { data } = await apiClient.get<CheckinData>('/api/v1/checkins/today');
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }

    throw error;
  }
}

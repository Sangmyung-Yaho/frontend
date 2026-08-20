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

interface ApiResponse<T> {
  is_success: boolean;
  message: string;
  data: T;
}

function unwrapApiResponse<T>(response: ApiResponse<T> | T): T {
  if (typeof response === 'object' && response !== null && 'data' in response) {
    return (response as ApiResponse<T>).data;
  }

  return response as T;
}

export async function createCheckin(checkin: CreateCheckinRequest) {
  const { data } = await apiClient.post<ApiResponse<CheckinData> | CheckinData>(
    '/api/v1/checkins',
    checkin,
  );
  return unwrapApiResponse(data);
}

export async function getCheckinsByDateRange(startDate: string, endDate: string) {
  const { data } = await apiClient.get<ApiResponse<CheckinData[]> | CheckinData[]>(
    '/api/v1/checkins',
    {
      params: { startDate, endDate },
    },
  );

  return unwrapApiResponse(data);
}

export async function getTodayCheckin() {
  try {
    const { data } = await apiClient.get<ApiResponse<CheckinData> | CheckinData>(
      '/api/v1/checkins/today',
    );
    return unwrapApiResponse(data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }

    throw error;
  }
}

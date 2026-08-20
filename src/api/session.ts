import { apiClient } from './client';

export function logoutUser() {
  return apiClient.post<Record<string, string>>('/api/v1/auth/logout');
}

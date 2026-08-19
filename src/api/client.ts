import axios from 'axios';
import { clearAuthTokens, getAccessToken } from './auth';

export const apiClient = axios.create({
  baseURL: import.meta.env.PROD ? '/' : import.meta.env.VITE_API_BASE_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearAuthTokens();

      if (window.location.pathname !== '/') {
        window.location.replace('/');
      }
    }

    return Promise.reject(error);
  },
);

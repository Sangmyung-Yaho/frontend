import { clearPendingOnboardingSkinImageId } from '../services/pendingOnboardingSkinImage';

export type OAuthProvider = 'google' | 'kakao';

export const AUTH_TOKEN_STORAGE_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
} as const;

export function getAccessToken() {
  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEYS.accessToken);
}

export function clearAuthTokens() {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEYS.accessToken);
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEYS.refreshToken);
  clearPendingOnboardingSkinImageId();
}

function getApiBaseUrl() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error('VITE_API_BASE_URL 환경변수가 설정되지 않았습니다.');
  }

  return apiBaseUrl.replace(/\/+$/, '');
}

function getGoogleOAuthUrl() {
  const googleOAuthUrl = import.meta.env.VITE_GOOGLE_OAUTH_URL;

  if (!googleOAuthUrl) {
    throw new Error('VITE_GOOGLE_OAUTH_URL 환경변수가 설정되지 않았습니다.');
  }

  return googleOAuthUrl;
}

export function startOAuthLogin(provider: OAuthProvider) {
  if (provider === 'google') {
    window.location.assign(getGoogleOAuthUrl());
    return;
  }

  window.location.assign(`${getApiBaseUrl()}/api/v1/auth/oauth/${provider}`);
}

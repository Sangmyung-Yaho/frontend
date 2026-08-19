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
  const apiBaseUrl = import.meta.env.PROD
    ? 'https://api.barocare.cloud'
    : import.meta.env.VITE_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error('VITE_API_BASE_URL 환경변수가 설정되지 않았습니다.');
  }

  return apiBaseUrl.replace(/\/+$/, '');
}

function getGoogleOAuthUrl() {
  const googleOAuthUrl = import.meta.env.PROD
    ? `${getApiBaseUrl()}/api/v1/auth/oauth/google`
    : import.meta.env.VITE_GOOGLE_OAUTH_URL;

  if (!googleOAuthUrl) {
    throw new Error('VITE_GOOGLE_OAUTH_URL 환경변수가 설정되지 않았습니다.');
  }

  return googleOAuthUrl;
}

function addLocalRedirectTo(oauthUrl: string) {
  const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);

  if (!isLocalhost) {
    return oauthUrl;
  }

  const url = new URL(oauthUrl, window.location.origin);
  url.searchParams.set('redirect_to', `${window.location.origin}/oauth/success`);

  return url.toString();
}

export function startOAuthLogin(provider: OAuthProvider) {
  const oauthUrl =
    provider === 'google'
      ? getGoogleOAuthUrl()
      : `${getApiBaseUrl()}/api/v1/auth/oauth/${provider}`;

  window.location.assign(addLocalRedirectTo(oauthUrl));
}

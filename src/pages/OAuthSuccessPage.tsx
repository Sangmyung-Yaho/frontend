import { useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUTH_TOKEN_STORAGE_KEYS } from '../api/auth';
import { clearPendingOnboardingSkinImageId } from '../services/pendingOnboardingSkinImage';

function OAuthSuccessPage() {
  const navigate = useNavigate();
  const hasHandledCallback = useRef(false);

  useLayoutEffect(() => {
    if (hasHandledCallback.current) {
      return;
    }

    hasHandledCallback.current = true;

    const searchParams = new URLSearchParams(window.location.search);
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const isNewUser = searchParams.get('isNewUser') === 'true';
    const isOnboarded = searchParams.get('isOnboarded') === 'true';

    window.history.replaceState(null, '', '/oauth/success');

    if (!accessToken || !refreshToken) {
      navigate('/', { replace: true });
      return;
    }

    clearPendingOnboardingSkinImageId();
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEYS.accessToken, accessToken);
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEYS.refreshToken, refreshToken);

    navigate(isNewUser || !isOnboarded ? '/onboarding' : '/home', {
      replace: true,
    });
  }, [navigate]);

  return (
    <main className="flex min-h-dvh items-center justify-center">
      <p aria-live="polite" className="text-body-small text-text-secondary">
        로그인 정보를 확인하고 있어요.
      </p>
    </main>
  );
}

export default OAuthSuccessPage;

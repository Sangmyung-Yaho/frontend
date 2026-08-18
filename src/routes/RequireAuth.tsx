import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAccessToken } from '../api/auth';

const PUBLIC_PATHS = new Set(['/', '/oauth/success']);

function RequireAuth() {
  const location = useLocation();

  if (!PUBLIC_PATHS.has(location.pathname) && !getAccessToken()) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default RequireAuth;

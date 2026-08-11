import { Navigate, createBrowserRouter } from 'react-router-dom';
import App from '../App';
import { AppLayout } from '../layouts';

export const router = createBrowserRouter([
  {
    Component: AppLayout,
    children: [
      {
        index: true,
        element: <Navigate to="/onboarding" replace />,
      },
      {
        path: '/onboarding',
        Component: App,
      },
    ],
  },
]);

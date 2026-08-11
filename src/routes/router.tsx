import { Navigate, createBrowserRouter } from 'react-router-dom';
import App from '../App';
import { AppLayout } from '../layouts';
import CameraPage from '../pages/camera/CameraPage';
import AnalysisFailurePage from '../pages/exception/AnalysisFailurePage';
import AnalysisLoadingPage from '../pages/exception/AnalysisLoadingPage';
import CameraPermissionPage from '../pages/exception/CameraPermissionPage';

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
      {
        path: '/camera',
        Component: CameraPage,
      },
      {
        path: '/camera/permission',
        Component: CameraPermissionPage,
      },
      {
        path: '/analysis/loading',
        Component: AnalysisLoadingPage,
      },
      {
        path: '/analysis/failure',
        Component: AnalysisFailurePage,
      },
    ],
  },
]);

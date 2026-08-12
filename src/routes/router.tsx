import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import { AppLayout } from '../layouts';
import HomePage from '../pages/HomePage';
import OnboardingPage from '../pages/OnboardingPage';
import RoutinePage from '../pages/RoutinePage';
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
        Component: App,
      },
      {
        path: '/home',
        Component: HomePage,
      },
      {
        path: '/onboarding',
        Component: OnboardingPage,
      },
      {
        path: '/mission',
        Component: RoutinePage,
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

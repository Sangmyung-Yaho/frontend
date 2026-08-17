import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import { AppLayout } from '../layouts';
import HomePage from '../pages/HomePage';
import OnboardingPage from '../pages/OnboardingPage';
import CameraPage from '../pages/camera/CameraPage';
import AnalysisFailurePage from '../pages/exception/AnalysisFailurePage';
import AnalysisLoadingPage from '../pages/exception/AnalysisLoadingPage';
import CameraPermissionPage from '../pages/exception/CameraPermissionPage';
import AnalysisPage from '../pages/AnalysisPage';
import AnalysisDetailPage from '../pages/AnalysisDetailPage';
import GalleryAnalysisFailurePage from '../pages/exception/GalleryAnalysisFailurePage';
import RouteErrorPage from '../pages/exception/RouteErrorPage';

export const router = createBrowserRouter([
  {
    Component: AppLayout,
    ErrorBoundary: RouteErrorPage,
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
        path: '/camera',
        Component: CameraPage,
      },
      {
        path: '/camera/reception',
        Component: CameraPermissionPage,
      },
      {
        path: '/analysis',
        Component: AnalysisPage,
      },
      {
        path: '/analysis/detail',
        Component: AnalysisDetailPage,
      },
      {
        path: '/analysis/loading',
        Component: AnalysisLoadingPage,
      },
      {
        path: '/analysis/failure',
        Component: AnalysisFailurePage,
      },
      {
        path: '/analysis/gallery-failure',
        Component: GalleryAnalysisFailurePage,
      },
    ],
  },
]);

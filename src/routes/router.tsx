import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import { AppLayout } from '../layouts';
import HomePage from '../pages/HomePage';
import CameraPage from '../pages/camera/CameraPage';
import AnalysisFailurePage from '../pages/exception/AnalysisFailurePage';
import AnalysisLoadingPage from '../pages/exception/AnalysisLoadingPage';
import CameraPermissionPage from '../pages/exception/CameraPermissionPage';
import AnalysisPage from '../pages/AnalysisPage';

export const router = createBrowserRouter([
  {
    Component: AppLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: '/home',
        Component: HomePage,
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
        path: '/analysis',
        Component: AnalysisPage,
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

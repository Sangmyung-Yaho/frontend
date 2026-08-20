import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import { AppLayout } from '../layouts';
import HomePage from '../pages/HomePage';
import CheckinPage from '../pages/CheckinPage';
import OnboardingPage from '../pages/OnboardingPage';
import RoutinePage from '../pages/RoutinePage';
import CameraPage from '../pages/camera/CameraPage';
import AnalysisFailurePage from '../pages/exception/AnalysisFailurePage';
import AnalysisLoadingPage from '../pages/exception/AnalysisLoadingPage';
import CameraPermissionPage from '../pages/exception/CameraPermissionPage';
import AnalysisPage from '../pages/AnalysisPage';
import AnalysisDetailPage from '../pages/AnalysisDetailPage';
import GalleryAnalysisFailurePage from '../pages/exception/GalleryAnalysisFailurePage';
import RouteErrorPage from '../pages/exception/RouteErrorPage';
import OAuthSuccessPage from '../pages/OAuthSuccessPage';
import MyPage from '../pages/MyPage';
import MyPoliciesPage from '../pages/MyPoliciesPage';
import MyPolicyDetailPage from '../pages/MyPolicyDetailPage';
import MyProfileEditPage from '../pages/MyProfileEditPage';
import MyWithdrawalPage from '../pages/MyWithdrawalPage';
import RequireAuth from './RequireAuth';

export const router = createBrowserRouter([
  {
    Component: RequireAuth,
    ErrorBoundary: RouteErrorPage,
    children: [
      {
        Component: AppLayout,
        children: [
          {
            index: true,
            Component: App,
          },
          {
            path: '/oauth/success',
            Component: OAuthSuccessPage,
          },
          {
            path: '/home',
            Component: HomePage,
          },
          {
            path: '/checkin',
            Component: CheckinPage,
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
            path: '/my',
            Component: MyPage,
          },
          {
            path: '/my/profile',
            Component: MyProfileEditPage,
          },
          {
            path: '/my/policies',
            Component: MyPoliciesPage,
          },
          {
            path: '/my/policies/:policyType',
            Component: MyPolicyDetailPage,
          },
          {
            path: '/my/withdraw',
            Component: MyWithdrawalPage,
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
    ],
  },
]);

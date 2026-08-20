import { useMutation, useQuery } from '@tanstack/react-query';
import type { HTMLAttributes } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAuthTokens } from '../api/auth';
import { logoutUser } from '../api/session';
import { getUserProfile } from '../api/users';
import chevronRightIcon from '../assets/home/chevron-right.svg';
import { ConfirmDialog, MyPageLayout } from '../components/mypage';

const APP_VERSION = '1.0.0';

function MyPage() {
  const navigate = useNavigate();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSettled: () => {
      clearAuthTokens();
      navigate('/', { replace: true });
    },
  });
  const { data: profile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => (await getUserProfile()).data.data,
    staleTime: 5 * 60_000,
    retry: 1,
  });

  const profileDetails = [
    profile?.height != null ? `${profile.height}cm` : null,
    profile?.weight != null ? `${profile.weight}kg` : null,
    profile?.skin_type ?? null,
  ].filter((detail): detail is string => detail !== null);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <MyPageLayout title="마이페이지" contentClassName="flex flex-col gap-4">
      <MyPageCard className="flex min-h-[93px] items-start justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          <h2 className="truncate text-title-3 leading-normal">{profile?.nickname ?? '사용자'}</h2>
          <p className="truncate text-caption leading-normal text-text-secondary">
            {profileDetails.length > 0
              ? profileDetails.join(' · ')
              : '프로필 정보를 불러오는 중이에요'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/my/profile')}
          className="ml-4 shrink-0 text-caption leading-normal text-text-secondary underline-offset-2 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-500"
        >
          프로필 정보 수정
        </button>
      </MyPageCard>

      <MyPageCard>
        <h2 className="text-title-3 leading-[18px]">설정</h2>
        <div className="mt-2">
          <button
            type="button"
            onClick={() => navigate('/my/policies')}
            className="flex h-[53px] w-full items-center justify-between rounded-[10px] border-b border-gray-100 px-2 text-left text-body leading-4 hover:bg-gray-50/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-500"
          >
            <span>약관 및 정책</span>
            <img src={chevronRightIcon} alt="" className="h-3 w-1.5 shrink-0" />
          </button>
          <div className="flex h-[37px] items-end justify-between px-2">
            <span className="text-body leading-4">버전 정보</span>
            <span className="text-[13px] leading-[13px] text-text-secondary">{APP_VERSION}</span>
          </div>
        </div>
      </MyPageCard>

      <MyPageCard>
        <button
          type="button"
          onClick={() => setIsLogoutOpen(true)}
          className="flex h-[37px] w-full items-start border-b border-gray-100 px-2 text-left text-body leading-4 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-500"
        >
          로그아웃
        </button>
        <button
          type="button"
          onClick={() => navigate('/my/withdraw')}
          className="flex h-[37px] w-full items-end px-2 text-left text-body leading-4 text-danger focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
        >
          회원 탈퇴
        </button>
      </MyPageCard>
      <ConfirmDialog
        open={isLogoutOpen}
        title="로그아웃 하시겠어요?"
        confirmLabel="로그아웃"
        onCancel={() => setIsLogoutOpen(false)}
        onConfirm={handleLogout}
        isPending={logoutMutation.isPending}
      />
    </MyPageLayout>
  );
}

function MyPageCard({ className = '', ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={`rounded-[10px] border border-gray-100 bg-card px-5 py-6 ${className}`}
      {...props}
    />
  );
}

export default MyPage;

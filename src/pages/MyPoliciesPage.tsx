import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateMarketingAgreement } from '../api/users';
import chevronRightIcon from '../assets/home/chevron-right.svg';
import { ToggleSwitch } from '../components/common';
import { MyPageLayout } from '../components/mypage';

const REQUIRED_POLICIES = [
  { label: '이용 약관', slug: 'terms' },
  { label: '개인정보 수집 · 이용', slug: 'privacy' },
  { label: '만 14세 이상 확인', slug: 'age' },
] as const;

function MyPoliciesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: profile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => (await getUserProfile()).data.data,
    staleTime: 5 * 60_000,
    retry: 1,
  });
  const marketingMutation = useMutation({
    mutationFn: updateMarketingAgreement,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
  const isMarketingAgreed = marketingMutation.isPending
    ? marketingMutation.variables
    : (profile?.marketing_agreed ?? false);

  return (
    <MyPageLayout title="약관 및 정책">
      <div className="mt-2 h-[331px]">
        <p className="mb-2 text-body-small leading-[17px] text-text-secondary">
          필수 약관 · 열람만 가능
        </p>
        <section className="rounded-[10px] border border-gray-100 bg-card px-5 py-2">
          {REQUIRED_POLICIES.map((policy, index) => (
            <button
              key={policy.slug}
              type="button"
              onClick={() => navigate(`/my/policies/${policy.slug}`)}
              className={`flex h-[53px] w-full items-center justify-between px-2 text-left text-body ${
                index < REQUIRED_POLICIES.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <span>{policy.label}</span>
              <img src={chevronRightIcon} alt="" className="h-3 w-1.5" />
            </button>
          ))}
        </section>
        <p className="mt-1 text-caption leading-[14px] text-text-secondary">
          필수 약관은 철회할 수 없어요. 동의를 철회하려면 회원 탈퇴가 필요합니다.
        </p>

        <p className="mb-2 mt-4 text-body-small leading-[17px] text-text-secondary">선택 동의</p>
        <section className="flex h-[70px] w-[362px] items-center justify-between rounded-[10px] border border-gray-100 bg-card px-5 py-6">
          <div className="flex items-start gap-4">
            <button
              type="button"
              onClick={() => navigate('/my/policies/marketing')}
              className="text-left text-body leading-5"
            >
              마케팅 정보 수신
            </button>
            <ToggleSwitch
              size="compact"
              checked={isMarketingAgreed}
              disabled={marketingMutation.isPending}
              aria-label="마케팅 정보 수신 동의"
              onChange={(event) => marketingMutation.mutate(event.target.checked)}
            />
          </div>
          <button
            type="button"
            aria-label="마케팅 정보 수신 약관 보기"
            onClick={() => navigate('/my/policies/marketing')}
            className="flex h-5 w-1.5 items-center justify-center"
          >
            <img src={chevronRightIcon} alt="" className="h-3 w-1.5" />
          </button>
        </section>
        {marketingMutation.isError && (
          <p role="alert" className="mt-2 text-caption text-danger">
            마케팅 수신 설정을 변경하지 못했어요.
          </p>
        )}
      </div>
    </MyPageLayout>
  );
}

export default MyPoliciesPage;

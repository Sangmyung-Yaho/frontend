import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { OnboardingSkinType } from '../api/onboarding';
import { getUserProfile, updateUserProfile, type UserProfileData } from '../api/users';
import { Button, Input } from '../components/common';
import { MyPageLayout } from '../components/mypage';

const SKIN_TYPES: OnboardingSkinType[] = ['지성', '건성', '복합성', '민감성'];

function MyProfileEditPage() {
  const { data: profile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => (await getUserProfile()).data.data,
    staleTime: 5 * 60_000,
    retry: 1,
  });
  if (!profile) {
    return (
      <MyPageLayout title="프로필 정보 수정">
        <p className="pt-8 text-center text-body-small text-text-secondary">
          프로필 정보를 불러오는 중이에요.
        </p>
      </MyPageLayout>
    );
  }

  return <ProfileEditForm profile={profile} />;
}

function ProfileEditForm({ profile }: { profile: UserProfileData }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [nickname, setNickname] = useState(profile.nickname);
  const [height, setHeight] = useState(profile.height?.toString() ?? '');
  const [weight, setWeight] = useState(profile.weight?.toString() ?? '');
  const [skinType, setSkinType] = useState<OnboardingSkinType>(
    SKIN_TYPES.includes(profile.skin_type as OnboardingSkinType)
      ? (profile.skin_type as OnboardingSkinType)
      : '건성',
  );
  const isValid =
    nickname.trim().length >= 2 &&
    nickname.trim().length <= 12 &&
    Number(height) > 0 &&
    Number(weight) > 0;
  const isChanged = useMemo(
    () =>
      nickname.trim() !== profile.nickname ||
      Number(height) !== profile.height ||
      Number(weight) !== profile.weight ||
      skinType !== profile.skin_type,
    [height, nickname, profile, skinType, weight],
  );
  const mutation = useMutation({
    mutationFn: () =>
      updateUserProfile({
        nickname: nickname.trim(),
        height: Number(height),
        weight: Number(weight),
        skin_type: skinType,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      navigate('/my', { replace: true });
    },
  });

  return (
    <MyPageLayout title="프로필 정보 수정">
      <form
        className="flex min-h-[calc(100dvh-134px-env(safe-area-inset-top)-env(safe-area-inset-bottom))] flex-col pt-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (isValid && isChanged) mutation.mutate();
        }}
      >
        <div className="flex flex-col gap-4">
          <LabeledField label="닉네임">
            <Input
              value={nickname}
              maxLength={12}
              onChange={(event) => setNickname(event.target.value)}
              className="text-text-secondary"
              suffix={`${nickname.length}/12`}
              aria-label="닉네임"
            />
          </LabeledField>
          <div className="grid grid-cols-2 gap-4">
            <LabeledField label="키">
              <Input
                inputMode="numeric"
                value={height}
                onChange={(event) => setHeight(event.target.value.replace(/\D/g, '').slice(0, 3))}
                suffix="cm"
                className="text-text-secondary"
                aria-label="키"
              />
            </LabeledField>
            <LabeledField label="몸무게">
              <Input
                inputMode="numeric"
                value={weight}
                onChange={(event) => setWeight(event.target.value.replace(/\D/g, '').slice(0, 3))}
                suffix="kg"
                className="text-text-secondary"
                aria-label="몸무게"
              />
            </LabeledField>
          </div>
          <fieldset>
            <legend className="mb-2 text-caption-3">피부 타입</legend>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {SKIN_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  aria-pressed={skinType === type}
                  onClick={() => setSkinType(type)}
                  className={`h-[49px] rounded-lg border text-body ${
                    skinType === type
                      ? 'border-main-500 bg-main-50 text-main-800'
                      : 'border-gray-100 bg-card text-text-secondary'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </fieldset>
          {isChanged &&
            (Number(height) !== profile.height || Number(weight) !== profile.weight) && (
              <p className="text-body-small leading-[17px] text-text-secondary">
                ※ 키 또는 몸무게를 수정하면 목표 음수량도 바뀌어요.
              </p>
            )}
          {mutation.isError && (
            <p role="alert" className="text-caption text-danger">
              프로필 정보를 저장하지 못했어요. 다시 시도해주세요.
            </p>
          )}
        </div>
        <Button
          type="submit"
          className="mt-auto"
          disabled={!isValid || !isChanged || mutation.isPending}
        >
          {mutation.isPending ? '저장 중' : '저장'}
        </Button>
      </form>
    </MyPageLayout>
  );
}

function LabeledField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="text-caption-3 leading-[17px]">{label}</span>
      {children}
    </label>
  );
}

export default MyProfileEditPage;

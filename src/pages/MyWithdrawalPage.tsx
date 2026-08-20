import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { clearAuthTokens } from '../api/auth';
import { deleteUserAccount } from '../api/users';
import { Button, Radio } from '../components/common';
import { ConfirmDialog, MyPageLayout } from '../components/mypage';

const WITHDRAWAL_REASONS = [
  '자주 사용하지 않아요.',
  '앱 사용법이 너무 어려워요.',
  '분석 결과가 도움이 안 돼요.',
] as const;

function MyWithdrawalPage() {
  const navigate = useNavigate();
  const [reason, setReason] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const mutation = useMutation({
    mutationFn: () => deleteUserAccount(reason),
    onSuccess: () => {
      clearAuthTokens();
      navigate('/', { replace: true });
    },
  });

  return (
    <MyPageLayout title="회원 탈퇴">
      <div className="flex min-h-[calc(100dvh-134px-env(safe-area-inset-top)-env(safe-area-inset-bottom))] flex-col pt-[10px]">
        <h2 className="text-title-2 leading-6">정말 탈퇴하시겠어요?</h2>
        <div className="mt-4 flex flex-col gap-4">
          <section className="flex flex-col gap-4 rounded-[10px] border border-danger bg-danger-light px-5 py-6">
            <h3 className="text-caption-3 leading-[17px] text-danger">
              탈퇴하면 되돌릴 수 없어요.
            </h3>
            <ul className="list-disc pl-6 text-[14px] font-normal leading-normal text-text-primary">
              <li>탈퇴 시 기존에 보관했던 즐겨찾기 내역이 모두 삭제되며, 복구할 수 없습니다.</li>
              <li>회원탈퇴 후 30일간 재가입이 불가능합니다.</li>
              <li>연동된 SNS 계정이 있는 경우 서비스와 연동이 해제됩니다.</li>
            </ul>
          </section>

          <div
            role="radiogroup"
            aria-labelledby="withdrawal-reason-label"
            className="flex flex-col gap-2"
          >
            <p id="withdrawal-reason-label" className="text-caption-3 leading-[17px]">
              탈퇴 이유를 알려주세요.
            </p>
            <div className="flex flex-col gap-2">
              {WITHDRAWAL_REASONS.map((item) => {
                const isSelected = reason === item;
                return (
                  <div
                    key={item}
                    className={`flex h-[54px] items-center rounded-[10px] border px-5 ${
                      isSelected ? 'border-main-500 bg-main-50' : 'border-gray-100 bg-card'
                    }`}
                  >
                    <Radio
                      size="compact"
                      className="w-full"
                      name="withdrawal-reason"
                      value={item}
                      checked={isSelected}
                      onChange={() => setReason(item)}
                      label={item}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {mutation.isError && (
          <p role="alert" className="mt-3 text-caption text-danger">
            회원 탈퇴를 처리하지 못했어요. 다시 시도해주세요.
          </p>
        )}
        <Button
          variant="danger"
          disabled={!reason}
          onClick={() => setIsConfirmOpen(true)}
          className="mt-auto"
        >
          탈퇴하기
        </Button>
      </div>

      <ConfirmDialog
        open={isConfirmOpen}
        title="정말 탈퇴하시겠어요?"
        description={'모든 데이터가 즉시 삭제돼요.\n재가입해도 복구되지 않아요.'}
        confirmLabel="탈퇴하기"
        danger
        isPending={mutation.isPending}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={() => mutation.mutate()}
      />
    </MyPageLayout>
  );
}

export default MyWithdrawalPage;

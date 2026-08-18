import { useEffect, useRef } from 'react';
import AgreementModalCloseButton from './AgreementModalCloseButton';

interface TermsAgreementModalProps {
  onClose: () => void;
}

function TermsAgreementModal({ onClose }: TermsAgreementModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 px-4"
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-dialog-title"
        className="relative flex h-[572px] max-h-[calc(100dvh-32px)] w-[361px] max-w-full flex-col overflow-hidden rounded-[10px] border border-gray-100 bg-card px-3 pb-3 pt-3"
      >
        <header className="flex h-[33px] w-[333px] max-w-full shrink-0 items-start border-b border-gray-100 pb-2">
          <h2
            id="terms-dialog-title"
            className="w-[333px] max-w-full shrink-0 text-title-2 text-text-primary"
          >
            이용 약관
          </h2>
        </header>

        <AgreementModalCloseButton
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="이용 약관 창 닫기"
          className="right-[13px] top-[13px]"
        />

        <div className="mt-2 min-h-0 w-[333px] max-w-full flex-1 overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <aside className="flex h-[52px] w-[333px] max-w-full items-center justify-center rounded-lg bg-main-50 p-3 text-caption text-text-secondary">
                <p className="w-[305px] max-w-full">
                  본 서비스가 제공하는 피부 분석 리포트는 의료행위·진단이 아닌 참고용 웰니스
                  정보입니다.
                </p>
              </aside>

              <div className="flex w-[333px] max-w-full flex-col gap-8">
                <article className="flex flex-col gap-2">
                  <h3 className="text-title-3 text-text-primary">제1조 (목적)</h3>
                  <p className="text-body-small leading-[normal] text-gray-300">
                    본 약관은 바로케어의 이용조건 및 절차, 회사와 이용자의 권리·의무 및 책임사항을
                    규정함을 목적으로 합니다.
                  </p>
                </article>

                <article className="flex flex-col gap-2">
                  <h3 className="text-title-3 text-text-primary">제2조 (정의)</h3>
                  <div className="text-body-small leading-[normal] text-gray-300">
                    <p>
                      · 서비스 — 생활습관 데이터와 얼굴(피부) 이미지를 AI로 통합 분석해 피부
                      리포트·루틴을 제공하는 서비스
                    </p>
                    <p>· 체크인 — 매일 입력하는 수면·스트레스·물 섭취·피부촬영 활동 데이터</p>
                    <p>· 리포트 — 체크인과 촬영 이미지를 바탕으로 산출되는 분석 결과물</p>
                  </div>
                </article>

                <article className="flex flex-col gap-2">
                  <h3 className="text-title-3 text-text-primary">
                    제5조 (의료서비스가 아님에 대한 고지)
                  </h3>
                  <div className="text-body-small leading-[normal] text-gray-300">
                    <p>
                      1. 피부 분석 리포트·등급·루틴 미션 등 모든 콘텐츠는 참고용 웰니스 정보이며,
                      「의료법」상 의료행위·진단·처방·치료에 해당하지 않습니다.
                    </p>
                    <p>2. 서비스는 의료인의 진료·상담·처방을 대체하지 않습니다.</p>
                    <p>
                      3. 이상 증상이 있는 경우 반드시 의료기관을 방문해 전문의 진료를 받아야 합니다.
                    </p>
                  </div>
                </article>
              </div>
            </div>

            <aside className="flex h-[52px] w-[333px] max-w-full items-center justify-center rounded-lg bg-gray-50 p-3 text-caption leading-[normal] text-text-secondary">
              <p className="w-[305px] max-w-full">
                제6~11조(회원가입, 의무, 유료서비스, 면책, 관할법원)는 전문 문서에서 전체 확인
                가능합니다.
              </p>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TermsAgreementModal;

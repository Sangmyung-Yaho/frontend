import { useEffect, useRef } from 'react';
import AgreementModalCloseButton from './AgreementModalCloseButton';

export type AdditionalAgreementKind = 'privacy' | 'marketing';

interface AdditionalAgreementModalProps {
  kind: AdditionalAgreementKind;
  onClose: () => void;
}

const modalTitles: Record<AdditionalAgreementKind, string> = {
  privacy: '개인정보 수집·이용',
  marketing: '마케팅 수신 (선택)',
};

function PrivacyAgreementContent() {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-2">
        <aside className="flex h-[52px] w-[333px] max-w-full items-center justify-center overflow-hidden rounded-lg bg-main-50 p-3">
          <p className="w-[305px] max-w-full text-caption leading-[normal] text-text-secondary">
            얼굴(피부) 촬영 이미지는 신원확인·생체인증이 아닌 피부 지표 분석 목적으로만
            사용됩니다.
          </p>
        </aside>

        <div className="flex w-[333px] max-w-full flex-col gap-8">
          <article className="flex flex-col gap-2">
            <h3 className="text-title-3 leading-[normal] text-text-primary">1.수집 항목</h3>
            <div className="text-body-small leading-[normal] text-gray-300">
              <p>
                · 필수 — 계정정보(이메일/비밀번호), 키·몸무게, 체크인 데이터(수면·스트레스·물
                섭취), 얼굴(피부) 촬영 이미지, 서비스 이용기록·접속 로그·기기정보
              </p>
              <p>· 선택 — 피부타입, 온보딩 시 얼굴 사진</p>
            </div>
          </article>

          <article className="flex flex-col gap-2">
            <h3 className="text-title-3 leading-[normal] text-text-primary">
              4. 얼굴(피부) 촬영 이미지 특별 고지
            </h3>
            <div className="text-body-small leading-[normal] text-gray-300">
              <p>· 온보딩 촬영은 선택, 일일 체크인 촬영은 리포트 생성을 위한 필수 입력</p>
              <p>· 신원확인·생체인증 목적 사용 안 함 — 피부 지표 분석·시점 비교 전용</p>
              <p>· AI 분석 외부 위탁 시 수탁업체·업무 내용 사전 고지</p>
              <p>· 마이페이지에서 언제든지 열람·삭제 요청 가능</p>
            </div>
          </article>
        </div>
      </div>

      <aside className="flex h-[52px] w-[333px] max-w-full items-center justify-center overflow-hidden rounded-lg bg-gray-50 p-3">
        <p className="w-[305px] max-w-full text-caption leading-[normal] text-text-secondary">
          보유기간은 3년이며, 촬영 이미지는 3년 경과 시 지체 없이 파기됩니다.
        </p>
      </aside>
    </div>
  );
}

function MarketingAgreementContent() {
  return (
    <div className="flex flex-col gap-2">
      <aside className="flex h-[52px] w-[333px] max-w-full items-center justify-center overflow-hidden rounded-lg bg-main-50 p-3">
        <p className="w-[305px] max-w-full text-caption leading-[normal] text-text-secondary">
          선택 동의 항목이며, 동의하지 않아도 서비스 이용에는 제한이 없습니다.
        </p>
      </aside>

      <div className="flex w-[333px] max-w-full flex-col gap-8">
        <article className="flex flex-col gap-2">
          <h3 className="text-title-3 leading-[normal] text-text-primary">수집 및 이용 목적</h3>
          <div className="text-body-small leading-[normal] text-gray-300">
            <p>· 신규 서비스·이벤트·프로모션 안내</p>
            <p>· 이용 패턴 기반 맞춤형 콘텐츠·알림 발송</p>
          </div>
        </article>

        <article className="flex flex-col gap-2">
          <h3 className="text-title-3 leading-[normal] text-text-primary">수신 방법 · 철회</h3>
          <p className="text-body-small leading-[normal] text-gray-300">
            앱 푸시, 이메일, 문자메시지로 발송되며 마이페이지에서 언제든지 수신 거부할 수
            있습니다.
          </p>
        </article>
      </div>
    </div>
  );
}

function AdditionalAgreementModal({ kind, onClose }: AdditionalAgreementModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const title = modalTitles[kind];
  const titleId = `${kind}-agreement-dialog-title`;

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
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 px-[15px]"
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[calc(100dvh-32px)] w-[363px] max-w-full flex-col gap-2 overflow-hidden rounded-[10px] border border-gray-100 bg-card px-[14px] py-[13px]"
      >
        <header className="flex h-[33px] w-[333px] max-w-full shrink-0 items-start border-b border-gray-100 pb-2">
          <h2 id={titleId} className="w-full text-title-2 leading-[normal] text-text-primary">
            {title}
          </h2>
        </header>

        <AgreementModalCloseButton
          ref={closeButtonRef}
          onClick={onClose}
          aria-label={`${title} 창 닫기`}
          className="right-[14px] top-[13px]"
        />

        <div className="min-h-0 w-[333px] max-w-full overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {kind === 'privacy' ? <PrivacyAgreementContent /> : <MarketingAgreementContent />}
        </div>
      </section>
    </div>
  );
}

export default AdditionalAgreementModal;

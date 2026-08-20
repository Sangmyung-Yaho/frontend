import { useEffect, useRef } from 'react';
import AgreementModalCloseButton from './AgreementModalCloseButton';
import PolicyContent from './PolicyContent';

export type AdditionalAgreementKind = 'privacy' | 'marketing' | 'age';

interface AdditionalAgreementModalProps {
  kind: AdditionalAgreementKind;
  onClose: () => void;
}

const modalTitles: Record<AdditionalAgreementKind, string> = {
  privacy: '개인정보 수집·이용',
  marketing: '마케팅 수신 (선택)',
  age: '만 14세 이상 확인',
};

function PrivacyAgreementContent() {
  return <PolicyContent type="PRIVACY" />;
}

function AgeAgreementContent() {
  return <PolicyContent type="AGE" />;
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
            앱 푸시, 이메일, 문자메시지로 발송되며 마이페이지에서 언제든지 수신 거부할 수 있습니다.
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
  const isAge = kind === 'age';
  const modalSize = isAge
    ? 'h-[305px] w-[361px] px-[13px] py-3'
    : `${kind === 'privacy' ? 'h-[457px]' : 'h-[287px]'} w-[363px] px-[14px] py-[13px]`;

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
      className={`absolute inset-0 z-30 flex items-center justify-center bg-black/50 ${
        isAge ? 'px-4' : 'px-[15px]'
      }`}
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative flex ${modalSize} max-h-[calc(100dvh-32px)] max-w-full flex-col gap-2 overflow-hidden rounded-[10px] border border-gray-100 bg-card`}
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
          className={isAge ? 'right-[13px] top-3' : 'right-[14px] top-[13px]'}
        />

        <div className="min-h-0 w-[333px] max-w-full overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {kind === 'privacy' ? (
            <PrivacyAgreementContent />
          ) : kind === 'age' ? (
            <AgeAgreementContent />
          ) : (
            <MarketingAgreementContent />
          )}
        </div>
      </section>
    </div>
  );
}

export default AdditionalAgreementModal;

import { useEffect, useRef } from 'react';
import AgreementModalCloseButton from './AgreementModalCloseButton';
import PolicyContent from './PolicyContent';

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
        className="relative flex h-[584px] max-h-[calc(100dvh-32px)] w-[361px] max-w-full flex-col gap-2 overflow-hidden rounded-[10px] border border-gray-100 bg-card px-[13px] py-3"
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
          className="right-[13px] top-3"
        />

        <div className="min-h-0 w-[333px] max-w-full flex-1 overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <PolicyContent type="TERMS" />
        </div>
      </section>
    </div>
  );
}

export default TermsAgreementModal;

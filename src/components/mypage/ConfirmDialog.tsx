import { useEffect, useRef } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  danger?: boolean;
  isPending?: boolean;
}

function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  onCancel,
  onConfirm,
  danger = false,
  isPending = false,
}: ConfirmDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isPending) onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPending, onCancel, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4"
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="w-[361px] max-w-full rounded-[10px] border border-gray-100 bg-card px-[52px] py-6"
      >
        <h2 id="confirm-dialog-title" className="text-center text-title-3 leading-[22px]">
          {title}
        </h2>
        {description && (
          <p className="mt-2 whitespace-pre-line text-center text-body-small leading-[18px] text-text-secondary">
            {description}
          </p>
        )}
        <div className="mt-4 flex gap-4">
          <button
            ref={cancelButtonRef}
            type="button"
            disabled={isPending}
            onClick={onCancel}
            className="h-[43px] flex-1 rounded-[10px] border border-gray-100 bg-card text-caption-3 focus-visible:outline-2 focus-visible:outline-main-500"
          >
            취소
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={onConfirm}
            className={`h-[43px] flex-1 rounded-[10px] text-caption-3 focus-visible:outline-2 ${
              danger
                ? 'border border-danger bg-danger-light text-danger focus-visible:outline-danger'
                : 'bg-main-500 text-white focus-visible:outline-main-500'
            }`}
          >
            {isPending ? '처리 중' : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}

export default ConfirmDialog;

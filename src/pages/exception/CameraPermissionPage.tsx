import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import galleryPlaceholderHead from '../../assets/icons/gallery-placeholder-head.svg';
import { Button } from '../../components/common';
import { THEME_COLORS, useThemeColor } from '../../hooks/useThemeColor';
import { useCameraCaptureStore } from '../../stores/cameraCaptureStore';
import { readImageFile } from '../../utils/imageFile';

const GALLERY_TILE_COUNT = 12;

function CameraPermissionPage() {
  useThemeColor(THEME_COLORS.onboarding);

  const navigate = useNavigate();
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const setCapture = useCameraCaptureStore((state) => state.setCapture);

  const handleImageSelection = async (file: File | undefined) => {
    if (!file) return;

    const previewUrl = await readImageFile(file);
    setSelectedPreview(previewUrl);
    setCapture(file, previewUrl);
  };

  return (
    <main className="relative h-dvh overflow-hidden bg-background">
      <div className="absolute inset-x-0 bottom-[96px] top-[env(safe-area-inset-top)] overflow-y-auto">
        <div className="mx-auto flex w-full max-w-[361px] flex-col gap-6">
          <section className="flex w-full items-start gap-2 rounded-[10px] border border-warning bg-warning-light px-5 py-4">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-[10px] bg-warning text-caption font-bold text-card">
              !
            </span>
            <div className="flex min-w-0 flex-col gap-2">
              <h1 className="text-headline text-text-primary">카메라 권한이 꺼져 있어요.</h1>
              <p className="text-caption leading-[normal] text-text-secondary">
                갤러리로 자동 전환했어요.
                <br />
                저장된 사진으로 그대로 이어갈 수 있어요.
              </p>
            </div>
          </section>

          <section className="flex w-full flex-col items-center gap-2">
            <div className="flex h-[25px] w-full items-center">
              <h2 className="text-caption-3 text-text-section">최근 사진</h2>
            </div>
            <div className="grid w-full grid-cols-3 gap-[6px]">
              {Array.from({ length: GALLERY_TILE_COUNT }, (_, index) => {
                const selected = index === 0 && selectedPreview !== null;

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className={`relative flex h-[114px] min-w-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-[10px] ${
                      index % 2 === 0 ? 'bg-gallery-light' : 'bg-gallery-dark'
                    } ${selected ? 'border-2 border-main-700' : ''}`}
                    aria-label={selected ? '선택한 사진 변경하기' : '갤러리에서 사진 선택하기'}
                  >
                    {selected ? (
                      <>
                        <img
                          src={selectedPreview}
                          alt="선택한 피부 사진"
                          className="absolute inset-0 size-full object-cover"
                        />
                        <span className="absolute right-[5.33px] top-[5px] flex size-[22px] items-center justify-center rounded-[11px] border-2 border-white bg-main-700 text-[11px] font-bold text-white">
                          ✓
                        </span>
                      </>
                    ) : (
                      <>
                        <img src={galleryPlaceholderHead} alt="" className="size-6" />
                        <span className="h-[22px] w-[46px] rounded-t-[23px] bg-gallery-placeholder" />
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => void handleImageSelection(event.target.files?.[0])}
      />

      <div className="absolute bottom-[max(21px,env(safe-area-inset-bottom))] left-[13px] right-3">
        <Button disabled={!selectedPreview} onClick={() => navigate('/analysis/loading')}>
          분석하기
        </Button>
      </div>
    </main>
  );
}

export default CameraPermissionPage;

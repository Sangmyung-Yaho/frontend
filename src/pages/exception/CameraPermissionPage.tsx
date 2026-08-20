import { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import analysisFailedIcon from '../../assets/icons/analysis-failed.svg';
import { Button } from '../../components/common';
import { THEME_COLORS, useThemeColor } from '../../hooks/useThemeColor';
import { useCameraCaptureStore } from '../../stores/cameraCaptureStore';
import { useCheckinStore } from '../../stores/checkinStore';
import { readImageFile } from '../../utils/imageFile';

function CameraPermissionPage() {
  useThemeColor(THEME_COLORS.onboarding);

  const location = useLocation();
  const navigate = useNavigate();
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const setCapture = useCameraCaptureStore((state) => state.setCapture);

  const handleImageSelection = async (file: File | undefined) => {
    if (!file) return;

    const previewUrl = await readImageFile(file);
    setCapture(file, previewUrl);

    if (location.state?.source === 'checkin') {
      if (location.state?.resumeExistingCheckin === true) {
        navigate('/analysis/loading', {
          replace: true,
          state: { ...location.state, source: 'checkin', imageSource: 'gallery' },
        });
        return;
      }

      useCheckinStore.getState().completePhotoAnalysis();
      navigate('/checkin', {
        replace: true,
        state: { source: 'checkin', imageSource: 'gallery' },
      });
      return;
    }

    navigate('/analysis/loading', {
      replace: true,
      state: { ...location.state, imageSource: 'gallery' },
    });
  };

  return (
    <main className="relative h-dvh overflow-hidden bg-background">
      <section className="absolute left-[calc(50%+0.5px)] top-[calc(50%+0.5px)] flex h-[245px] w-[368px] max-w-[calc(100%-25px)] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-between">
        <div className="flex w-full flex-col items-center">
          <div className="flex size-[88px] items-center justify-center rounded-full bg-danger-light">
            <img src={analysisFailedIcon} alt="" className="size-[45px]" />
          </div>
          <div className="flex w-full flex-col items-center gap-2">
            <h1 className="pt-4 text-center text-headline leading-[normal] text-text-analysis">
              카메라 권한이 꺼져 있어요.
            </h1>
            <p className="text-center text-body-small leading-[normal] text-text-analysis-muted">
              카메라를 사용할 수 없어요.
              <br />
              갤러리에서 촬영한 사진을 선택해주세요.
            </p>
          </div>
        </div>

        <Button onClick={() => galleryInputRef.current?.click()}>갤러리에서 불러오기</Button>
      </section>

      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => void handleImageSelection(event.target.files?.[0])}
      />
    </main>
  );
}

export default CameraPermissionPage;

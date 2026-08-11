import { create } from 'zustand';

type CameraCaptureState = {
  imageBlob: Blob | null;
  previewUrl: string | null;
  setCapture: (imageBlob: Blob, previewUrl: string) => void;
  clearCapture: () => void;
};

export const useCameraCaptureStore = create<CameraCaptureState>((set) => ({
  imageBlob: null,
  previewUrl: null,
  setCapture: (imageBlob, previewUrl) => set({ imageBlob, previewUrl }),
  clearCapture: () => set({ imageBlob: null, previewUrl: null }),
}));


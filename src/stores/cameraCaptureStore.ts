import { create } from 'zustand';
import type { SkinAnalysisResponse } from '../api/skinAnalysis';

type CameraCaptureState = {
  imageBlob: Blob | null;
  previewUrl: string | null;
  analysisResult: SkinAnalysisResponse | null;
  setCapture: (imageBlob: Blob, previewUrl: string) => void;
  setAnalysisResult: (analysisResult: SkinAnalysisResponse) => void;
  clearCapture: () => void;
};

export const useCameraCaptureStore = create<CameraCaptureState>((set) => ({
  imageBlob: null,
  previewUrl: null,
  analysisResult: null,
  setCapture: (imageBlob, previewUrl) => set({ imageBlob, previewUrl, analysisResult: null }),
  setAnalysisResult: (analysisResult) => set({ analysisResult }),
  clearCapture: () => set({ imageBlob: null, previewUrl: null }),
}));


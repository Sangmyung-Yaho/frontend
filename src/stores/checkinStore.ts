import { create } from 'zustand';

type CheckinState = {
  sleepHours: number;
  stress: number | null;
  water: string;
  isPhotoComplete: boolean;
  isPhotoAnalysisPending: boolean;
  setSleepHours: (value: number) => void;
  setStress: (value: number) => void;
  setWater: (value: string) => void;
  startPhotoAnalysis: () => void;
  completePhotoAnalysis: () => void;
  reset: () => void;
};

const initialState = {
  sleepHours: 5.5,
  stress: null,
  water: '',
  isPhotoComplete: false,
  isPhotoAnalysisPending: false,
};

export const useCheckinStore = create<CheckinState>((set) => ({
  ...initialState,
  setSleepHours: (sleepHours) => set({ sleepHours }),
  setStress: (stress) => set({ stress }),
  setWater: (water) => set({ water }),
  startPhotoAnalysis: () => set({ isPhotoComplete: false, isPhotoAnalysisPending: true }),
  completePhotoAnalysis: () => set({ isPhotoComplete: true, isPhotoAnalysisPending: false }),
  reset: () => set(initialState),
}));

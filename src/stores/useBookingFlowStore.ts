import { create } from 'zustand';
import { BookingStep } from '../lib/types';

interface BookingFlowStore {
  currentStep: BookingStep;
  canGoBack: boolean;
  setStep: (step: BookingStep) => void;
  goBack: () => void;
  reset: () => void;
}

export const useBookingFlowStore = create<BookingFlowStore>((set, get) => ({
  currentStep: 'channel',
  canGoBack: false,
  setStep: (step) => set({ currentStep: step, canGoBack: true }),
  goBack: () => {
    const steps: BookingStep[] = ['channel', 'package', 'datetime', 'product'];
    const currentIndex = steps.indexOf(get().currentStep);
    if (currentIndex > 0) {
      set({ currentStep: steps[currentIndex - 1] });
    }
  },
  reset: () => set({ currentStep: 'channel', canGoBack: false })
}));
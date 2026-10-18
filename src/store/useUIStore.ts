import { create } from 'zustand';

interface UIState {
  activeModal: string | null;
  // Action to open a specific modal
  openModal: (modalName: string) => void;
  // Action to close whatever modal is open
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeModal: null,

  openModal: (modalName) => set({ activeModal: modalName }),

  closeModal: () => set({ activeModal: null }),
}));

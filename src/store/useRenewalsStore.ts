import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RenewalsDataState {
  preservedInstallmentAdditionalAmount: number | null;
  setPreservedInstallmentAmount: (amount: number) => void;
}

const initialState = {
  preservedInstallmentAdditionalAmount: null,
};

export const useRenewalsStore = create<RenewalsDataState>()(
  persist(
    (set) => ({
      ...initialState,

      setPreservedInstallmentAmount: (amount) =>
        set({
          preservedInstallmentAdditionalAmount: amount,
        }),
    }),
    {
      name: 'renewals-data',
    }
  )
);

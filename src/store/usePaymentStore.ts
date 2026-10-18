import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 1. Define the interface
interface PaymentData {
  returnUrl: string | null;
}

interface PaymentState extends PaymentData {
  setPaymentData: (data: any) => void;
}

// 2. Initial State
const initialState: PaymentData = {
  returnUrl: null,
};

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set) => ({
      ...initialState,
      setPaymentData: (data) =>
        set({
          ...data,
        }),
    }),
    {
      name: 'payment-storage',
      partialize: (state) => ({
        returnUrl: state.returnUrl,
      }),
    }
  )
);

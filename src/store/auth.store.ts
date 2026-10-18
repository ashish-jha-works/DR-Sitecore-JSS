// src/store/auth.store.ts
import { create } from 'zustand';

type User = {
  id: number;
  name: string;
};

type AuthState = {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) => set({ user }),

  fetchUser: async () => {
    try {
      console.log('Inside fetch user');
      const res = await fetch('/api/me');

      if (!res.ok) throw new Error();
      const data = await res.json();
      console.log('API RESP-', data);
      set({ user: data.user, isLoading: false });
    } catch {
      set({ user: null, isLoading: false });
    }
  },

  logout: async () => {
    await fetch('/api/logout', { method: 'POST' });
    set({ user: null });
    window.location.href = '/login';
  },
}));

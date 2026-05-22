import { create } from 'zustand';
import type { SessionUser } from '@swap/types';

interface AuthState {
  user: SessionUser | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: SessionUser | null) => void;
  setToken: (token: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  clearAuth: () => void;
  initBypassAuth: () => void;
}

const DEV_BYPASS_USER: SessionUser = {
  id: import.meta.env.VITE_BYPASS_USER_ID ?? '00000000-0000-0000-0000-000000000001',
  email: 'dev@university.edu',
  fullName: 'Dev User',
  avatarUrl: null,
  onboarded: true,
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  setUser: (user) => set({ user }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setToken: (token) => {
    // Token is now stored in an httpOnly cookie set by the backend.
    // Keep token in state for compatibility but do not persist to localStorage.
    set({ token });
  },
  clearAuth: () => {
    // Clear client-side state only; backend cookie will be cleared via /auth/logout
    set({ user: null, token: null });
  },

  initBypassAuth: () => {
    if (import.meta.env.VITE_BYPASS_AUTH === 'true') {
      set({ user: DEV_BYPASS_USER, token: 'dev-bypass-token', isLoading: false });
    }
  },
}));

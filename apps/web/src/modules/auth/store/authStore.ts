import { create } from 'zustand';
import type { User } from '@swap/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  clearAuth: () => void;
  initBypassAuth: () => void;
}

const DEV_BYPASS_USER: User = {
  id: import.meta.env.VITE_BYPASS_USER_ID ?? '00000000-0000-0000-0000-000000000001',
  microsoftId: 'dev-bypass-microsoft-id',
  email: 'dev@university.edu',
  fullName: 'Dev User',
  avatarUrl: null,
  year: 2,
  programLevel: 'undergraduate',
  faculty: 'Faculty of Engineering',
  major: 'Computer Science',
  bio: null,
  onboarded: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  clearAuth: () => set({ user: null, token: null }),

  initBypassAuth: () => {
    if (import.meta.env.VITE_BYPASS_AUTH === 'true') {
      set({ user: DEV_BYPASS_USER, token: 'dev-bypass-token', isLoading: false });
    }
  },
}));

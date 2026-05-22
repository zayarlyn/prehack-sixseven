import { useAuthStore } from '@swap-web/modules/auth/store/authStore';

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isLoading = useAuthStore((state) => state.isLoading);
  const setUser = useAuthStore((state) => state.setUser);
  const isAuthenticated = user !== null && user.onboarded;

  return { user, token, isLoading, isAuthenticated, setUser };
}

import { useAuthStore } from '@swap-web/modules/auth/store/authStore';

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  return { user, isLoading };
}

import { useEffect } from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import LoadingSpinner from '@swap-web/common/components/LoadingSpinner';
import { router } from './router';
import { queryClient } from './common/lib/queryClient';
import { useAuthStore } from '@swap-web/modules/auth/store/authStore';
import { getMe } from '@swap-web/modules/auth/auth.api';

export default function App() {
  const { initBypassAuth, setUser, setToken, setIsLoading, clearAuth, isLoading } = useAuthStore();

  useEffect(() => {
    if (import.meta.env.VITE_BYPASS_AUTH === 'true') {
      initBypassAuth();
      setIsLoading(false);
      return;
    }

    // Attempt to fetch session user; backend reads token from httpOnly cookie
    getMe()
      .then((user) => setUser(user))
      .catch(() => clearAuth())
      .finally(() => setIsLoading(false));
  }, [clearAuth, initBypassAuth, setIsLoading, setUser, setToken]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

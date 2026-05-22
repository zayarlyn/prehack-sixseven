import { useEffect } from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { router } from './router';
import { queryClient } from '@swap-web/common/lib/queryClient';
import { useAuthStore } from '@swap-web/modules/auth/store/authStore';

export default function App() {
  const initBypassAuth = useAuthStore((s) => s.initBypassAuth);

  useEffect(() => {
    initBypassAuth();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import LoadingSpinner from '@swap-web/common/components/LoadingSpinner';
import { useAuthStore } from '@swap-web/modules/auth/store/authStore';
import { getMe } from '@swap-web/modules/auth/auth.api';

export default function CallbackPage() {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get('next') ?? '/';
    const error = params.get('error');

    if (error) {
      navigate({ to: '/login', search: { error } });
      return;
    }

    // Backend sets httpOnly cookie; just fetch the current user session
    getMe()
      .then((user) => {
        setUser(user);
        navigate({ to: next as '/' });
      })
      .catch(() => {
        navigate({ to: '/login', search: { error: 'session_failed' } });
      });
  }, [navigate, setToken, setUser]);

  return (
    <div className="flex items-center justify-center min-h-screen gap-3">
      <LoadingSpinner size={24} />
      <span className="text-sm text-muted-foreground">Signing you in…</span>
    </div>
  );
}

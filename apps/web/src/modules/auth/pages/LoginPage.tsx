import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@swap-web/modules/auth/hooks/useAuth';
import LeftPanel from '../components/LeftPanel';
import MobileHeader from '../components/MobileHeader';
import SignInForm from '../components/SignInForm';

/* ── Page ── */

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) navigate({ href: '/' });
  }, [isAuthenticated, navigate]);

  const handleMicrosoftSignIn = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/microsoft`;
  };

  return (
    <div className="min-h-screen">
      {import.meta.env.VITE_BYPASS_AUTH === 'true' && (
        <div className="bg-primary text-white text-sm font-semibold text-center py-2 px-4">
          ⚠️ DEV BYPASS MODE — Auth is disabled. Signed in as Dev User.
        </div>
      )}

      <div
        className="flex"
        style={{
          minHeight: import.meta.env.VITE_BYPASS_AUTH === 'true' ? 'calc(100vh - 36px)' : '100vh',
        }}
      >
        <div className="flex flex-col lg:flex-row w-full">
          <LeftPanel />

          <div className="flex flex-col flex-1">
            <MobileHeader />

            <div className="flex flex-1 items-center justify-center p-8 bg-card">
              <div className="w-full max-w-[440px]">
                <SignInForm onSignIn={handleMicrosoftSignIn} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

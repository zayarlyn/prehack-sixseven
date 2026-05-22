import MicrosoftSignInButton from '@swap-web/modules/auth/components/MicrosoftSignInButton';

export default function LoginPage() {
  const handleMicrosoftSignIn = () => {
    // TODO: Implement Microsoft sign-in
  };

  return (
    <div>
      {import.meta.env.VITE_BYPASS_AUTH === 'true' && (
        <div
          style={{
            background: '#fa4617',
            color: 'white',
            padding: '8px 16px',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          ⚠️ DEV BYPASS MODE — Auth is disabled. Signed in as Dev User.
        </div>
      )}
      <div className="flex items-center justify-center min-h-screen">
        <MicrosoftSignInButton onClick={handleMicrosoftSignIn} />
      </div>
    </div>
  );
}

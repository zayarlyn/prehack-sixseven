import { Navigate } from '@tanstack/react-router';
import { useSession } from './auth.hooks';

const LoginPage = () => {
  const { data: user, isLoading } = useSession();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {import.meta.env.VITE_BYPASS_AUTH === 'true' && (
        <div className="w-full p-2 text-center text-white bg-[#fa4617]">
          ⚠️ DEV BYPASS MODE — Auth is disabled. Signed in as Dev User.
        </div>
      )}
      <div className="p-8">
        <h1 className="text-2xl font-bold">Login Page</h1>
        <p>Microsoft login button will go here.</p>
      </div>
    </div>
  );
};

export default LoginPage;

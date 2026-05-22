import { Link } from '@tanstack/react-router';

export default function NavBar() {
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
      <nav className="fixed top-0 left-0 right-0 bg-white border-b p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="text-xl font-bold" style={{ color: '#fa4617' }}>
            swap
          </div>
          <div className="flex gap-6">
            <Link to="/" className="hover:underline">
              Feed
            </Link>
            <Link to="/conversations" className="hover:underline">
              Messages
            </Link>
            <Link to="/profile" className="hover:underline">
              Profile
            </Link>
          </div>
          <Link to="/items/new" className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
            Sell
          </Link>
        </div>
      </nav>
    </div>
  );
}

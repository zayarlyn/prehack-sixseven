import { useState } from 'react';
import { Link, useNavigate, useSearch, useRouterState } from '@tanstack/react-router';
import Logo from './Logo';
import UserAvatar from './UserAvatar';
import { useAuth } from '@swap-web/modules/auth/hooks/useAuth';

export default function NavBar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const rawSearch = useSearch({ strict: false }) as Record<string, unknown>;
  const isOnFeed = pathname === '/';
  const currentQ: string = typeof rawSearch.q === 'string' ? rawSearch.q : '';

  const [inputValue, setInputValue] = useState(currentQ);
  const [prevQ, setPrevQ] = useState(currentQ);
  const [focused, setFocused] = useState(false);

  if (currentQ !== prevQ) {
    setPrevQ(currentQ);
    setInputValue(currentQ);
  }

  const handleSearch = (val: string) => {
    setInputValue(val);
    if (isOnFeed) {
      navigate({
        to: '/',
        search: { ...rawSearch, q: val || undefined, page: undefined } as Record<string, unknown>,
      });
    }
  };

  const handleSearchSubmit = () => {
    navigate({ to: '/', search: { q: inputValue || undefined } as Record<string, unknown> });
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 border-b border-border"
      style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'saturate(180%) blur(10px)',
        WebkitBackdropFilter: 'saturate(180%) blur(10px)',
      }}
    >
      {import.meta.env.VITE_BYPASS_AUTH === 'true' && (
        <div className="bg-primary text-primary-foreground px-4 py-1 text-center text-xs font-semibold">
          DEV BYPASS MODE — Auth disabled
        </div>
      )}
      <div className="mx-auto flex items-center gap-4 px-5" style={{ maxWidth: 1440, height: 64 }}>
        <Link to="/" className="shrink-0">
          <Logo size="sm" />
        </Link>

        {/* Search */}
        <div
          className="flex flex-1 items-center gap-2 transition-all"
          style={{
            maxWidth: 520,
            height: 42,
            borderRadius: 999,
            background: focused ? '#fff' : '#f1f1f1',
            border: `1.5px solid ${focused ? 'var(--od-primary)' : 'transparent'}`,
            boxShadow: focused ? '0 0 0 4px var(--od-primary-tint)' : 'none',
            padding: '0 14px',
            transition: 'all 120ms ease',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 text-muted-foreground">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            value={inputValue}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isOnFeed && handleSearchSubmit()}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search items..."
            className="flex-1 border-none bg-transparent text-sm outline-none"
            style={{ color: 'var(--od-text)' }}
          />
          {inputValue && (
            <button onClick={() => handleSearch('')} className="flex shrink-0 items-center p-1 text-muted-foreground">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2.5">
          {/* Chat icon */}
          <Link
            to="/conversations"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 12a8 8 0 0 1-11.6 7.15L4 20l1-4.4A8 8 0 1 1 21 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          {/* Avatar */}
          {user && (
            <Link to="/profile">
              <UserAvatar user={user} size={36} />
            </Link>
          )}

          {/* Sell */}
          <Link
            to="/items/new"
            className="flex items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            style={{ height: 40 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            Sell
          </Link>
        </div>
      </div>
    </header>
  );
}

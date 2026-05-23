import { PublicUser } from '@swap/types';
import UserAvatar from '@swap-web/common/components/UserAvatar';

function StatBlock({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4 }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--od-text-secondary)', marginTop: 1 }}>{label}</div>
    </div>
  );
}

function StatDivider() {
  return <div style={{ width: 1, height: 32, background: 'var(--od-border)' }} />;
}

function formatMemberSince(date: Date | string | undefined): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

interface ProfileHeaderProps {
  user: PublicUser;
  isOwnProfile: boolean;
  onEdit?: () => void;
  onMessage?: () => void;
  canMessage?: boolean;
}

export default function ProfileHeader({ user, isOwnProfile, onEdit, onMessage, canMessage }: ProfileHeaderProps) {
  const memberSince = formatMemberSince(user.memberSince ?? user.createdAt);
  const hasCounts = user.soldCount !== undefined || user.purchasedCount !== undefined;

  return (
    <div
      className="profile-header-inner"
      style={{
        background: '#fff',
        border: '1px solid var(--od-border)',
        borderRadius: 12,
        padding: 28,
        display: 'flex',
        alignItems: 'center',
        gap: 28,
        flexWrap: 'wrap',
      }}
    >
      <UserAvatar user={user} size={112} />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: -0.5 }}>{user.fullName}</h1>

        {(user.major || user.year || user.programLevel || user.faculty) && (
          <div style={{ fontSize: 14, color: 'var(--od-text)' }}>
            {[user.major, user.year ? `Year ${user.year} ${user.programLevel ?? ''}`.trim() : null, user.faculty]
              .filter(Boolean)
              .join(' · ')}
          </div>
        )}

        {memberSince && (
          <div style={{ fontSize: 12.5, color: 'var(--od-text-tertiary)' }}>Member since {memberSince}</div>
        )}

        {hasCounts && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 6 }}>
            <StatBlock value={user.soldCount ?? 0} label="Sold" />
            <StatDivider />
            <StatBlock value={user.purchasedCount ?? 0} label="Purchased" />
          </div>
        )}

        {user.bio && (
          <p
            style={{
              margin: '8px 0 0',
              fontSize: 13.5,
              color: 'var(--od-text-secondary)',
              lineHeight: 1.6,
              maxWidth: 600,
            }}
          >
            {user.bio}
          </p>
        )}
      </div>

      <div
        className="profile-actions"
        style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}
      >
        {isOwnProfile ? (
          <>
            <button
              onClick={onEdit}
              style={{
                height: 44,
                padding: '0 16px',
                borderRadius: 6,
                background: '#fff',
                color: 'var(--od-primary)',
                border: '1.5px solid var(--od-primary)',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: 'inherit',
                transition: 'background 120ms ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--od-primary-tint)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M16 4l4 4-11 11H5v-4L16 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              </svg>
              Edit Profile
            </button>
            <span style={{ fontSize: 11.5, color: 'var(--od-text-tertiary)' }}>Your public profile</span>
          </>
        ) : canMessage ? (
          <button
            onClick={onMessage}
            style={{
              height: 44,
              padding: '0 16px',
              borderRadius: 6,
              background: '#fff',
              color: 'var(--od-primary)',
              border: '1.5px solid var(--od-primary)',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: 'inherit',
              transition: 'background 120ms ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--od-primary-tint)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 12a8 8 0 0 1-11.6 7.15L4 20l1-4.4A8 8 0 1 1 21 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
            Message
          </button>
        ) : null}
      </div>
    </div>
  );
}

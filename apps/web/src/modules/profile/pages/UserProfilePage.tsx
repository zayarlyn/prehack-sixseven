import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@swap-web/modules/auth/hooks/useAuth';
import { useCreateConversation } from '@swap-web/modules/conversations/hooks/useConversations';
import LoadingSpinner from '@swap-web/common/components/LoadingSpinner';
import ErrorState from '@swap-web/common/components/ErrorState';
import ProfileHeader from '../components/ProfileHeader';
import ListingsTab from '../components/ListingsTab';
import SoldTab from '../components/SoldTab';
import { useProfile, useUserListings, useUserSold } from '../hooks/useProfile';

type Tab = 'listings' | 'sold';

interface TabButtonProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}

function TabButton({ label, count, active, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative',
        padding: '14px 4px 12px',
        marginRight: 16,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: 15,
        fontWeight: active ? 700 : 500,
        color: active ? 'var(--od-text)' : 'var(--od-text-secondary)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        transition: 'color 120ms ease',
        fontFamily: 'inherit',
      }}
    >
      {label}
      <span
        style={{
          fontSize: 12.5,
          fontWeight: active ? 700 : 500,
          color: active ? 'var(--od-primary)' : 'var(--od-text-tertiary)',
        }}
      >
        {count}
      </span>
      {active && (
        <span
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: -1,
            height: 2,
            background: 'var(--od-primary)',
            borderRadius: 2,
          }}
        />
      )}
    </button>
  );
}

export default function UserProfilePage() {
  const { userId } = useParams({ from: '/app/profile/$userId' });
  const { user: sessionUser } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('listings');

  const { data: profileData, isLoading: profileLoading, isError: profileError } = useProfile(userId);
  const { data: listingsData } = useUserListings(userId);
  const { data: soldData } = useUserSold(userId);
  const { mutate: createConversation, isPending: creatingConv } = useCreateConversation();

  if (profileLoading) return <LoadingSpinner />;
  if (profileError || !profileData?.data) return <ErrorState message="Failed to load profile." />;

  const user = profileData.data;
  const listings = listingsData?.data ?? [];
  const sold = soldData?.data ?? [];

  const isOwnProfile = sessionUser?.id === userId;
  const firstListing = listings[0];

  const handleMessage = () => {
    if (!firstListing) return;
    createConversation(
      { itemId: firstListing.id, sellerId: userId },
      {
        onSuccess: (res) => {
          const convId = res?.data?.id;
          navigate({ to: '/conversations', search: convId ? { conv: convId } : {} });
        },
      },
    );
  };

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'listings', label: 'Listings', count: listings.length },
    { id: 'sold', label: 'Sold', count: sold.length },
  ];

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', width: '100%', padding: '28px 24px 64px' }}>
      <ProfileHeader
        user={user}
        isOwnProfile={isOwnProfile}
        onMessage={handleMessage}
        canMessage={!isOwnProfile && listings.length > 0 && !creatingConv}
      />

      <div style={{ display: 'flex', borderBottom: '1px solid var(--od-border)', marginTop: 28, marginBottom: 24 }}>
        {tabs.map((t) => (
          <TabButton key={t.id} label={t.label} count={t.count} active={tab === t.id} onClick={() => setTab(t.id)} />
        ))}
      </div>

      {tab === 'listings' && <ListingsTab items={listings} />}
      {tab === 'sold' && <SoldTab items={sold} />}
    </main>
  );
}

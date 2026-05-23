import { useState } from 'react';
import LoadingSpinner from '@swap-web/common/components/LoadingSpinner';
import ErrorState from '@swap-web/common/components/ErrorState';
import ProfileHeader from '../components/ProfileHeader';
import ListingsTab from '../components/ListingsTab';
import SoldTab from '../components/SoldTab';
import PurchasesTab from '../components/PurchasesTab';
import EditProfileModal from '../components/EditProfileModal';
import TabButton from '../components/TabButton';
import { useMyProfile, useMyListings, useMySold, useMyPurchases } from '../hooks/useProfile';

type Tab = 'listings' | 'sold' | 'purchases';

export default function ProfilePage() {
  const [tab, setTab] = useState<Tab>('listings');
  const [editOpen, setEditOpen] = useState(false);

  const { data: profileData, isLoading: profileLoading, isError: profileError } = useMyProfile();
  const { data: listingsData } = useMyListings();
  const { data: soldData } = useMySold();
  const { data: purchasesData } = useMyPurchases();

  if (profileLoading) return <LoadingSpinner />;
  if (profileError || !profileData?.data) return <ErrorState message="Failed to load profile." />;

  const user = profileData.data;
  const listings = listingsData?.data ?? [];
  const sold = soldData?.data ?? [];
  const purchases = purchasesData?.data ?? [];

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'listings', label: 'Listings', count: listings.length },
    { id: 'sold', label: 'Sold', count: sold.length },
    { id: 'purchases', label: 'Purchases', count: purchases.length },
  ];

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', width: '100%', padding: '28px 24px 64px' }}>
      <ProfileHeader user={user} isOwnProfile={true} onEdit={() => setEditOpen(true)} />

      <div style={{ display: 'flex', borderBottom: '1px solid var(--od-border)', marginTop: 28, marginBottom: 24 }}>
        {tabs.map((t) => (
          <TabButton key={t.id} label={t.label} count={t.count} active={tab === t.id} onClick={() => setTab(t.id)} />
        ))}
      </div>

      {tab === 'listings' && <ListingsTab items={listings} showMenu={true} />}
      {tab === 'sold' && <SoldTab items={sold} />}
      {tab === 'purchases' && <PurchasesTab transactions={purchases} />}

      {editOpen && <EditProfileModal user={user} onClose={() => setEditOpen(false)} />}
    </main>
  );
}

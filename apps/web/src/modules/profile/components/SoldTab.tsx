import ProfileCard, { type ProfileCardItem } from './ProfileCard';

interface SoldTabProps {
  items: ProfileCardItem[];
}

export default function SoldTab({ items }: SoldTabProps) {
  if (items.length === 0) {
    return (
      <div
        style={{
          padding: '64px 24px',
          textAlign: 'center',
          color: 'var(--od-text-secondary)',
          fontSize: 14,
          background: '#fff',
          border: '1px solid var(--od-border)',
          borderRadius: 10,
        }}
      >
        Nothing sold yet.
      </div>
    );
  }

  return (
    <div className="profile-grid" style={{ display: 'grid', gap: 18 }}>
      {items.map((item) => (
        <ProfileCard key={item.id} item={item} status="sold" showMenu={false} date={item.soldAt} />
      ))}
    </div>
  );
}

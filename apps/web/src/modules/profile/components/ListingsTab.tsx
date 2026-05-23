import ProfileCard, { type ProfileCardItem } from './ProfileCard';

interface ListingsTabProps {
  items: ProfileCardItem[];
  showMenu?: boolean;
}

export default function ListingsTab({ items, showMenu = false }: ListingsTabProps) {
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
        No active listings yet — tap &quot;+ Sell&quot; to post something.
      </div>
    );
  }

  return (
    <div className="profile-grid" style={{ display: 'grid', gap: 18 }}>
      {items.map((item) => (
        <ProfileCard key={item.id} item={item} status="active" showMenu={showMenu} />
      ))}
    </div>
  );
}

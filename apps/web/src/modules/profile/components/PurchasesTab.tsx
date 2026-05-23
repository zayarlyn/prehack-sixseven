import ProfileCard, { type ProfileCardItem } from './ProfileCard';

interface PurchaseTransaction {
  item: ProfileCardItem;
  createdAt: Date | string;
}

interface PurchasesTabProps {
  transactions: PurchaseTransaction[];
}

export default function PurchasesTab({ transactions }: PurchasesTabProps) {
  if (transactions.length === 0) {
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
        No purchases yet.
      </div>
    );
  }

  return (
    <div className="profile-grid" style={{ display: 'grid', gap: 18 }}>
      {transactions.map((t) => (
        <ProfileCard key={t.item.id} item={t.item} status="purchased" showMenu={false} date={t.createdAt} />
      ))}
    </div>
  );
}

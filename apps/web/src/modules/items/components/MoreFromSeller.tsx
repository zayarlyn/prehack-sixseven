import { Link } from '@tanstack/react-router';
import type { ItemWithDetails } from '@swap/types';
import { useItems } from '@swap-web/modules/items/hooks/useItems';
import ItemRowCard from './ItemRowCard';

interface MoreFromSellerProps {
  item: ItemWithDetails;
}

export default function MoreFromSeller({ item }: MoreFromSellerProps) {
  const { data } = useItems({ sellerId: item.sellerId, limit: 5 });
  const allItems = data?.data ?? data?.items ?? [];
  const filtered = allItems.filter((i: { id: string }) => i.id !== item.id).slice(0, 4);

  if (filtered.length === 0) return null;

  return (
    <div>
      <div className="flex justify-between items-baseline mb-3.5">
        <h2 className="text-[18px] font-bold tracking-[-0.2px]">More from {item.seller.fullName}</h2>
        <Link
          to="/profile/$userId"
          params={{ userId: item.sellerId }}
          className="text-[13.5px] font-semibold text-primary hover:underline"
        >
          View all →
        </Link>
      </div>
      <div className="row-grid grid grid-cols-3 md:grid-cols-4 gap-4">
        {filtered.map((i: Parameters<typeof ItemRowCard>[0]['item']) => (
          <ItemRowCard key={i.id} item={i} />
        ))}
      </div>
    </div>
  );
}

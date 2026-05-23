import { Link } from '@tanstack/react-router';
import type { ItemWithDetails } from '@swap/types';
import { useItems } from '@swap-web/modules/items/hooks/useItems';
import ItemRowCard from './ItemRowCard';

interface SimilarItemsProps {
  item: ItemWithDetails;
}

export default function SimilarItems({ item }: SimilarItemsProps) {
  const { data } = useItems({ category: item.category, limit: 5 });
  const allItems = data?.data ?? data?.items ?? [];
  const filtered = allItems.filter((i: { id: string }) => i.id !== item.id).slice(0, 4);
  const categoryLabel = item.category.charAt(0).toUpperCase() + item.category.slice(1);

  if (filtered.length === 0) return null;

  return (
    <div>
      <div className="flex justify-between items-baseline mb-3.5">
        <h2 className="text-[18px] font-bold tracking-[-0.2px]">Similar items</h2>
        <Link
          to="/"
          search={{ q: undefined, category: item.category, sort: undefined, minPrice: undefined, maxPrice: undefined }}
          className="text-[13.5px] font-semibold text-primary hover:underline"
        >
          See all {categoryLabel} →
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

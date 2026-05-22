import { Item } from '@swap/types';
import ItemCard from '@swap-web/common/components/ItemCard';

interface FeedGridProps {
  items: Item[];
}

export default function FeedGrid({ items }: FeedGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

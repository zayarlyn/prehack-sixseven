import ItemCard, { ItemCardItem } from '@swap-web/common/components/ItemCard';
import ItemCardSkeleton from '@swap-web/common/components/ItemCardSkeleton';

interface FeedGridProps {
  items: ItemCardItem[];
  isLoading?: boolean;
  skeletonCount?: number;
}

export default function FeedGrid({ items, isLoading = false, skeletonCount = 10 }: FeedGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-[18px] lg:grid-cols-4 lg:gap-5 xl:grid-cols-5">
      {isLoading
        ? Array.from({ length: skeletonCount }).map((_, i) => <ItemCardSkeleton key={i} />)
        : items.map((item) => <ItemCard key={item.id} item={item} />)}
    </div>
  );
}

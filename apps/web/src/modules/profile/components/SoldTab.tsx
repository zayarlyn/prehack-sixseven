import { ItemCardItem } from '@swap-web/common/components/ItemCard';
import FeedGrid from '@swap-web/modules/feed/components/FeedGrid';

interface SoldTabProps {
  items: ItemCardItem[];
}

export default function SoldTab({ items }: SoldTabProps) {
  return <FeedGrid items={items} />;
}

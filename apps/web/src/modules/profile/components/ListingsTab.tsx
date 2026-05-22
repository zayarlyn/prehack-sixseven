import { ItemCardItem } from '@swap-web/common/components/ItemCard';
import FeedGrid from '@swap-web/modules/feed/components/FeedGrid';

interface ListingsTabProps {
  items: ItemCardItem[];
}

export default function ListingsTab({ items }: ListingsTabProps) {
  return <FeedGrid items={items} />;
}

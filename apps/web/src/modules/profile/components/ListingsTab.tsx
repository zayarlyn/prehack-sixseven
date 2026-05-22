import { Item } from '@swap/types';
import FeedGrid from '@swap-web/modules/feed/components/FeedGrid';

interface ListingsTabProps {
  items: Item[];
}

export default function ListingsTab({ items }: ListingsTabProps) {
  return <FeedGrid items={items} />;
}

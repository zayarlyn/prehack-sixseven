import { Item } from '@swap/types';
import FeedGrid from '@swap-web/modules/feed/components/FeedGrid';

interface SoldTabProps {
  items: Item[];
}

export default function SoldTab({ items }: SoldTabProps) {
  return <FeedGrid items={items} />;
}

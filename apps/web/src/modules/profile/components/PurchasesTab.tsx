import { Item } from '@swap/types';
import FeedGrid from '@swap-web/modules/feed/components/FeedGrid';

interface PurchasesTabProps {
  items: Item[];
}

export default function PurchasesTab({ items }: PurchasesTabProps) {
  return <FeedGrid items={items} />;
}

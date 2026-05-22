import { ItemCardItem } from '@swap-web/common/components/ItemCard';
import FeedGrid from '@swap-web/modules/feed/components/FeedGrid';

interface PurchasesTabProps {
  items: ItemCardItem[];
}

export default function PurchasesTab({ items }: PurchasesTabProps) {
  return <FeedGrid items={items} />;
}

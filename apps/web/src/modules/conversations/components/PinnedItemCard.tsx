import { Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import CategoryThumbnail from '@swap-web/common/components/CategoryThumbnail';
import { type Category } from '@swap-web/common/lib/category-palette';
import { type ConversationWithDetails } from '@swap/types';

interface PinnedItemCardProps {
  item: ConversationWithDetails['item'];
}

export default function PinnedItemCard({ item }: PinnedItemCardProps) {
  const category = (item.category.charAt(0).toUpperCase() + item.category.slice(1)) as Category;

  return (
    <div className="flex gap-3.5 items-center px-[18px] py-3 border-b bg-white flex-shrink-0">
      <div className="w-[52px] h-[52px] rounded-lg overflow-hidden flex-shrink-0">
        {item.itemImages[0] ? (
          <img src={item.itemImages[0].url} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <CategoryThumbnail category={category} tag={item.category.slice(0, 3)} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[13.5px] truncate">{item.title}</p>
        <p className="text-primary text-lg font-extrabold leading-tight">฿{item.price.toLocaleString()}</p>
      </div>
      <Link
        to="/items/$itemId"
        params={{ itemId: item.id }}
        className="flex items-center gap-1 text-xs font-medium border rounded-md px-2.5 py-1.5 hover:bg-accent transition-colors flex-shrink-0"
      >
        View listing
        <ChevronRight className="w-3 h-3" />
      </Link>
    </div>
  );
}

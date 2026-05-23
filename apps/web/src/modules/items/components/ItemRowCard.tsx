import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import type { Item } from '@swap/types';
import CategoryThumbnail from '@swap-web/common/components/CategoryThumbnail';
import type { Category } from '@swap-web/common/lib/category-palette';

interface ItemRowCardItem extends Item {
  itemImages: { url: string }[];
}

interface ItemRowCardProps {
  item: ItemRowCardItem;
}

export default function ItemRowCard({ item }: ItemRowCardProps) {
  const [hover, setHover] = useState(false);
  const categoryKey = (item.category.charAt(0).toUpperCase() + item.category.slice(1)) as Category;

  return (
    <Link to="/items/$itemId" params={{ itemId: item.id }} className="block" style={{ textDecoration: 'none' }}>
      <article
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="flex flex-col overflow-hidden rounded-lg bg-white transition-[box-shadow,transform] duration-[160ms]"
        style={{
          boxShadow: hover ? 'var(--od-shadow-card-hover)' : 'var(--od-shadow-card)',
          transform: hover ? 'translateY(-2px)' : 'none',
        }}
      >
        <div className="w-full aspect-square overflow-hidden">
          {item.itemImages.length > 0 ? (
            <img src={item.itemImages[0].url} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <CategoryThumbnail category={categoryKey} hideLabel />
          )}
        </div>
        <div className="p-[10px_10px_12px]">
          <p className="text-[13px] font-medium leading-[1.35] line-clamp-2 min-h-[35px] text-foreground">
            {item.title}
          </p>
          <p className="text-[16px] font-bold tracking-[-0.2px] mt-1.5 text-foreground">
            ฿{item.price.toLocaleString()}
          </p>
        </div>
      </article>
    </Link>
  );
}

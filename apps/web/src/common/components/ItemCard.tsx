import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Item, PublicUser } from '@swap/types';
import { cn } from '@swap-web/common/lib/utils';
import CategoryThumbnail from './CategoryThumbnail';
import UserAvatar from './UserAvatar';
import { CATEGORY_PALETTE } from '@swap-web/common/lib/category-palette';

type CategoryKey = keyof typeof CATEGORY_PALETTE;

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function relativeTime(date: Date | string): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 172800) return 'Yesterday';
  return `${Math.floor(diff / 86400)}d ago`;
}

export interface ItemCardItem extends Item {
  seller: PublicUser;
  itemImages: { url: string }[];
}

interface ItemCardProps {
  item: ItemCardItem;
}

export default function ItemCard({ item }: ItemCardProps) {
  const [hover, setHover] = useState(false);
  const categoryKey = capitalize(item.category) as CategoryKey;

  return (
    <Link to="/items/$itemId" params={{ itemId: item.id }} className="block" style={{ textDecoration: 'none' }}>
      <article
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={cn('flex flex-col overflow-hidden rounded-lg bg-white transition-all duration-160')}
        style={{
          boxShadow: hover ? 'var(--od-shadow-card-hover)' : 'var(--od-shadow-card)',
          transform: hover ? 'translateY(-2px)' : 'none',
        }}
      >
        {item.itemImages.length > 0 ? (
          <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', overflow: 'hidden' }}>
            <img
              src={item.itemImages[0].url}
              alt={item.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {item.status === 'sold' && (
              <div
                style={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  background: '#10b981',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '4px 8px',
                  borderRadius: 4,
                  letterSpacing: 0.4,
                }}
              >
                SOLD
              </div>
            )}
          </div>
        ) : (
          <CategoryThumbnail category={categoryKey} tag={item.title} sold={item.status === 'sold'} />
        )}

        <div className="flex flex-1 flex-col gap-1.5 p-3 pb-3.5">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground" style={{ minHeight: 38 }}>
            {item.title}
          </h3>
          <div className="text-lg font-bold tracking-tight text-foreground">฿{item.price.toLocaleString()}</div>
          <div className="mt-1 flex items-center gap-1.5 border-t border-border pt-2">
            <UserAvatar user={item.seller} size={20} />
            <span className="flex-1 truncate text-xs text-muted-foreground">{item.seller.fullName}</span>
            <span className="text-xs text-muted-foreground/60">·</span>
            <span className="shrink-0 text-xs text-muted-foreground/60">{relativeTime(item.createdAt)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

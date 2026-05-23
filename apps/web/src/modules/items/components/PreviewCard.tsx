import CategoryThumbnail from '@swap-web/common/components/CategoryThumbnail';
import UserAvatar from '@swap-web/common/components/UserAvatar';
import { useAuth } from '@swap-web/modules/auth/hooks/useAuth';
import { CATEGORY_PALETTE } from '@swap-web/common/lib/category-palette';
import type { UploadedPhoto } from './ImageUploader';

type CategoryKey = keyof typeof CATEGORY_PALETTE;

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

interface PreviewCardProps {
  title: string;
  price: string;
  category: string;
  photos: UploadedPhoto[];
}

export default function PreviewCard({ title, price, category, photos }: PreviewCardProps) {
  const { user } = useAuth();
  const coverPhoto = photos.find((p) => p.previewUrl);
  const categoryKey = capitalize(category || 'other') as CategoryKey;

  return (
    <article
      className="flex flex-col overflow-hidden rounded-lg bg-white pointer-events-none"
      style={{ boxShadow: 'var(--od-shadow-card)' }}
    >
      {coverPhoto ? (
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', overflow: 'hidden' }}>
          <img src={coverPhoto.previewUrl} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ) : (
        <CategoryThumbnail category={categoryKey} tag={title || undefined} />
      )}

      <div className="flex flex-1 flex-col gap-1.5 p-3 pb-3.5">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground" style={{ minHeight: 38 }}>
          {title || <span className="text-muted-foreground">Your listing title</span>}
        </h3>
        <div className="text-lg font-bold tracking-tight text-foreground">฿{Number(price || 0).toLocaleString()}</div>
        <div className="mt-1 flex items-center gap-1.5 border-t border-border pt-2">
          {user && <UserAvatar user={user} size={20} />}
          <span className="flex-1 truncate text-xs text-muted-foreground">{user?.fullName ?? ''}</span>
          <span className="text-xs text-muted-foreground/60">·</span>
          <span className="shrink-0 text-xs text-muted-foreground/60">just now</span>
        </div>
      </div>
    </article>
  );
}

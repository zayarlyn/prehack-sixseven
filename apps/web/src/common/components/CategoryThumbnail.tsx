import { CATEGORY_PALETTE, type Category } from '@swap-web/common/lib/category-palette';

interface CategoryThumbnailProps {
  category: Category;
  tag?: string;
  sold?: boolean;
  hideLabel?: boolean;
}

export default function CategoryThumbnail({ category, tag, sold = false, hideLabel = false }: CategoryThumbnailProps) {
  const p = CATEGORY_PALETTE[category] ?? CATEGORY_PALETTE.Other;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1 / 1',
        background: `repeating-linear-gradient(135deg, ${p.bg} 0 12px, ${p.stripe} 12px 24px)`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {!hideLabel && tag && (
          <span
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, Menlo, monospace",
              fontSize: 11,
              fontWeight: 500,
              color: p.label,
              background: 'rgba(255,255,255,0.78)',
              padding: '4px 8px',
              borderRadius: 4,
              letterSpacing: 0.2,
              maxWidth: '85%',
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          >
            [{tag}]
          </span>
        )}
      </div>

      {sold && (
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
  );
}

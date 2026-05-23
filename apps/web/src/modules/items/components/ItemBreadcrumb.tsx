import { Link } from '@tanstack/react-router';
import type { ItemCategory } from '@swap/types';

interface ItemBreadcrumbProps {
  category: ItemCategory;
  title: string;
}

function ChevronRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M4.5 2.5L7.5 6L4.5 9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ItemBreadcrumb({ category, title }: ItemBreadcrumbProps) {
  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <nav className="flex items-center gap-1.5 text-[13px] text-muted-foreground mb-[18px]">
      <Link
        to="/"
        search={{ q: undefined, category: undefined, sort: undefined, minPrice: undefined, maxPrice: undefined }}
        className="hover:text-primary transition-colors"
      >
        Browse
      </Link>
      <ChevronRight />
      <Link
        to="/"
        search={{ q: undefined, category, sort: undefined, minPrice: undefined, maxPrice: undefined }}
        className="hover:text-primary transition-colors"
      >
        {categoryLabel}
      </Link>
      <ChevronRight />
      <span className="text-foreground font-medium truncate max-w-[240px]">{title}</span>
    </nav>
  );
}

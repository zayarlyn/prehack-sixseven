import { cn } from '@swap-web/common/lib/utils';

const CATEGORIES = ['all', 'books', 'electronics', 'furniture', 'clothing', 'other'] as const;
const LABELS: Record<string, string> = {
  all: 'All',
  books: 'Books',
  electronics: 'Electronics',
  furniture: 'Furniture',
  clothing: 'Clothing',
  other: 'Other',
};

interface CategoryChipsProps {
  value: string;
  onChange: (category: string) => void;
}

export default function CategoryChips({ value, onChange }: CategoryChipsProps) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1" style={{ flex: 1, minWidth: 0 }}>
      {CATEGORIES.map((cat) => {
        const selected = cat === value;
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={cn(
              'h-9 shrink-0 rounded-full px-3.5 text-sm font-medium transition-all duration-120',
              selected
                ? 'border border-transparent bg-accent text-primary font-semibold'
                : 'border border-border bg-white text-foreground hover:bg-muted',
            )}
          >
            {LABELS[cat]}
          </button>
        );
      })}
    </div>
  );
}

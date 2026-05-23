import CategoryChips from './CategoryChips';
import SortDropdown from './SortDropdown';
import PriceFilter from './PriceFilter';

interface FilterBarProps {
  q: string;
  category: string;
  sort: string;
  minPrice: number | null;
  maxPrice: number | null;
  total: number;
  onFilterChange: (updates: Record<string, unknown>) => void;
  onClearFilters: () => void;
}

export default function FilterBar({ category, sort, minPrice, maxPrice, total, onFilterChange }: FilterBarProps) {
  return (
    <div className="max-w-[500px] md:max-w-[1120px] mx-auto px-6">
      <div className="flex flex-wrap items-center gap-2.5 py-4">
        <CategoryChips
          value={category}
          onChange={(cat) => onFilterChange({ category: cat === 'all' ? undefined : cat })}
        />
        <div className="flex shrink-0 gap-2">
          <PriceFilter
            min={minPrice}
            max={maxPrice}
            onChange={(min, max) => onFilterChange({ minPrice: min ?? undefined, maxPrice: max ?? undefined })}
          />
          <SortDropdown value={sort} onChange={(s) => onFilterChange({ sort: s })} />
        </div>
      </div>

      {total > 0 && (
        <p className="pb-3 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{total}</span> {total === 1 ? 'item' : 'items'}
          {category !== 'all' && (
            <>
              {' '}
              in <span className="font-semibold capitalize text-foreground">{category}</span>
            </>
          )}
        </p>
      )}
    </div>
  );
}

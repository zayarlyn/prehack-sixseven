import { useNavigate, useSearch } from '@tanstack/react-router';
import { useItems } from '../hooks/useItems';
import FilterBar from '../components/FilterBar';
import FeedGrid from '../components/FeedGrid';
import EmptyState from '@swap-web/common/components/EmptyState';
import { ItemCardItem } from '@swap-web/common/components/ItemCard';

interface FeedSearch {
  q?: string;
  category?: string;
  sort?: 'newest' | 'low' | 'high';
  minPrice?: number;
  maxPrice?: number;
}

export default function FeedPage() {
  const navigate = useNavigate();
  const rawSearch = useSearch({ strict: false }) as FeedSearch;
  const q = rawSearch.q ?? '';
  const category = rawSearch.category ?? 'all';
  const sort = rawSearch.sort ?? 'newest';
  const minPrice = rawSearch.minPrice ?? null;
  const maxPrice = rawSearch.maxPrice ?? null;

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useItems({
    q: q || undefined,
    category: category !== 'all' ? category : undefined,
    sort,
    minPrice: minPrice ?? undefined,
    maxPrice: maxPrice ?? undefined,
  });

  const allItems: ItemCardItem[] = data?.pages.flatMap((p) => p.data) ?? [];
  const total = data?.pages[data.pages.length - 1]?.pagination.total ?? 0;
  const remaining = total - allItems.length;
  const isEmpty = !isLoading && allItems.length === 0;

  const setFilter = (updates: Record<string, unknown>) => {
    navigate({ to: '/', search: { ...rawSearch, ...updates } as Record<string, unknown> });
  };

  const clearFilters = () => {
    navigate({ to: '/', search: {} });
  };

  return (
    <div className="">
      <FilterBar
        q={q}
        category={category}
        sort={sort}
        minPrice={minPrice}
        maxPrice={maxPrice}
        total={total}
        onFilterChange={setFilter}
        onClearFilters={clearFilters}
      />

      <main className="max-w-[500px] md:max-w-[1120px] mx-auto px-6 pb-28">
        {isEmpty ? (
          <EmptyState
            title="No items match your filters"
            description="Try a different category or price range — there's plenty more on the campus marketplace."
            onClear={clearFilters}
          />
        ) : (
          <>
            <FeedGrid items={allItems} isLoading={isLoading} />
            {(hasNextPage || isFetchingNextPage) && (
              <div className="flex flex-col items-center gap-2 py-8">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="h-11 rounded-md border border-primary px-6 text-sm font-semibold text-primary transition-colors hover:bg-accent disabled:opacity-50"
                >
                  {isFetchingNextPage ? 'Loading…' : 'Load more'}
                </button>
                {remaining > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {remaining} more {remaining === 1 ? 'item' : 'items'}
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

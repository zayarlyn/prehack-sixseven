import { Skeleton } from '@swap-web/common/components/ui/skeleton';

export default function ItemCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg bg-white" style={{ boxShadow: 'var(--od-shadow-card)' }}>
      <div style={{ width: '100%', aspectRatio: '1 / 1' }}>
        <Skeleton className="h-full w-full rounded-none" />
      </div>
      <div className="flex flex-col gap-2 p-3 pb-3.5">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="mt-1 h-5 w-1/3" />
        <div className="mt-1 flex items-center gap-1.5 border-t border-border pt-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  );
}

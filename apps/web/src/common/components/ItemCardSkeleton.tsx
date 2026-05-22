import { Card, CardContent } from '@swap-web/common/components/ui/card';
import { Skeleton } from '@swap-web/common/components/ui/skeleton';

export default function ItemCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-6 w-1/3" />
      </CardContent>
    </Card>
  );
}

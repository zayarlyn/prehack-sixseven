import { ItemStatus } from '@swap/types';
import { Badge } from '@swap-web/common/components/ui/badge';
import { cn } from '@swap-web/common/lib/utils';

interface StatusBadgeProps {
  status: ItemStatus;
}

const STATUS_CLASSES: Record<ItemStatus, string> = {
  active: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100',
  sold: '',
  deleted: '',
};

const STATUS_VARIANTS: Record<ItemStatus, 'secondary' | 'destructive' | 'outline'> = {
  active: 'outline',
  sold: 'secondary',
  deleted: 'destructive',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant={STATUS_VARIANTS[status]} className={cn(STATUS_CLASSES[status])}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

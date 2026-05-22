import { ItemStatus } from '@swap/types';

interface StatusBadgeProps {
  status: ItemStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const colorMap = {
    active: 'bg-green-100 text-green-800',
    sold: 'bg-gray-100 text-gray-800',
    deleted: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorMap[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

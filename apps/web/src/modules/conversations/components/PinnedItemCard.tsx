import { Item } from '@swap/types';

interface PinnedItemCardProps {
  item: Item;
  isSeller: boolean;
}

export default function PinnedItemCard({ item, isSeller }: PinnedItemCardProps) {
  return (
    <div className="border rounded p-4 mb-4 bg-gray-50">
      <h4 className="font-semibold mb-2">{item.title}</h4>
      <p className="text-sm text-gray-600 mb-2">${item.price}</p>
      {isSeller && <button className="text-sm px-3 py-1 border rounded hover:bg-gray-100">Mark as Sold</button>}
    </div>
  );
}

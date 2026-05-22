import { Item } from '@swap/types';

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  return (
    <div className="border rounded p-4">
      <h3 className="font-semibold">{item.title}</h3>
      <p className="text-lg font-bold">${item.price}</p>
    </div>
  );
}

import { Item } from '@swap/types';

interface ItemDetailSellerProps {
  item: Item;
}

export default function ItemDetailSeller({ item }: ItemDetailSellerProps) {
  return (
    <div className="border rounded p-4">
      <h1 className="text-2xl font-bold mb-2">{item.title}</h1>
      <p className="text-xl font-semibold mb-4">${item.price}</p>
      <div className="flex gap-2">
        <button className="px-4 py-2 border rounded hover:bg-gray-100">Edit</button>
        <button className="px-4 py-2 border rounded hover:bg-gray-100">Mark as Sold</button>
      </div>
    </div>
  );
}

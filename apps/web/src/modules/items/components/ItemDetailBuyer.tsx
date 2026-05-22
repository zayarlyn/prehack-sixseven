import { Item } from '@swap/types';

interface ItemDetailBuyerProps {
  item: Item;
}

export default function ItemDetailBuyer({ item }: ItemDetailBuyerProps) {
  return (
    <div className="border rounded p-4">
      <h1 className="text-2xl font-bold mb-2">{item.title}</h1>
      <p className="text-xl font-semibold mb-4">${item.price}</p>
      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Chat with Seller</button>
    </div>
  );
}

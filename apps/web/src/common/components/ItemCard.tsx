import { Item } from '@swap/types';
import { Card, CardContent } from '@swap-web/common/components/ui/card';

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold">{item.title}</h3>
        <p className="text-lg font-bold">${item.price}</p>
      </CardContent>
    </Card>
  );
}

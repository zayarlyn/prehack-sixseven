import { useParams } from '@tanstack/react-router';

export default function ItemDetailPage() {
  const { itemId } = useParams({ from: '/items/$itemId' });

  return <div>Item {itemId} — coming soon</div>;
}

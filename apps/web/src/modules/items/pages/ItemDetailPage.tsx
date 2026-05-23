import { useParams } from '@tanstack/react-router';
import type { ItemWithDetails } from '@swap/types';
import LoadingSpinner from '@swap-web/common/components/LoadingSpinner';
import ErrorState from '@swap-web/common/components/ErrorState';
import { useAuth } from '@swap-web/modules/auth/hooks/useAuth';
import { useItem } from '@swap-web/modules/items/hooks/useItems';
import ItemBreadcrumb from '../components/ItemBreadcrumb';
import ImageCarousel from '../components/ImageCarousel';
import DescriptionBlock from '../components/DescriptionBlock';
import ItemDetailBuyer from '../components/ItemDetailBuyer';
import ItemDetailSeller from '../components/ItemDetailSeller';
import MoreFromSeller from '../components/MoreFromSeller';
import SimilarItems from '../components/SimilarItems';

export default function ItemDetailPage() {
  const { itemId } = useParams({ from: '/app/items/$itemId' });
  const { data, isLoading, isError } = useItem(itemId);
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorState message="Could not load this listing. It may have been removed." />;
  }

  const item = data.data as ItemWithDetails;
  const isSeller = user?.id === item.sellerId;

  return (
    <div className="max-w-[500px] md:max-w-[1120px] mx-auto px-6 py-5 pb-[72px]">
      <ItemBreadcrumb category={item.category} title={item.title} />

      <div className="detail-layout grid gap-7 mt-[18px] items-start sm:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] grid-cols-1 sm:grid-cols-2">
        {/* Left column */}
        <div>
          <ImageCarousel images={item.itemImages} category={item.category} />
          <DescriptionBlock description={item.description} />
        </div>

        {/* Right column */}
        {isSeller ? <ItemDetailSeller item={item} /> : <ItemDetailBuyer item={item} />}
      </div>

      <section className="mt-10">
        <MoreFromSeller item={item} />
      </section>

      <section className="mt-10">
        <SimilarItems item={item} />
      </section>
    </div>
  );
}

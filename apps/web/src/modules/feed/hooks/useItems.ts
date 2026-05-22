import { useInfiniteQuery } from '@tanstack/react-query';
import api from '@swap-web/common/lib/axios';

export interface FeedParams {
  q?: string;
  category?: string;
  sort?: 'newest' | 'low' | 'high';
  minPrice?: number;
  maxPrice?: number;
}

export function useItems(params: FeedParams = {}) {
  return useInfiniteQuery({
    queryKey: ['items', params],
    queryFn: ({ pageParam }) => api.get('/items', { params: { ...params, page: pageParam } }).then((r) => r.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });
}

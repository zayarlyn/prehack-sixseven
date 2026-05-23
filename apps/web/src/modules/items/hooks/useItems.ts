import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@swap-web/common/lib/axios';
import type { ApiResponse, ItemWithDetails, CreateItemPayload } from '@swap/types';

export function useItems(query?: any) {
  return useQuery({
    queryKey: ['items', query],
    queryFn: () => axios.get('/items', { params: query }).then((r) => r.data),
  });
}

export function useItem(id: string) {
  return useQuery<ApiResponse<ItemWithDetails>>({
    queryKey: ['item', id],
    queryFn: () => axios.get(`/items/${id}`).then((r) => r.data),
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateItemPayload) => axios.post('/items', data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}

export function useUpdateItem() {
  return useMutation({
    mutationFn: ({ id, data }: any) => axios.patch(`/items/${id}`, data).then((r) => r.data),
  });
}

export function useDeleteItem() {
  return useMutation({
    mutationFn: (id: string) => axios.delete(`/items/${id}`).then((r) => r.data),
  });
}

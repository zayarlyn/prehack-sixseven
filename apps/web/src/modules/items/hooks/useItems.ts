import { useQuery, useMutation } from '@tanstack/react-query';
import axios from '@swap-web/common/lib/axios';

export function useItems(query?: any) {
  return useQuery({
    queryKey: ['items', query],
    queryFn: () => axios.get('/api/items', { params: query }).then((r) => r.data),
  });
}

export function useItem(id: string) {
  return useQuery({
    queryKey: ['item', id],
    queryFn: () => axios.get(`/api/items/${id}`).then((r) => r.data),
  });
}

export function useCreateItem() {
  return useMutation({
    mutationFn: (data: any) => axios.post('/api/items', data).then((r) => r.data),
  });
}

export function useUpdateItem() {
  return useMutation({
    mutationFn: ({ id, data }: any) => axios.patch(`/api/items/${id}`, data).then((r) => r.data),
  });
}

export function useDeleteItem() {
  return useMutation({
    mutationFn: (id: string) => axios.delete(`/api/items/${id}`).then((r) => r.data),
  });
}

import { useQuery, useMutation } from '@tanstack/react-query';
import axios from '@swap-web/common/lib/axios';

export function useCreateTransaction() {
  return useMutation({
    mutationFn: (data: any) => axios.post('/api/transactions', data).then((r) => r.data),
  });
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: ['transaction', id],
    queryFn: () => axios.get(`/api/transactions/${id}`).then((r) => r.data),
  });
}

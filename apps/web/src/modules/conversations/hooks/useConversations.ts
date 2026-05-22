import { useQuery, useMutation } from '@tanstack/react-query';
import axios from '@swap-web/common/lib/axios';

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => axios.get('/api/conversations').then((r) => r.data),
  });
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: ['conversation', id],
    queryFn: () => axios.get(`/api/conversations/${id}`).then((r) => r.data),
  });
}

export function useCreateConversation() {
  return useMutation({
    mutationFn: (data: any) => axios.post('/api/conversations', data).then((r) => r.data),
  });
}

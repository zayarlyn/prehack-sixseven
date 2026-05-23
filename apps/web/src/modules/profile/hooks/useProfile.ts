import api from '@swap-web/common/lib/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useMyProfile() {
  return useQuery({
    queryKey: ['profile', 'me'],
    queryFn: () => api.get('/users/me').then((r) => r.data),
  });
}

export function useProfile(userId: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => api.get(`/users/${userId}`).then((r) => r.data),
    enabled: !!userId,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.patch('/users/me', data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function useMyListings() {
  return useQuery({
    queryKey: ['listings', 'me'],
    queryFn: () => api.get('/users/me/listings').then((r) => r.data),
  });
}

export function useMySold() {
  return useQuery({
    queryKey: ['sold', 'me'],
    queryFn: () => api.get('/users/me/sold').then((r) => r.data),
  });
}

export function useMyPurchases() {
  return useQuery({
    queryKey: ['purchases', 'me'],
    queryFn: () => api.get('/users/me/purchases').then((r) => r.data),
  });
}

export function useUserListings(userId: string) {
  return useQuery({
    queryKey: ['listings', userId],
    queryFn: () => api.get(`/users/${userId}/listings`).then((r) => r.data),
  });
}

export function useUserSold(userId: string) {
  return useQuery({
    queryKey: ['sold', userId],
    queryFn: () => api.get(`/users/${userId}/sold`).then((r) => r.data),
  });
}

export function useMarkItemSold() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => api.patch(`/items/${itemId}`, { status: 'sold' }).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['sold'] });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => api.delete(`/items/${itemId}`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

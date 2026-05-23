import axios from '@swap-web/common/lib/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useMyProfile() {
  return useQuery({
    queryKey: ['profile', 'me'],
    queryFn: () => axios.get('/users/me').then((r) => r.data),
  });
}

export function useProfile(userId: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => axios.get(`/users/${userId}`).then((r) => r.data),
    enabled: !!userId,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => axios.patch('/users/me', data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] }); // invalidates both ['profile','me'] and ['profile', userId]
    },
  });
}

export function useMyListings() {
  return useQuery({
    queryKey: ['listings', 'me'],
    queryFn: () => axios.get('/users/me/listings').then((r) => r.data),
  });
}

export function useUserListings(userId: string) {
  return useQuery({
    queryKey: ['listings', userId],
    queryFn: () => axios.get(`/users/${userId}/listings`).then((r) => r.data),
  });
}

export function useUserSold(userId: string) {
  return useQuery({
    queryKey: ['sold', userId],
    queryFn: () => axios.get(`/users/${userId}/sold`).then((r) => r.data),
  });
}

export function useMyPurchases() {
  return useQuery({
    queryKey: ['purchases', 'me'],
    queryFn: () => axios.get('/users/me/purchases').then((r) => r.data),
  });
}

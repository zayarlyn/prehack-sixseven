import { useQuery, useMutation } from '@tanstack/react-query';
import axios from '@swap-web/common/lib/axios';

export function useProfile(userId: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => axios.get(`/api/users/${userId}`).then((r) => r.data),
  });
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (data: any) => axios.patch('/api/users/me', data).then((r) => r.data),
  });
}

export function useUserListings(userId: string) {
  return useQuery({
    queryKey: ['listings', userId],
    queryFn: () => axios.get(`/api/users/${userId}/listings`).then((r) => r.data),
  });
}

export function useUserSold(userId: string) {
  return useQuery({
    queryKey: ['sold', userId],
    queryFn: () => axios.get(`/api/users/${userId}/sold`).then((r) => r.data),
  });
}

export function useUserPurchases(userId: string) {
  return useQuery({
    queryKey: ['purchases', userId],
    queryFn: () => axios.get(`/api/users/${userId}/purchases`).then((r) => r.data),
  });
}

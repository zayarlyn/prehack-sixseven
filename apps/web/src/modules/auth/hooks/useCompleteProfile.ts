import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CompleteProfilePayload } from '@swap/types';
import api from '@swap-web/common/lib/axios';
import { useAuth } from './useAuth';
import { redirect } from '@tanstack/react-router';

export const useCompleteProfile = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuth();

  return useMutation({
    mutationFn: (data: CompleteProfilePayload) => api.post('/auth/complete-profile', data),
    onSuccess: (response) => {
      const updatedUser = response.data.data;
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['me'] });
      redirect({ to: '/' }); // Redirect to home or desired page after profile completion
    },
  });
};

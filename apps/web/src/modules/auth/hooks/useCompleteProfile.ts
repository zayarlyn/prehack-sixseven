import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CompleteProfilePayload } from '@swap/types';
import api from '@swap-web/common/lib/axios';
import { useAuth } from './useAuth';
import { useNavigate } from '@tanstack/react-router';

export const useCompleteProfile = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CompleteProfilePayload) => api.post('/auth/complete-profile', data),
    onSuccess: (response) => {
      const updatedUser = response.data.data;
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['me'] });
      navigate({ to: '/' });
    },
  });
};

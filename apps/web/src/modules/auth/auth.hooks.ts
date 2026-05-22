import { useQuery } from '@tanstack/react-query';
import { getSession } from './auth.api';

export const useSession = () => {
  return useQuery({
    queryKey: ['session'],
    queryFn: getSession,
    retry: false,
  });
};

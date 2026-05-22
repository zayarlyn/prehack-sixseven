import { api } from '@swap-web/common/lib/axios';
import { SessionUser } from '@swap/types';

export const getSession = async () => {
  const response = await api.get<SessionUser>('/auth/session');
  return response.data;
};

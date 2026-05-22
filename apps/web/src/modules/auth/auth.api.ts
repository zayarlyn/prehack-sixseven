import { api } from '@swap-web/common/lib/axios';
import { SessionUser } from '@swap/types';

export const getSession = async () => {
  const response = await api.get<{ success: boolean; data: SessionUser }>('/auth/session');
  return response.data.data;
};

export const getMe = async () => {
  const response = await api.get<{ success: boolean; data: SessionUser }>('/auth/me');
  return response.data.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

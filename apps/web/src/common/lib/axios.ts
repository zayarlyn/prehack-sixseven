import axios from 'axios';
import { useAuthStore } from '@swap-web/modules/auth/store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// In bypass mode we still attach a dev token for backend checks
api.interceptors.request.use((config) => {
  if (import.meta.env.VITE_BYPASS_AUTH === 'true') {
    config.headers = config.headers ?? {};
    config.headers.Authorization = 'Bearer dev-bypass-token';
  }
  return config;
});

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const isLogoutRequest = error.config?.url?.includes('/auth/logout');
//     if (error.response?.status === 401 && !isLogoutRequest) {
//       if (import.meta.env.VITE_BYPASS_AUTH === 'true') {
//         // no-op in bypass mode
//       } else {
//         try {
//           await api.post('/auth/logout');
//         } catch (_e) {
//           // best-effort — cookie may already be invalid
//         }
//         useAuthStore.getState().clearAuth();
//         window.location.href = '/login';
//       }
//     }
//     return Promise.reject(error);
//   },
// );

export { api };
export default api;

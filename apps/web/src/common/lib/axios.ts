import axios from 'axios';

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (import.meta.env.VITE_BYPASS_AUTH === 'true') {
        console.warn('[auth] 401 received in bypass mode');
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export { api };
export default api;

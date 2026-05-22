import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  if (import.meta.env.VITE_BYPASS_AUTH === 'true') {
    config.headers.Authorization = 'Bearer dev-bypass-token';
    return config;
  }

  const token = localStorage.getItem('swap_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && import.meta.env.VITE_BYPASS_AUTH !== 'true') {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;

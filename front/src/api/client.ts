import axios from 'axios';

const API_URL = 'http://localhost:5080/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('waygo_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('waygo_token');
      localStorage.removeItem('waygo_user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Раніше тут був жорстко заданий 'http://localhost:7080/api', тоді
// як бекенд у Development слухає HTTPS саме на 7080, а HTTP — на
// 5080 (див. api_src/Properties/launchSettings.json). Запит по
// "http://localhost:7080" на порт, що очікує TLS handshake, або
// повністю провалювався, або (залежно від браузера/проксі) міг
// зависати — і сторінка ще до першого реального 401 виглядала так,
// ніби "не пускає далі логіну". Тепер беремо ту саму базову адресу,
// що й публічний клієнт (api/client.ts), з підтримкою VITE_API_URL.
const API_URL = `${import.meta.env.VITE_API_URL || 'https://localhost:7080'}/api`;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Токен береться зі спільного auth-стору (той самий, що й на
// публічній частині сайту) — див. admin/store/authStore.ts.
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Якщо 401 — токен протух або немає прав, виходимо і повертаємо
// на форму логіну адмінки.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

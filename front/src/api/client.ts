import axios from "axios";
import { useAuthStore } from "../store/authStore";

// API_ORIGIN береться з VITE_API_URL (див. .env / .env.example),
// з fallback на дефолтний dev-порт бекенду (https://localhost:7080,
// див. api_src/Properties/launchSettings.json).
export const API_ORIGIN =
  import.meta.env.VITE_API_URL || "https://localhost:7080";

const apiClient = axios.create({
  baseURL: `${API_ORIGIN}/api`,
});

export const getMediaUrl = (path?: string | null) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_ORIGIN}${path}`;
};

apiClient.interceptors.request.use((config) => {
  // Токен читаємо напряму з zustand-стору (єдине джерело правди),
  // а не з окремого ключа localStorage: раніше AuthStore і client.ts
  // писали/читали токен у двох різних місцях, що легко розходилось.
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Для FormData Content-Type не задаємо:
  // браузер сам додасть multipart/form-data з boundary.
  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();

      // Публічна частина сайту не має власної сторінки логіну —
      // вхід для звичайних юзерів відбувається через AuthModal
      // поверх поточної сторінки. Редіректимо на /login лише якщо
      // користувач уже на /admin: там 401 справді означає "потрібен
      // логін адміністратора". Для публічних сторінок просто
      // скидаємо сесію й даємо AuthModal обробити повторний вхід.
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
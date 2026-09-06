import axios from "axios";

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
  const token = localStorage.getItem("waygo_token");

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
      localStorage.removeItem("waygo_token");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

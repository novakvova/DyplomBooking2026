import axios from "axios";

export const API_ORIGIN =
  import.meta.env.VITE_API_URL || "https://localhost:7080";

const apiClient = axios.create({
  baseURL: `${API_ORIGIN}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getMediaUrl = (path?: string | null) => {
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path;

  return `${API_ORIGIN}${path}`;
};

// Додаємо JWT до кожного запиту
apiClient.interceptors.request.use((config) => {

  const token = localStorage.getItem("waygo_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// Обробка помилок
apiClient.interceptors.response.use(

  (response) => response,

  (error) => {

    if (error.response?.status === 401) {

      console.warn(
        "401 Unauthorized:",
        error.config?.url
      );

      // НЕ робимо window.location.href = "/"
      // Нехай конкретна сторінка сама вирішує,
      // що показувати користувачу.
    }

    return Promise.reject(error);
  }
);


export default apiClient;
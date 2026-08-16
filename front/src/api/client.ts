import axios from "axios";

const API_URL = "http://localhost:5080/api";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


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
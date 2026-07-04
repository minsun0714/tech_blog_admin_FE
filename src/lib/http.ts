import axios from "axios";

export const API_KEY_SESSION_STORAGE_KEY = "apiKey";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  const apiKey = sessionStorage.getItem(API_KEY_SESSION_STORAGE_KEY);

  if (apiKey) {
    config.headers["X-API-KEY"] = apiKey;
  } else {
    delete config.headers["X-API-KEY"];
  }

  return config;
});

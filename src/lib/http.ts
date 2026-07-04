import axios from "axios";
import { getApiKeyFromSessionStorage } from "@/lib/api-key";

export const http = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  const requestMethod = config.method?.toLowerCase();
  const headers = axios.AxiosHeaders.from(config.headers);

  if (requestMethod !== "get") {
    const apiKey = getApiKeyFromSessionStorage().trim();

    if (apiKey) {
      headers.set("X-API-KEY", apiKey);
    } else {
      headers.delete("X-API-KEY");
    }
  }

  config.headers = headers;
  return config;
});

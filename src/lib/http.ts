import axios from "axios";

export const http = axios.create({
  headers: {
    "Content-Type": "application/json",
    "X-API-KEY": import.meta.env.VITE_API_KEY,
  },
});

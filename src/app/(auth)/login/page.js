// src/lib/apiClient.js
import axios from "axios";

const baseURL = (process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api")
  .replace(/\/+$/, "");

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((cfg) => {
  if (typeof window !== "undefined") {
    const t = localStorage.getItem("access_token");
    if (t) cfg.headers.Authorization = `Bearer ${t}`;
  }
  return cfg;
});

export default api;

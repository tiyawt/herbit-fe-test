import axios from "axios";

const baseURL = (process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api").replace(/\/+$/, "");

const api = axios.create({
  baseURL,
  withCredentials: true, // biar cookie ikut
  headers: { "Content-Type": "application/json" },
});

export default api;

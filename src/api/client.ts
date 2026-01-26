import axios from "axios";

export const api = axios.create({
  baseURL: "https://attendme-backend.runasp.net",
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");

  if (token && !config.headers?.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

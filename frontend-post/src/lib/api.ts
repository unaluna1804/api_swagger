import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // Tetap di root
});

api.interceptors.request.use((config) => {
  // Ambil token dinamis hasil login
  const token = localStorage.getItem("token"); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
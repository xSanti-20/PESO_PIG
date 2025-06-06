import axios from "axios";
import { toast } from "react-toastify";
import Router from "next/router"; // para redirección en Next.js

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5059/',
  headers: {
    'accept': '/',
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Interceptor para manejar respuestas no autorizadas
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      toast.error("Sesión expirada. Por favor inicia sesión nuevamente.");

      // Redirigir después de 3 segundos
      setTimeout(() => {
        Router.push("/user/login");
      }, 3000);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
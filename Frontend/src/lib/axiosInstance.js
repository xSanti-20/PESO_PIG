import axios from "axios";
import { toast } from "react-toastify";
import Router from "next/router"; // para redirección en Next.js

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5059/',
  headers: {
     'accept': '*/*',
     'Content-Type': 'application/json'
  },
  withCredentials: true
});

// // Interceptor para respuestas
// axiosInstance.interceptors.response.use(
//   response => response, // dejar pasar respuestas exitosas normalmente
//   error => {
//     if (error.response) {
//       // if (error.response.status === 401) {
//       //   // Aquí puedes mostrar un mensaje bonito y/o redirigir a login
//       //   toast.error("No autorizado. Por favor inicia sesión nuevamente.");

//       //   // Limpiar localStorage si es necesario
//       //   localStorage.removeItem("token");
//       //   localStorage.removeItem("username");
//       //   localStorage.removeItem("email");

//       //   // Redirigir a login (cambia la ruta si es necesario)
//       //   Router.push("/user/login");
//       // }
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;

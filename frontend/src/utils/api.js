import axios from "axios";
import FrontendRoutes from "../shared/constants/frontendRoutes";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isLoginRequest =
        error.config.url.includes("/auth/login") ||
        error.config.url.includes("/auth/google") ||
        error.config.url.includes("/auth/signup");
      const isLoginPage =
        window.location.pathname === FrontendRoutes.LOGIN ||
        window.location.pathname === FrontendRoutes.SIGNUP;

      if (!isLoginRequest && !isLoginPage) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = FrontendRoutes.LOGIN;
      }
    }
    return Promise.reject(error);
  },
);

export default api;

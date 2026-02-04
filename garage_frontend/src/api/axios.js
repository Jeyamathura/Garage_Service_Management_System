import axios from "axios";
import { getAccessToken, clearTokens } from "../utils/token";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Skip redirect for login/token endpoint - let the login page handle errors
    const isLoginRequest = error.config?.url?.includes('/token/');

    if (error.response && error.response.status === 401 && !isLoginRequest) {
      clearTokens();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;

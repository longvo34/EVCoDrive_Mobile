import axios from "axios";
import Constants from "expo-constants";
import {
  getAccessToken,
  getRefreshToken,
  saveTokens
} from "../utils/authStorage";

const API_URL = Constants.expoConfig.extra.API_URL;

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

/* ================= REQUEST INTERCEPTOR ================= */
const NO_AUTH_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/check-email",
  "/auth/send-otp",
  "/auth/verify-email",
  "/auth/resend-otp",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/refresh-token",
];

api.interceptors.request.use(
  async (config) => {
    const isNoAuth = NO_AUTH_ENDPOINTS.some((url) => config.url?.includes(url));

    if (!isNoAuth) {
      const token = await getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    console.log("❌ INTERCEPTOR ERROR URL:", error.config?.url);
    console.log("❌ STATUS:", error.response?.status);
    console.log("❌ DATA:", error.response?.data);
    const originalRequest = error.config;

    if (originalRequest.url?.includes("/auth/refresh-token")) {
      return Promise.reject(error);
    }

  const status = error.response?.status;
const errorCode = error.response?.data?.errorCode;

const authErrorCodes = [
  "TOKEN_EXPIRED",
  "INVALID_TOKEN",
  "USER_2001", 
];

const isTokenExpired =
  (status === 401 || authErrorCodes.includes(errorCode)) &&
  !originalRequest._retry;

  console.log("👉 errorCode:", errorCode);
console.log("👉 status:", status);
console.log("👉 should refresh:", isTokenExpired);

if (isTokenExpired) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(() => Promise.reject(error)); 
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const currentAccessToken = await getAccessToken();
        const currentRefreshToken = await getRefreshToken();

        if (!currentAccessToken || !currentRefreshToken) {
          return Promise.reject(error);
        }

        const refreshResponse = await axios.post(`${API_URL}/auth/refresh-token`, {
          token: currentAccessToken,
          refreshToken: currentRefreshToken,
        });

        const { token: newAccessToken, refreshToken: newRefreshToken } =
          refreshResponse.data?.data || {};

        if (!newAccessToken) {
          throw new Error("Không nhận được token mới từ server");
        }

        await saveTokens({
          token: newAccessToken,
          refreshToken: newRefreshToken || currentRefreshToken,
        });

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
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
    const originalRequest = error.config;

    // Bỏ qua endpoint refresh để tránh loop vô hạn
    if (originalRequest.url?.includes("/auth/refresh-token")) {
      return Promise.reject(error);
    }

    // Chỉ xử lý lỗi 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Đang refresh → chờ token mới từ queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(() => Promise.reject(error)); // nếu queue fail thì reject lỗi gốc
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const currentAccessToken = await getAccessToken();
        const currentRefreshToken = await getRefreshToken();

        if (!currentAccessToken || !currentRefreshToken) {
          // Không có token → không refresh được, reject để màn hình xử lý
          return Promise.reject(error);
        }

        // Refresh token bằng axios thuần (tránh dùng api instance để không trigger interceptor)
        const refreshResponse = await axios.post(`${API_URL}/auth/refresh-token`, {
          token: currentAccessToken,
          refreshToken: currentRefreshToken,
        });

        const { token: newAccessToken, refreshToken: newRefreshToken } =
          refreshResponse.data?.data || {};

        if (!newAccessToken) {
          throw new Error("Không nhận được token mới từ server");
        }

        // Lưu token mới
        await saveTokens({
          token: newAccessToken,
          refreshToken: newRefreshToken || currentRefreshToken,
        });

        // Hoàn tất queue
        processQueue(null, newAccessToken);

        // Gắn token mới và retry request gốc
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh thất bại → KHÔNG clear token, KHÔNG logout
        processQueue(refreshError, null);

        // Trả lỗi gốc (401) để màn hình có thể retry thủ công nếu cần
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    // Các lỗi khác (500, network, 400, v.v.) reject bình thường
    return Promise.reject(error);
  }
);

export default api;
import { AxiosInstance, AxiosError } from "axios";
import { errorMessages } from "./errorMessages";
import { getCsrfToken, setCsrfToken, clearCsrfToken } from "./csrfUtils";
import { ExtendedAxiosRequestConfig, ApiError, ErrorResponseData } from "./types";
import { rootStore } from "@store/index";

/**
 * Queue for failed requests during token refresh.
 */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
  config: ExtendedAxiosRequestConfig;
}> = [];

/**
 * Processes the queue of failed requests after token refresh.
 */
const processQueue = (error: Error | null) => {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else {
      request.resolve();
    }
  });
  failedQueue = [];
};


const MAX_QUEUE_SIZE = 10;

/**
 * Sets up Axios interceptors for CSRF and error handling.
 */
export function setupInterceptors(apiClient: AxiosInstance) {
  apiClient.interceptors.request.use(
    (config) => {
      const method = config.method?.toUpperCase();
      if (
        ["POST", "PUT", "DELETE", "PATCH"].includes(method || "") &&
        getCsrfToken()
      ) {
        config.headers = config.headers || {};
        config.headers["x-csrf-token"] = getCsrfToken();
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as ExtendedAxiosRequestConfig;

      // Handle 401 and try to refresh token
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url?.includes("refresh-token")
      ) {
        originalRequest._retry = true;

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            if (failedQueue.length < MAX_QUEUE_SIZE) {
              failedQueue.push({ resolve, reject, config: originalRequest });
            } else {
              reject(new Error("Too many pending requests during token refresh"));
            }
          });
        }

        isRefreshing = true;

        try {
          const response = await apiClient.post(
            "/refresh-token",
            {},
            { withCredentials: true }
          );
          if (response.data?.csrfToken) {
            setCsrfToken(response.data.csrfToken);
          }
          processQueue(null);
          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError as Error);
          clearCsrfToken();
          rootStore.authStore.clearAuth();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Standardize error
      const data = error.response?.data as ErrorResponseData | undefined;
      const apiError: ApiError = {
        status: error.response?.status || 500,
        message:
          data?.message ||
          errorMessages[error.response?.status as number] ||
          "An unexpected error occurred",
        details: error.response?.data,
      };

      return Promise.reject(apiError);
    }
  );
}
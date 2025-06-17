import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";

/**
 * Axios instance for making API requests.
 *
 * This instance is pre-configured with a base URL, credentials, and default headers.
 * It also includes request and response interceptors for custom logic.
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  withCredentials: true, // Include cookies with requests
  headers: {
    "Content-Type": "application/json",
  },
});

export interface ApiError {
  status: number;
  message: string;
  details?: unknown;
}

// Variable for storing CSRF token
let csrfToken: string | null = null;
// Flag to prevent multiple concurrent refresh token requests
let isRefreshing = false;
// Queue of failed requests to retry after token refresh
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
  config: InternalAxiosRequestConfig;
}> = [];

/**
 * Process the queue of failed requests by retrying them with the new token
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

/**
 * Sets the CSRF token for future requests
 *
 * @param token - CSRF token string
 */
export const setCsrfToken = (token: string) => {
  csrfToken = token;
  localStorage.setItem("csrf-token", token);
};

/**
 * Retrieves the current CSRF token
 *
 * @returns The current CSRF token or null if not set
 */
export const getCsrfToken = (): string | null => {
  return csrfToken || localStorage.getItem("csrf-token");
};

/**
 * Clears the stored CSRF token
 */
export const clearCsrfToken = (): void => {
  csrfToken = null;
  localStorage.removeItem("csrf-token");
};

/**
 * Request interceptor for the Axios instance.
 *
 * This interceptor adds CSRF token to non-GET requests for protection against CSRF attacks
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add CSRF token to non-GET requests
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
  (error: unknown) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for the Axios instance.
 *
 * Handles token refresh when a 401 error is received due to expired access token
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and not a refresh token request itself and not already retrying
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("refresh-token")
    ) {
      // Set retry flag to prevent infinite loop
      originalRequest._retry = true;

      // If already refreshing, add to queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      isRefreshing = true;

      try {
        // Try to refresh the token
        const response = await axios.post(
          `${
            import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
          }/refresh-token`,
          {},
          {
            withCredentials: true,
            headers: { "x-csrf-token": csrfToken },
            timeout: 10000,
          }
        );

        // If we get a new CSRF token, save it
        if (response.data?.csrfToken) {
          setCsrfToken(response.data.csrfToken);
        }

        // Process queue with successful refresh
        processQueue(null);

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Process queue with error
        processQueue(refreshError as Error);

        // Clear tokens on refresh failure
        clearCsrfToken();

        // Redirect to login or dispatch logout event
        window.dispatchEvent(new CustomEvent("auth:expired"));

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

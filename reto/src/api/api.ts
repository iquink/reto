import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

/**
 * Axios instance for making API requests.
 *
 * This instance is pre-configured with a base URL, credentials, and default headers.
 * It also includes request and response interceptors for custom logic.
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000", // Default to localhost if not set
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

const errorMessages: Record<number, string> = {
  400: "Bad request. Please check your input.",
  401: "Unauthorized. Please log in again.",
  403: "Forbidden. You don't have permission to perform this action.",
  404: "Resource not found.",
  500: "Server error. Please try again later.",
};
// CSRF token management
// This token is used to protect against CSRF attacks in unsafe HTTP methods
let csrfToken: string | null = null;

export const setCsrfToken = (token: string) => {
  csrfToken = token;
  localStorage.setItem('csrfToken', token);
};

export const clearCsrfToken = () => {
  csrfToken = null;
  localStorage.removeItem('csrfToken');
};

export const getCsrfToken = (): string | null => {
  return csrfToken || localStorage.getItem('csrfToken');
};

/**
 * Request interceptor for the Axios instance.
 *
 * This interceptor allows you to modify the request configuration before it is sent.
 * For example, you can add authorization tokens or other custom logic here.
 *
 * @param config - The Axios request configuration.
 * @returns The modified Axios request configuration.
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add CSRF token to unsafe requests (POST, PUT, DELETE, PATCH)
    const method = config.method?.toUpperCase();
    if (
      ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method || '') &&
      getCsrfToken()
    ) {
      config.headers = config.headers || {};
      config.headers['x-csrf-token'] = getCsrfToken();
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
 * This interceptor allows you to handle responses globally.
 * For example, you can redirect to the login page on a 401 Unauthorized error.
 *
 * @param response - The Axios response object.
 * @returns The Axios response object.
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: unknown) => {
    // Type guard for AxiosError
    const err = error as {
      response?: { status?: number; data?: unknown };
      config?: { url?: string };
    };
    const status = err.response?.status || 0;
    let message = errorMessages[status] || "An unexpected error occurred.";

    if (status === 404 && err.config?.url?.includes("/login")) {
      message = (err.response?.data as string) || "User not found.";
    }

    const apiError: ApiError = {
      status,
      message,
      details: err.response?.data,
    };

    if (apiError.status === 401 && window.location.pathname !== "/") {
      window.location.href = "/";
    }
    return Promise.reject(apiError);
  }
);

export default apiClient;

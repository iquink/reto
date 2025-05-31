import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
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
  details?: any;
}

const errorMessages: Record<number, string> = {
  400: "Bad request. Please check your input.",
  401: "Unauthorized. Please log in again.",
  403: "Forbidden. You don't have permission to perform this action.",
  404: "Resource not found.",
  500: "Server error. Please try again later.",
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
    // You can add authorization tokens or other custom logic here
    return config;
  },
  (error: AxiosError) => {
    // Handle request errors
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
  (error: AxiosError) => {
    const status = error.response?.status || 0;
    let message = errorMessages[status] || "An unexpected error occurred.";

    if (status === 404 && error.config?.url?.includes("/login")) {
      message = (error.response?.data as string) || "User not found.";
    }

    const apiError: ApiError = {
      status,
      message,
      details: error.response?.data,
    };

    // Handle errors globally, e.g., redirect to login on 401
    if (apiError.status === 401 && window.location.pathname !== "/") {
      window.location.href = "/";
    }
    return Promise.reject(apiError);
  }
);

export default apiClient;

import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";

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
    // Handle errors globally, e.g., redirect to login on 401
    if (error.response && error.response.status === 401) {
      // Prevent redirect loop by checking the current page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

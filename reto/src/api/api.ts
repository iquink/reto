import axios from "axios";
import { setupInterceptors } from "./apiHelpers";

/**
 * Axios instance for making API requests.
 *
 * This instance is pre-configured with a base URL, credentials, and default headers.
 * It also includes request and response interceptors for custom logic.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

setupInterceptors(apiClient);

export default apiClient;
export * from "./csrfUtils";
export * from "./types";

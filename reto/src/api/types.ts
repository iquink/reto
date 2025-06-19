import { InternalAxiosRequestConfig } from "axios";

/**
 * Interface for standardized API errors.
 */
export interface ApiError {
  status: number;
  message: string;
  details?: unknown;
}

/**
 * Extended Axios request config to support custom retry logic.
 */
export interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

/**
 * Type for error response data from the API.
 * Can include a message and additional properties.
 */
export type ErrorResponseData = { message?: string; [key: string]: unknown };
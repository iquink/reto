/**
 * Predefined error messages for common HTTP status codes.
 */
export const errorMessages: Record<number, string> = {
  400: "Bad request. Please check your input.",
  401: "Unauthorized. Please log in again.",
  403: "Forbidden. You don't have permission to perform this action.",
  404: "Resource not found.",
  500: "Server error. Please try again later.",
};
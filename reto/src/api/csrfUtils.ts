/**
 * Stores the CSRF token in memory and localStorage.
 */
let csrfToken: string | null = null;

export const setCsrfToken = (token: string) => {
  csrfToken = token;
  localStorage.setItem("csrf-token", token);
};

export const getCsrfToken = (): string | null => {
  return csrfToken || localStorage.getItem("csrf-token");
};

export const clearCsrfToken = (): void => {
  csrfToken = null;
  localStorage.removeItem("csrf-token");
};
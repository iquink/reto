// CSRF token is kept strictly in-memory.
// Storing it in localStorage exposes it to any JavaScript on the page (XSS),
// defeating its purpose. An in-memory variable is not accessible from other
// origins or persisted tabs, so it is the safe location for this value.
let csrfToken: string | null = null;

export const setCsrfToken = (token: string) => {
  csrfToken = token;
};

export const getCsrfToken = (): string | null => {
  return csrfToken;
};

export const clearCsrfToken = (): void => {
  csrfToken = null;
};

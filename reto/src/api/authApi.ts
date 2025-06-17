import apiClient, { clearCsrfToken, setCsrfToken } from "./api";

/**
 * Authentication API for handling user-related operations.
 *
 * This module provides methods for user login, registration, logout, fetching the current user, and checking authentication status.
 */
const authApi = {
  /**
   * Logs in a user with the provided email and password.
   *
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns A promise that resolves to the response data, typically containing user information and authentication details.
   * @throws An error if the login request fails.
   */
  async login(email: string, password: string) {
    const response = await apiClient.post("/login", { email, password });
    // Save the CSRF token to local storage for future requests
    if (response.data?.csrfToken) {
      setCsrfToken(response.data.csrfToken);
    }

    return response.data;
  },

  /**
   * Registers a new user with the provided name, email, and password.
   *
   * @param username - The user's name.
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns A promise that resolves to the response data, typically containing the newly created user's information.
   * @throws An error if the registration request fails.
   */
  async register(username: string, email: string, password: string) {
    const response = await apiClient.post("/register", {
      username,
      email,
      password,
    });
    return response.data;
  },

  /**
   * Logs out the currently authenticated user.
   *
   * @returns A promise that resolves to the response data, typically confirming the logout operation.
   * @throws An error if the logout request fails.
   */
  async logout() {
    const response = await apiClient.post("/logout");
    clearCsrfToken();
    return response.data;
  },

  /**
   * Checks if the user is authenticated by verifying the token in the HTTP-only cookie.
   *
   * @returns A promise that resolves to the response data, typically confirming the user's authentication status.
   * @throws An error if the authentication check fails or the user is not authenticated.
   */
  async checkAuth() {
    const response = await apiClient.get("/check-auth");
    return response.data;
  },

  /**
   * Fetches the current user's information by ID.
   *
   * @param id - The user's ID.
   * @returns A promise that resolves to the response data, typically containing the user's details.
   * @throws An error if the request to fetch the user fails.
   */
  async getCurrentUser() {
    const response = await apiClient.get("/get-user");
    return response.data;
  },
};

export default authApi;

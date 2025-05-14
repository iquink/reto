import apiClient from "./api";

/**
 * Authentication API for handling user-related operations.
 *
 * This module provides methods for user login, registration, logout, and fetching the current user.
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
    return response.data;
  },

  /**
   * Registers a new user with the provided name, email, and password.
   *
   * @param name - The user's name.
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns A promise that resolves to the response data, typically containing the newly created user's information.
   * @throws An error if the registration request fails.
   */
  async register(name: string, email: string, password: string) {
    const response = await apiClient.post("/register", { name, email, password });
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
    return response.data;
  },

  /**
   * Fetches the currently authenticated user's information.
   *
   * @returns A promise that resolves to the response data, typically containing the user's details.
   * @throws An error if the request to fetch the current user fails.
   */
  async getCurrentUser() {
    const response = await apiClient.get("/me");
    return response.data;
  },
};

export default authApi;
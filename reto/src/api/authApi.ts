import apiClient from "./api";

const authApi = {
  async login(email: string, password: string) {
    const response = await apiClient.post("/login", { email, password });
    return response.data;
  },

  async register(name: string, email: string, password: string) {
    const response = await apiClient.post("/register", { name, email, password });
    return response.data;
  },

  async logout() {
    const response = await apiClient.post("/logout");
    return response.data;
  },

  async getCurrentUser() {
    const response = await apiClient.get("/me");
    return response.data;
  },
};

export default authApi;
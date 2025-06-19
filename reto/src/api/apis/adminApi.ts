import apiClient from "../api";

const adminApi = {
  async getUsers() {
    const response = await apiClient.get("/users", {
      withCredentials: true,
    });
    return response.data;
  },
};

export default adminApi;

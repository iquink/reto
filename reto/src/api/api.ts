import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000", // Default to localhost if not set
  withCredentials: true, // Include cookies with requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // You can add authorization tokens or other custom logic here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally, e.g., redirect to login on 401
    if (error.response && error.response.status === 401) {
      // Redirect to login or handle unauthorized access
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;

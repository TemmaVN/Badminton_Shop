import axios from "axios";

const API_BASE_URL = "/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = localStorage.getItem("token");
    if (!error.response) {
      return Promise.reject(error);
    }

    if (token && error.response.status === 401) {
      if (window.location.pathname !== "/") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  },
);

// Auth API
export const authApi = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (data) => api.post("/auth/register", data),
};

export const userApi = {
  changePassword: ({ oldPassword, newPassword }) =>
    api.put("/user/change-password", { oldPassword, newPassword }),
  UpdateProfile: ({
    fullName,
    dateOfBirth,
    phoneNumber,
    city,
    district,
    detailedAddress,
  }) =>
    api.put("/User/profile", {
      fullName,
      dateOfBirth,
      phoneNumber,
      city,
      district,
      detailedAddress,
    }),
  get_info: () => api.get("/User/user-info"),
};

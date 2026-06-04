// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api', // thay bằng URL backend của bạn
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: tự động gắn token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: xử lý lỗi 401 (hết hạn token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ========== AUTH API ==========
export const authApi = {
  login: (email, password) => api.post('/Auth/login', { email, password }),
  register: (data) => api.post('/Auth/register', data), // { email, password, fullName?, phoneNumber? }
};

// ========== USER API ==========
export const userApi = {
  getInfo: () => api.get('/User/user-info'),
  updateProfile: (data) => api.put('/User/profile', data),
  changePassword: (oldPassword, newPassword) => api.put('/User/change-password', { oldPassword, newPassword }),
};

// ========== ORDER API ==========
export const orderApi = {
  getMyOrders: () => api.get('/Order/my-orders'),
  cancel: (orderId) => api.put(`/Order/cancel/${orderId}`),
  create: (data) => api.post('/Order/create', data),
};
//Cart Api
export const cartApi = {
  getMyCart: () => api.get('/Cart/my-cart'),
  addToCart: (detailId, quantity) => api.post('/Cart/add-to-cart', { detailId, quantity }),
  updateCartItem: (cartItemId, quantity) => api.put(`/Cart/update-cart-item/${cartItemId}?quantity=${quantity}`),
  deleteCartItem: (cartItemId) => api.delete(`/Cart/delete-cart-item/${cartItemId}`),
};
export default api;
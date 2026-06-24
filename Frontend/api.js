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

// Dùng fetch thay axios cho upload file — axios instance có default header
// 'Content-Type: application/json' mà axios 1.x không override được khi gửi FormData,
// dẫn đến 415. fetch() để browser tự set 'multipart/form-data; boundary=...'
const uploadFormData = async (url, formData, method = "POST") => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE_URL}${url}`, {
    method,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.message ?? data?.Message ?? res.statusText);
    err.response = { status: res.status, data };
    throw err;
  }
  return { data };
};

// Auth API
export const authApi = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (data) => api.post("/auth/register", data),
};

// User API
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

// Product API
export const productApi = {
  getHomeProducts: () => api.get("/Product/home"),

  search: (params = {}) => api.get("/Product/searchAsync", { params }),

  getProductsBySlug: (categorySlug, params = {}) =>
    api.get(`/Product/product_of_category/${categorySlug}`, {
      params: {
        page: params.page || 1,
        pagesize: params.pagesize || 9,
        keyword: params.keyword || undefined,
        minPrice: params.minPrice || undefined,
        maxPrice: params.maxPrice || undefined,
      },
    }),

  getProductDetaildBySlug: (slug) => api.get(`/Product/${slug}`),

  getForAdmin: ({ pageSize, ...rest } = {}) =>
    api.get("/Product/product-management", {
      params: { ...rest, pagesize: pageSize },
    }),

  getTopProducts: (params = {}) =>
    api.get("/admin/statistic/products/top", { params }),

  create: (data) => api.post("/Product", data),

  update: (id, data) => api.put(`/Product/${id}`, data),

  delete: (id) => api.delete(`/Product/${id}`),

  // ── Quản lý biến thể (variants) ──────────────────────────────────────────
  getVariants: (productId, params = {}) =>
    api.get(`/Product/${productId}/management-details`, { params }),

  addVariant: (productId, data) =>
    api.post(`/Product/${productId}/management-details`, data),

  updateVariant: (detailId, data) =>
    api.put(`/Product/management-details/${detailId}`, data),

  deleteVariant: (detailId) =>
    api.delete(`/Product/management-details/${detailId}`),

  importVariantsExcel: (productId, formData) =>
    uploadFormData(
      `/Product/${productId}/management-details/import-excel`,
      formData,
    ),

  exportVariantsExcel: (productId) =>
    api.get(`/Product/${productId}/management-details/export-excel`, {
      responseType: "blob",
    }),

  // ── Quản lý serial ───────────────────────────────────────────────────────
  getSerials: (detailId, params = {}) =>
    api.get(`/Product/management-details/${detailId}/serials`, { params }),

  addSerial: (detailId, data) =>
    api.post(`/Product/management-details/${detailId}/serials`, data),

  // ── Quản lý ảnh sản phẩm ─────────────────────────────────────────────────
  getImages: (productId) => api.get(`/Product/${productId}/management-images`),

  // Backend_ThucTap: tải file ảnh lên trước (multipart) -> nhận { imageUrl }
  uploadImage: (file) => {
    const fd = new FormData();
    fd.append("file", file);
    return uploadFormData(`/Product/upload-image`, fd);
  },

  // Backend_ThucTap: gắn ảnh vào sản phẩm bằng JSON { imageUrl, isMain }
  addImage: (productId, data) =>
    api.post(`/Product/${productId}/management-images`, data),

  setMainImage: (productId, imageId) =>
    api.put(`/Product/${productId}/management-images/set-main/${imageId}`),

  reorderImages: (productId, data) =>
    api.put(`/Product/management-images/reOrder`, data, {
      params: { productId },
    }),

  deleteImage: (imageId) => api.delete(`/Product/management-images/${imageId}`),

  importFromFile: (formData) =>
    uploadFormData(`/Product/admin/import-excel`, formData),

  exportFromFile: () =>
    api.get(`/Product/admin/export-excel`, { responseType: "blob" }),
};

export const metaDataApi = {
  get: () => api.get("/MetaData"),
};

// Category API
export const categoryApi = {
  getAll: () => api.get("/Category"),
  create: (categoryName) =>
    api.post("/Category", `"${categoryName}"`, {
      headers: { "Content-Type": "application/json" },
    }),
  update: (id, newName) =>
    api.put(`/Category/${id}`, `"${newName}"`, {
      headers: { "Content-Type": "application/json" },
    }),
  delete: (id) => api.delete(`/Category/${id}`),
};

export const brandApi = {
  getAll: () => api.get("/Brand"),
  create: (brandName) =>
    api.post("/Brand", JSON.stringify(brandName), {
      headers: { "Content-Type": "application/json" },
    }),

  update: (id, newBrandName) =>
    api.put(`/Brand/${id}`, JSON.stringify(newBrandName), {
      headers: { "Content-Type": "application/json" },
    }),

  delete: (id) => api.delete(`/Brand/${id}`),
};

export const cartApi = {
  getMyCart: () => api.get("/Cart/my-cart"),
  addToCart: (detailId, quantity) =>
    api.post("/Cart/add-to-cart", { detailId, quantity }),
  updateCartItem: (cartItemId, quantity) =>
    api.put(`/Cart/update-cart-item/${cartItemId}`, null, {
      params: { quantity },
    }),
  deleteCartItem: (cartItemId) =>
    api.delete(`/Cart/delete-cart-item/${cartItemId}`),
};

// Order API
export const orderApi = {
  create: (data) => api.post("/Order", data),
  getMyOrders: () => api.get("/Order/my-orders"),
  getAll: (page = 1, pageSize = 10) =>
    api.get("/Order/all-orders", { params: { page, pageSize } }),
  getByStatus: (statusId, page = 1, pageSize = 10) =>
    api.get(`/Order/all-orders-by-status/${statusId}`, {
      params: { page, pageSize },
    }),
  getAdminDetail: (orderId) => api.get(`/Order/admin/${orderId}`),
  // Backend_ThucTap: body là số nguyên thô (newOrderStatusId)
  updateStatus: (orderId, newOrderStatusId) =>
    api.put(`/Order/updateStatus/${orderId}`, newOrderStatusId, {
      headers: { "Content-Type": "application/json" },
    }),
  cancelByAdmin: (orderId, reason) =>
    api.put(`/Order/admin/${orderId}/cancel`, { reason }),
  cancelMyOrder: (orderId) => api.put(`/Order/cancel-my-order/${orderId}`),
  adminSearch: (params = {}) => api.get("/Order/admin-search", { params }),
  preview: (data) => api.post("/Order/preview", data),
};

// Voucher API
export const voucherApi = {
  // POST - trả về voucher áp dụng được cho giỏ hàng/checkout (cần đăng nhập)
  getAvailableVouchers: (data) => api.post("/Voucher/my-voucher", data ?? {}),
  // GET - tất cả voucher công khai
  getAllAvailable: () => api.get("/Voucher/all-available"),
  saveVoucher: (voucherId) => api.post(`/Voucher/save/${voucherId}`),
  adminCreate: (data) => api.post("/Voucher/admin/add", data),
  adminGetAll: (params = {}) => api.get("/Voucher/admin", { params }),
  adminSetActive: (voucherId, isActive) =>
    api.put(`/Voucher/admin/${voucherId}/active`, { isActive }),
};

// Statistic API (admin)
export const statisticApi = {
  getOverview: (params = {}) => api.get("/admin/statistic/overview", { params }),
  getRevenueByCategoy: (params = {}) =>
    api.get("/admin/statistic/revenue/category", { params }),
  getRevenueByBrand: (params = {}) =>
    api.get("/admin/statistic/revenue/brand", { params }),
  getRevenueByMonth: (params = {}) =>
    api.get("/admin/statistic/revenue/monthly", { params }),
  getRevenueCategoryByMonth: (params = {}) =>
    api.get("/admin/statistic/revenue/category-monthly", { params }),
  getFullReport: (params = {}) =>
    api.get("/admin/statistic/full-report", { params }),
  getOrderStatus: (params = {}) =>
    api.get("/admin/statistic/orders/status", { params }),
  getRevenueByPaymentMethod: (params = {}) =>
    api.get("/admin/statistic/revenue/payment-method", { params }),
  getVoucherEffectiveness: (params = {}) =>
    api.get("/admin/statistic/vouchers/effectiveness", { params }),
  getTopCustomers: (params = {}) =>
    api.get("/admin/statistic/customers/top", { params }),
};

// Review API
export const reviewApi = {
  // Public
  getByProduct: (productId, page = 1, pageSize = 10) =>
    api.get(`/Review/product/${productId}`, { params: { page, pageSize } }),

  // Customer (cần đăng nhập)
  getMyReviews: (page = 1, pageSize = 10) =>
    api.get("/Review/my-reviews", { params: { page, pageSize } }),
  getMyReviewableItems: (page = 1, pageSize = 10) =>
    api.get("/Review/my-reviewable-items", { params: { page, pageSize } }),
  create: (data) => api.post("/Review", data),
  update: (reviewId, data) => api.put(`/Review/${reviewId}`, data),
  delete: (reviewId) => api.delete(`/Review/${reviewId}`),

  // Admin (cần Admin role)
  getForAdmin: (params = {}) => api.get("/Review/admin", { params }),
  setVisibility: (reviewId, isVisible) =>
    api.put(`/Review/admin/${reviewId}/visibility`, { isVisible }),
};

// Inventory API (admin)
export const inventoryApi = {
  getLowStock: (threshold = 5) =>
    api.get("/admin/inventory/low-stock", { params: { threshold } }),
  getSerialsByStatus: (status, page = 1, pageSize = 10) =>
    api.get("/admin/inventory/serials/by-status", {
      params: { status, page, pageSize },
    }),
  markDefective: (serialId) =>
    api.put(`/admin/inventory/serials/${serialId}/mark-defective`),
  markInStock: (serialId) =>
    api.put(`/admin/inventory/serials/${serialId}/mark-in-stock`),
};

// Return Request API
export const returnApi = {
  // Public
  getReasons: () => api.get("/Return/reasons"),

  // Customer (cần đăng nhập)
  getDeliveryProofs: (orderId) =>
    api.get(`/Return/orders/${orderId}/delivery-proofs`),
  createRequest: (data) => api.post("/Return/request", data),
  getMyRequests: (page = 1, pageSize = 10) =>
    api.get("/Return/my-requests", { params: { page, pageSize } }),
  getMyRequestDetail: (returnRequestId) =>
    api.get(`/Return/my-requests/${returnRequestId}`),

  // Admin — Backend_ThucTap nhận JSON { imageUrl, note }
  addDeliveryProof: (orderId, imageUrl, note) =>
    api.post(`/Return/admin/orders/${orderId}/delivery-proofs`, {
      imageUrl,
      note,
    }),
  adminGetAll: (params = {}) => api.get("/Return/admin/requests", { params }),
  adminGetDetail: (returnRequestId) =>
    api.get(`/Return/admin/requests/${returnRequestId}`),
  adminApprove: (returnRequestId, data) =>
    api.put(`/Return/admin/requests/${returnRequestId}/approve`, data),
  adminReject: (returnRequestId, data) =>
    api.put(`/Return/admin/requests/${returnRequestId}/reject`, data),
  adminMarkRefunded: (returnRequestId, data) =>
    api.put(`/Return/admin/requests/${returnRequestId}/mark-refunded`, data),
};

export default api;

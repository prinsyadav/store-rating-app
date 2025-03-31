const API_BASE_URL = "http://localhost:3000/api";

// Helper function to get the JWT token from localStorage
const getToken = () => localStorage.getItem("token");

// Generic API request function with authentication
const apiRequest = async (endpoint, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Add authentication token if available
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method: options.method || "GET",
    headers,
    ...(options.body && { body: JSON.stringify(options.body) }),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Authentication API
export const authApi = {
  login: (credentials) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: credentials,
    }),

  register: (userData) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: userData,
    }),

  getProfile: () => apiRequest("/auth/profile"),

  changePassword: (passwordData) =>
    apiRequest("/auth/change-password", {
      method: "POST",
      body: passwordData,
    }),
};

// User API
export const userApi = {
  getStores: (filters = {}) => {
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value) queryParams.append(key, value);
    }
    const queryString = queryParams.toString();
    return apiRequest(`/user/stores${queryString ? `?${queryString}` : ""}`);
  },

  getStoreById: (id) => apiRequest(`/user/stores/${id}`),

  submitRating: (ratingData) =>
    apiRequest("/user/ratings", {
      method: "POST",
      body: ratingData,
    }),
};

// Admin API
export const adminApi = {
  getDashboard: () => apiRequest("/admin/dashboard"),

  // User management
  getUsers: (filters = {}) => {
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value) queryParams.append(key, value);
    }
    const queryString = queryParams.toString();
    return apiRequest(`/admin/users${queryString ? `?${queryString}` : ""}`);
  },

  getUserById: (id) => apiRequest(`/admin/users/${id}`),

  createUser: (userData) =>
    apiRequest("/admin/users", {
      method: "POST",
      body: userData,
    }),

  updateUser: (id, userData) =>
    apiRequest(`/admin/users/${id}`, {
      method: "PUT",
      body: userData,
    }),

  deleteUser: (id) =>
    apiRequest(`/admin/users/${id}`, {
      method: "DELETE",
    }),

  // Store management
  getStores: (filters = {}) => {
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value) queryParams.append(key, value);
    }
    const queryString = queryParams.toString();
    return apiRequest(`/admin/stores${queryString ? `?${queryString}` : ""}`);
  },

  getStoreById: (id) => apiRequest(`/admin/stores/${id}`),

  createStore: (storeData) =>
    apiRequest("/admin/stores", {
      method: "POST",
      body: storeData,
    }),

  updateStore: (id, storeData) =>
    apiRequest(`/admin/stores/${id}`, {
      method: "PUT",
      body: storeData,
    }),

  deleteStore: (id) =>
    apiRequest(`/admin/stores/${id}`, {
      method: "DELETE",
    }),
};

// Store Owner API
export const storeApi = {
  getDashboard: () => apiRequest("/store-owner/dashboard"),

  getStoreDetails: () => apiRequest("/store-owner/store"),

  getStoreRatings: () => apiRequest("/store-owner/ratings"),
};

export default apiRequest;

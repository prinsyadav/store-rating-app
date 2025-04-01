const API_BASE_URL = "http://localhost:3000/api";
import axios from "axios";

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

  getUserById: async (userId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/users/${userId}`, // Remove the duplicate /api
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("API error in getUserById:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error fetching user details",
      };
    }
  },

  createUser: (userData) =>
    apiRequest("/admin/users", {
      method: "POST",
      body: userData,
    }),

  updateUser: async (userId, userData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/users/${userId}`, // Remove the duplicate /api
        userData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("API error in updateUser:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error updating user",
      };
    }
  },

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

  getStoreById: async (storeId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/stores/${storeId}`, // Remove the duplicate /api
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("API error in getStoreById:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Error fetching store details",
      };
    }
  },

  createStore: (storeData) =>
    apiRequest("/admin/stores", {
      method: "POST",
      body: storeData,
    }),

  updateStore: async (storeId, storeData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/stores/${storeId}`, // Remove the duplicate /api
        storeData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("API error in updateStore:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error updating store",
      };
    }
  },

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

// Export the apiRequest for use in other files if needed
export { apiRequest };

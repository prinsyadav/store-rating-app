import { authApi } from './api';

// Login user
export const login = async (email, password) => {
  try {
    const response = await authApi.login({ email, password });
    
    if (response.success) {
      // Save token and user data to localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data.user;
    } else {
      throw new Error(response.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Register new user
export const register = async (userData) => {
  try {
    const response = await authApi.register(userData);
    
    if (response.success) {
      // Save token and user data to localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data.user;
    } else {
      throw new Error(response.message || 'Registration failed');
    }
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Change user password
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await authApi.changePassword({ 
      currentPassword, 
      newPassword 
    });
    
    return response.success;
  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
};

// Get current user profile
export const getProfile = async () => {
  try {
    const response = await authApi.getProfile();
    
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to fetch profile');
    }
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

// Logout user
export const logout = () => {
  // Clear stored auth data
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const userString = localStorage.getItem('user');
  return userString ? JSON.parse(userString) : null;
};
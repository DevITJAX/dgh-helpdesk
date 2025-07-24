import apiClient from './apiClient';

export const authService = {
  login: async (username, password) => {
    try {
      const response = await apiClient.post('/auth/login', {
        username,
        password,
      });
      // Assuming backend returns { token, user }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear session from memory regardless of API call success
      window.__DGH_AUTH_SESSION__ = null;
    }
  },

  checkAuth: async () => {
    try {
      const response = await apiClient.get('/auth/check');
      return response.data;
    } catch (error) {
      throw new Error('Authentication check failed');
    }
  },

  getUserInfo: async () => {
    try {
      const response = await apiClient.get('/auth/user');
      return response.data;
    } catch (error) {
      throw new Error('Failed to get user info');
    }
  }
};

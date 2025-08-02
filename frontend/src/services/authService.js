import apiClient from './apiClient';

export const authService = {
  login: async (username, password) => {
    try {
      const response = await apiClient.post('/api/auth/login', {
        username,
        password,
      });
      // The backend returns user info and a session token
      const { token, ...user } = response.data;
      return { token, user };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear any stored data
      window.__DGH_AUTH_SESSION__ = null;
    }
  },

  checkAuth: async () => {
    try {
      const response = await apiClient.get('/api/auth/check');
      return response.data;
    } catch (error) {
      throw new Error('Authentication check failed');
    }
  },

  getUserInfo: async () => {
    try {
      const response = await apiClient.get('/api/auth/me');
      return response.data;
    } catch (error) {
      throw new Error('Failed to get user info');
    }
  },

  // Verify token using the stored session token
  verifyToken: async (token) => {
    try {
      const response = await apiClient.get('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Session verification failed');
    }
  }
};

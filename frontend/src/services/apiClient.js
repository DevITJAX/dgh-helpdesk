import axios from 'axios';
import { authService } from './authService';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080', // Backend URL from environment or fallback
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies for session-based auth
});

// Request interceptor for secure authentication
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Only try to get token if we have tokens stored (user is logged in)
      const tokenExpiry = authService.getTokenExpiry();
      if (tokenExpiry) {
        // Get token from auth service (with automatic refresh if needed)
        const token = await authService.getToken();
        
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
    } catch (error) {
      // Only log warning if we actually expected to have a token
      const tokenExpiry = authService.getTokenExpiry();
      if (tokenExpiry) {
        console.warn('Failed to get auth token for request:', error.message);
      }
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        await authService.refreshToken();
        
        // Retry the original request with new token
        const newToken = await authService.getToken();
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Token refresh failed, clear auth state
        authService.clearTokens();
        
        // Redirect to login if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        
        return Promise.reject(error);
      }
    }
    
    // Handle other errors
    if (error.response) {
      const { status } = error.response;
      
      // Handle server errors
      if (status >= 500) {
        console.error('Server error:', error.response.data);
      }
      
      // Handle forbidden access
      if (status === 403) {
        console.error('Access forbidden:', error.response.data);
      }
    } else if (error.request) {
      // Network error - backend is down or unreachable
      console.error('Network error - backend may be down');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

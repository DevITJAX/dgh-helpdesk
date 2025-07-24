import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080', // Backend URL
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for session-based authentication
apiClient.interceptors.request.use(
  (config) => {
    // For session-based auth, we rely on cookies.
    // The browser will handle sending the session cookie automatically.
    config.withCredentials = true; 
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      const { status } = error.response;
      
      // Handle authentication errors
      if (status === 401) {
        // Clear auth state and redirect to login
        window.__DGH_AUTH_SESSION__ = null;
        
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      
      // Handle other HTTP errors
      if (status >= 500) {
        console.error('Server error:', error.response.data);
      }
    } else if (error.request) {
      // Network error
      console.error('Network error - backend may be down');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

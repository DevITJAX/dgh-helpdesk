import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080', // Backend URL
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies for session-based auth
});

// Request interceptor for hybrid authentication
apiClient.interceptors.request.use(
  (config) => {
    // Try to get the session token from localStorage
    const token = localStorage.getItem('authToken');
    
    if (token && token !== 'session-based') {
      // Use the session token as Authorization header
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('API Request with token:', config.method?.toUpperCase(), config.url);
    } else {
      console.log('API Request without token:', config.method?.toUpperCase(), config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.config?.url, error.message);
    
    if (error.response) {
      const { status } = error.response;
      
      // Handle authentication errors
      if (status === 401) {
        // Clear auth state for session-based auth
        localStorage.removeItem('authToken');
        localStorage.removeItem('dgh_user');
        delete window.__DGH_JWT__;
        
        console.log('API: 401 Unauthorized - session expired');
      }
      
      // Handle other HTTP errors
      if (status >= 500) {
        console.error('Server error:', error.response.data);
      }
    } else if (error.request) {
      // Network error - backend is down or unreachable
      console.error('Network error - backend may be down');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

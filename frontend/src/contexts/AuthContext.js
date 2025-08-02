import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const location = useLocation();

  // Check for existing session on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        console.log('AuthContext: Checking for existing token:', token ? 'Found' : 'Not found');
        
        if (token && token.trim() !== '') {
          // Try to verify the stored token
          try {
            console.log('AuthContext: Attempting to verify stored token...');
            const user = await authService.verifyToken(token);
            console.log('AuthContext: Token verification successful:', user);
            
            dispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS,
              payload: { user, token }
            });
          } catch (verifyError) {
            console.log('AuthContext: Token verification failed, trying getUserInfo instead');
            try {
              const user = await authService.getUserInfo();
              console.log('AuthContext: getUserInfo successful:', user);
              dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: { user, token }
              });
            } catch (userInfoError) {
              console.log('AuthContext: getUserInfo also failed, clearing token');
              localStorage.removeItem('authToken');
              dispatch({ type: AUTH_ACTIONS.LOGOUT });
            }
          }
        } else {
          // No token found, ensure we're logged out
          console.log('AuthContext: No token found, staying logged out');
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } catch (error) {
        console.error('AuthContext: Error checking auth status:', error);
        localStorage.removeItem('authToken');
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      } finally {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    checkAuthStatus();
  }, [location]);

  // Login function
  const login = async (username, password) => {
    console.log('AuthContext: Starting login process');
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      console.log('AuthContext: Calling authService.login');
      const { user, token } = await authService.login(username, password);
      console.log('AuthContext: Login response:', { user, token });
      
      // Store the session token for API calls
      if (token) {
        localStorage.setItem('authToken', token);
        console.log('AuthContext: Session token stored for API calls');
      }
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token }
      });
      console.log('AuthContext: Login success dispatched');
      
      return { success: true };
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      
      let errMsg = 'Login failed';
      
      // Handle different types of errors
      if (error.message?.includes('Network Error') || error.code === 'ERR_NETWORK') {
        errMsg = 'Cannot connect to server. Please check if the backend is running.';
      } else if (error.response?.status === 401) {
        errMsg = 'Invalid username or password.';
      } else if (error.response?.status === 500) {
        errMsg = 'Server error. Please try again later.';
      } else if (error.response?.data?.message) {
        errMsg = error.response.data.message;
      } else if (error.message) {
        errMsg = error.message;
      }
      
      console.error('AuthContext: Final error message:', errMsg);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errMsg
      });
      
      return { success: false, error: errMsg };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      if (state.token) {
        await authService.logout(state.token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Update user function
  const updateUser = (updatedUser) => {
    dispatch({
      type: AUTH_ACTIONS.LOGIN_SUCCESS,
      payload: { user: updatedUser, token: state.token }
    });
  };

  const value = {
    ...state,
    login,
    logout,
    clearError,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
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

  // Check for existing token on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        console.log('AuthContext: Checking for existing token:', token ? 'Found' : 'Not found');
        
        if (token) {
          // Try to verify token with backend
          try {
            const user = await authService.verifyToken(token);
            console.log('AuthContext: Token verification successful:', user);
            dispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS,
              payload: { user, token }
            });
          } catch (verifyError) {
            console.log('AuthContext: Token verification failed, trying getUserInfo instead');
            // Fallback: try to get user info
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
      
      // Store token in localStorage (for persistence)
      localStorage.setItem('authToken', token);
      console.log('AuthContext: Token stored in localStorage');
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token }
      });
      console.log('AuthContext: Login success dispatched');
      
      return { success: true };
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.message || 'Login failed'
      });
      return { success: false, error: error.message };
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
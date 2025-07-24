import React, { createContext, useState, useCallback, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export { AuthContext };

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(window.__DGH_AUTH_SESSION__ || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if there's a session in memory
        const existingSession = window.__DGH_AUTH_SESSION__;
        if (existingSession) {
          setSession(existingSession);
          // Try to get current user info from session
          try {
            const userInfo = await authService.getUserInfo();
            setUser(userInfo);
          } catch (userError) {
            // Session might be expired, clear auth state
            window.__DGH_AUTH_SESSION__ = null;
            setSession(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        // Clear invalid session
        window.__DGH_AUTH_SESSION__ = null;
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [session]);

  const login = useCallback(async (username, password) => {
    try {
      setLoading(true);
      const userInfo = await authService.login(username, password);
      
      // The API returns the user object directly.
      // We'll create a dummy session token for frontend state management.
      const sessionIdentifier = 'session-' + Date.now();
      window.__DGH_AUTH_SESSION__ = sessionIdentifier;
      setSession(sessionIdentifier);
      setUser(userInfo);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Inform the backend about logout, but don't wait
      authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state
      window.__DGH_AUTH_SESSION__ = null;
      setSession(null);
      setUser(null);
    }
  }, []);

  const isAuthenticated = !!session && !!user;

  const value = {
    session,
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useRole = () => {
  const { user } = useAuth();
  
  const hasRole = (role) => {
    if (!user || !user.role) return false;
    return user.role === role;
  };

  const hasAnyRole = (roles) => {
    if (!user || !user.role) return false;
    return roles.includes(user.role);
  };

  const isAdmin = () => hasRole('ADMIN');
  const isTechnician = () => hasRole('TECHNICIAN');
  const isUser = () => hasRole('USER');

  return {
    hasRole,
    hasAnyRole,
    isAdmin,
    isTechnician,
    isUser,
    userRole: user?.role
  };
};

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '../../hooks/useAuth';
import { Box, Typography, Alert } from '@mui/material';

const RoleProtectedRoute = ({ children, requiredRoles, fallbackPath = '/dashboard' }) => {
  const { hasAnyRole, userRole } = useRole();

  // If no roles specified, allow access
  if (!requiredRoles || requiredRoles.length === 0) {
    return children;
  }

  // Check if user has any of the required roles
  if (!hasAnyRole(requiredRoles)) {
    // Show access denied message instead of redirect for better UX
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          <Typography variant="h6" gutterBottom>
            Access Denied
          </Typography>
          <Typography>
            You don't have permission to access this page. 
            Required roles: {requiredRoles.join(', ')}
            {userRole && ` (Your role: ${userRole})`}
          </Typography>
        </Alert>
      </Box>
    );
  }

  return children;
};

export default RoleProtectedRoute;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  BugReport,
  People,
  Computer,
  Assignment,
  CheckCircle,
  Schedule,
  TrendingUp
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import dashboardService from '../../services/dashboardService';
import UserInfo from '../../components/common/UserInfo';
import DatabaseViewer from '../../components/common/DatabaseViewer';
import H2ConsoleInfo from '../../components/common/H2ConsoleInfo';
import TechnicianDashboard from './TechnicianDashboard';
import AdminDashboard from './AdminDashboard';
import EmployeeDashboard from './EmployeeDashboard';

const Dashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // Debug logging
  console.log('Dashboard - user:', user);
  console.log('Dashboard - isAuthenticated:', isAuthenticated);
  console.log('Dashboard - authLoading:', authLoading);

  // Wait for authentication to complete before rendering
  if (authLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh'
        }}
      >
        <Alert severity="warning">
          Please log in to access the dashboard.
        </Alert>
      </Box>
    );
  }

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getStatistics();
        setStatistics(data);
      } catch (err) {
        setError('Failed to load dashboard statistics');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // Render role-specific dashboard
  const renderRoleBasedDashboard = () => {
    if (!user || !user.role) {
      return <EmployeeDashboard statistics={statistics} loading={loading} error={error} />;
    }

    switch (user.role) {
      case 'ADMIN':
        return <AdminDashboard statistics={statistics} loading={loading} error={error} />;
      case 'TECHNICIAN':
        return <TechnicianDashboard statistics={statistics} loading={loading} error={error} />;
      case 'EMPLOYEE':
      default:
        return <EmployeeDashboard statistics={statistics} loading={loading} error={error} />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, {user?.displayName || user?.username}!
        </Typography>
      </Box>

      {/* Debug: User Information */}
      <UserInfo />
      
      {/* Debug: Database Users */}
      <DatabaseViewer />
      
      {/* Debug: H2 Console Info */}
      <H2ConsoleInfo />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Render role-specific dashboard content */}
      {renderRoleBasedDashboard()}
    </Container>
  );
};

export default Dashboard; 
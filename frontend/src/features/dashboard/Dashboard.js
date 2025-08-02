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
  Computer
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import dashboardService from '../../services/dashboardService';
import UserInfo from '../../components/common/UserInfo';
import DatabaseViewer from '../../components/common/DatabaseViewer';
import H2ConsoleInfo from '../../components/common/H2ConsoleInfo';

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

  const StatCard = ({ title, value, icon, color = 'primary.main' }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              backgroundColor: color,
              borderRadius: '50%',
              p: 1,
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
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

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Tickets"
            value={statistics?.ticketStatistics?.totalTickets || 0}
            icon={<BugReport sx={{ color: 'white' }} />}
            color="primary.main"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Open Tickets"
            value={statistics?.ticketStatistics?.openTickets || 0}
            icon={<BugReport sx={{ color: 'white' }} />}
            color="warning.main"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={statistics?.userStatistics?.totalUsers || 0}
            icon={<People sx={{ color: 'white' }} />}
            color="success.main"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Equipment"
            value={statistics?.equipmentStatistics?.totalEquipment || 0}
            icon={<Computer sx={{ color: 'white' }} />}
            color="info.main"
          />
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No recent activity to display.
            </Typography>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Quick action buttons will be added here.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 
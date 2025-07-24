import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import dashboardService from '../../services/dashboardService';

const AdminDashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dashboardService.getStatistics()
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load statistics');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Box sx={{ color: 'error.main', textAlign: 'center', mt: 4 }}>{error}</Box>;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h3">{stats?.totalUsers ?? '-'}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Tickets</Typography>
            <Typography variant="h3">{stats?.totalTickets ?? '-'}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Open Tickets</Typography>
            <Typography variant="h3">{stats?.openTickets ?? '-'}</Typography>
          </Paper>
        </Grid>
      </Grid>
      {/* Placeholder for charts and quick actions */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Statistics Charts (Coming Soon)</Typography>
      </Box>
    </Box>
  );
};

export default AdminDashboardHome; 
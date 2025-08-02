import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  Typography,
  Button,
  Alert
} from '@mui/material';
import {
  BugReport,
  People,
  Computer,
  AdminPanelSettings,
  TrendingUp,
  Settings,
  Group,
  Storage
} from '@mui/icons-material';

const AdminDashboard = ({ statistics, loading, error }) => {
  const StatCard = ({ title, value, icon, color = 'primary.main', subtitle }) => (
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
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* System Statistics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Tickets"
            value={statistics?.ticketStatistics?.totalTickets || 0}
            icon={<BugReport sx={{ color: 'white' }} />}
            color="primary.main"
            subtitle="All tickets in the system"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Open Tickets"
            value={statistics?.ticketStatistics?.openTickets || 0}
            icon={<BugReport sx={{ color: 'white' }} />}
            color="error.main"
            subtitle="Tickets awaiting resolution"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={statistics?.userStatistics?.totalUsers || 0}
            icon={<People sx={{ color: 'white' }} />}
            color="success.main"
            subtitle="Registered system users"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Equipment"
            value={statistics?.equipmentStatistics?.totalEquipment || 0}
            icon={<Computer sx={{ color: 'white' }} />}
            color="info.main"
            subtitle="Tracked IT assets"
          />
        </Grid>

        {/* System Overview */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              System Overview
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
                    Ticket Statistics
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Total: {statistics?.ticketStatistics?.totalTickets || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Open: {statistics?.ticketStatistics?.openTickets || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • In Progress: {statistics?.ticketStatistics?.inProgressTickets || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Resolved: {statistics?.ticketStatistics?.resolvedTickets || 0}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
                    User Statistics
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Total Users: {statistics?.userStatistics?.totalUsers || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Active Users: {statistics?.userStatistics?.activeUsers || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Technicians: {statistics?.userStatistics?.technicians || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Admins: {statistics?.userStatistics?.admins || 0}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Administrative Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Administrative Actions
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<Group />}
                onClick={() => window.location.href = '/users'}
              >
                Manage Users
              </Button>
              
              <Button
                variant="outlined"
                fullWidth
                startIcon={<BugReport />}
                onClick={() => window.location.href = '/tickets'}
              >
                View All Tickets
              </Button>
              
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Computer />}
                onClick={() => window.location.href = '/equipment'}
              >
                Equipment Management
              </Button>
              
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Settings />}
                onClick={() => window.location.href = '/settings'}
              >
                System Settings
              </Button>
              
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Storage />}
                onClick={() => window.location.href = '/reports'}
              >
                Generate Reports
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Quick Statistics */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Statistics
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                    {statistics?.ticketStatistics?.totalTickets > 0 
                      ? Math.round((statistics?.ticketStatistics?.resolvedTickets / statistics?.ticketStatistics?.totalTickets) * 100) 
                      : 0}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ticket Resolution Rate
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                    {statistics?.ticketStatistics?.inProgressTickets || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tickets In Progress
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="error.main" sx={{ fontWeight: 'bold' }}>
                    {statistics?.ticketStatistics?.openTickets || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Tickets
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                    {statistics?.userStatistics?.activeUsers || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Users
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard; 
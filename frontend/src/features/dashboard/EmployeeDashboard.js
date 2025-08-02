import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider
} from '@mui/material';
import {
  BugReport,
  Add,
  Visibility,
  CheckCircle,
  Schedule,
  PriorityHigh,
  PriorityMedium,
  PriorityLow
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { ticketService } from '../../services/ticketService';

const EmployeeDashboard = ({ statistics, loading, error }) => {
  const { user } = useAuth();
  const [myTickets, setMyTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [ticketsError, setTicketsError] = useState(null);

  useEffect(() => {
    const fetchMyTickets = async () => {
      try {
        setTicketsLoading(true);
        // Fetch tickets created by the current user
        const tickets = await ticketService.getTickets({ createdBy: user?.id });
        setMyTickets(tickets);
      } catch (err) {
        setTicketsError('Failed to load your tickets');
        console.error('Employee dashboard error:', err);
      } finally {
        setTicketsLoading(false);
      }
    };

    if (user?.id) {
      fetchMyTickets();
    }
  }, [user?.id]);

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

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'HIGH':
        return <PriorityHigh sx={{ color: 'error.main' }} />;
      case 'MEDIUM':
        return <PriorityMedium sx={{ color: 'warning.main' }} />;
      case 'LOW':
        return <PriorityLow sx={{ color: 'success.main' }} />;
      default:
        return <PriorityMedium sx={{ color: 'warning.main' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN':
        return 'error';
      case 'IN_PROGRESS':
        return 'warning';
      case 'RESOLVED':
        return 'success';
      case 'CLOSED':
        return 'default';
      default:
        return 'default';
    }
  };

  const getMyTicketStats = () => {
    if (!myTickets.length) return { open: 0, inProgress: 0, resolved: 0, total: 0 };
    
    return {
      open: myTickets.filter(t => t.status === 'OPEN').length,
      inProgress: myTickets.filter(t => t.status === 'IN_PROGRESS').length,
      resolved: myTickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length,
      total: myTickets.length
    };
  };

  const stats = getMyTicketStats();

  if (loading || ticketsLoading) {
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
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {ticketsError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {ticketsError}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Employee Statistics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="My Tickets"
            value={stats.total}
            icon={<BugReport sx={{ color: 'white' }} />}
            color="primary.main"
            subtitle="Tickets you've created"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Open Tickets"
            value={stats.open}
            icon={<BugReport sx={{ color: 'white' }} />}
            color="error.main"
            subtitle="Your pending tickets"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={<Schedule sx={{ color: 'white' }} />}
            color="warning.main"
            subtitle="Being worked on"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Resolved"
            value={stats.resolved}
            icon={<CheckCircle sx={{ color: 'white' }} />}
            color="success.main"
            subtitle="Successfully resolved"
          />
        </Grid>

        {/* My Tickets List */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                My Tickets
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                size="small"
                onClick={() => window.location.href = '/tickets/create'}
              >
                Create New Ticket
              </Button>
            </Box>
            
            {myTickets.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                You haven't created any tickets yet.
              </Typography>
            ) : (
              <List>
                {myTickets.slice(0, 5).map((ticket, index) => (
                  <React.Fragment key={ticket.id}>
                    <ListItem
                      sx={{
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        mb: 1,
                        '&:hover': {
                          backgroundColor: 'action.hover'
                        }
                      }}
                    >
                      <ListItemIcon>
                        {getPriorityIcon(ticket.priority)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                              #{ticket.id} - {ticket.title}
                            </Typography>
                            <Chip
                              label={ticket.status}
                              size="small"
                              color={getStatusColor(ticket.status)}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {ticket.description?.substring(0, 100)}
                              {ticket.description?.length > 100 ? '...' : ''}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Created: {new Date(ticket.createdAt).toLocaleDateString()} | 
                              Category: {ticket.category} | 
                              Priority: {ticket.priority}
                            </Typography>
                          </Box>
                        }
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => window.location.href = `/tickets/${ticket.id}`}
                      >
                        View
                      </Button>
                    </ListItem>
                    {index < myTickets.slice(0, 5).length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<Add />}
                onClick={() => window.location.href = '/tickets/create'}
              >
                Create New Ticket
              </Button>
              
              <Button
                variant="outlined"
                fullWidth
                startIcon={<BugReport />}
                onClick={() => window.location.href = '/tickets?createdBy=me'}
              >
                View My Tickets
              </Button>
              
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Schedule />}
                onClick={() => window.location.href = '/tickets?status=OPEN&createdBy=me'}
              >
                View Open Tickets
              </Button>
              
              <Button
                variant="outlined"
                fullWidth
                startIcon={<CheckCircle />}
                onClick={() => window.location.href = '/tickets?status=RESOLVED&createdBy=me'}
              >
                View Resolved
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* System Information */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              System Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                    {statistics?.ticketStatistics?.totalTickets || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total System Tickets
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                    {statistics?.ticketStatistics?.openTickets || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Open System Tickets
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                    {statistics?.userStatistics?.totalUsers || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Users
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
                    {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your Resolution Rate
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

export default EmployeeDashboard; 
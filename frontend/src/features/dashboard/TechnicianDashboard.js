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
  Assignment,
  CheckCircle,
  Schedule,
  TrendingUp,
  Add,
  Visibility,
  Build,
  PriorityHigh,
  PriorityMedium,
  PriorityLow
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { ticketService } from '../../services/ticketService';

const TechnicianDashboard = ({ statistics, loading, error }) => {
  const { user } = useAuth();
  const [assignedTickets, setAssignedTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [ticketsError, setTicketsError] = useState(null);

  useEffect(() => {
    const fetchAssignedTickets = async () => {
      try {
        setTicketsLoading(true);
        // Fetch tickets assigned to the current technician
        const tickets = await ticketService.getTickets({ assignedTo: user?.id });
        setAssignedTickets(tickets);
      } catch (err) {
        setTicketsError('Failed to load assigned tickets');
        console.error('Technician dashboard error:', err);
      } finally {
        setTicketsLoading(false);
      }
    };

    if (user?.id) {
      fetchAssignedTickets();
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

  const getTechnicianStats = () => {
    if (!assignedTickets.length) return { open: 0, inProgress: 0, resolved: 0, total: 0 };
    
    return {
      open: assignedTickets.filter(t => t.status === 'OPEN').length,
      inProgress: assignedTickets.filter(t => t.status === 'IN_PROGRESS').length,
      resolved: assignedTickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length,
      total: assignedTickets.length
    };
  };

  const stats = getTechnicianStats();

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
        {/* Technician Statistics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Assigned Tickets"
            value={stats.total}
            icon={<Assignment sx={{ color: 'white' }} />}
            color="primary.main"
            subtitle="Total tickets assigned to you"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Open Tickets"
            value={stats.open}
            icon={<BugReport sx={{ color: 'white' }} />}
            color="error.main"
            subtitle="Tickets awaiting action"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={<Build sx={{ color: 'white' }} />}
            color="warning.main"
            subtitle="Tickets you're working on"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Resolved"
            value={stats.resolved}
            icon={<CheckCircle sx={{ color: 'white' }} />}
            color="success.main"
            subtitle="Tickets you've completed"
          />
        </Grid>

        {/* Assigned Tickets List */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Your Assigned Tickets
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                size="small"
                onClick={() => window.location.href = '/tickets'}
              >
                View All
              </Button>
            </Box>
            
            {assignedTickets.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No tickets assigned to you at the moment.
              </Typography>
            ) : (
              <List>
                {assignedTickets.slice(0, 5).map((ticket, index) => (
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
                    {index < assignedTickets.slice(0, 5).length - 1 && <Divider />}
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
                startIcon={<Assignment />}
                onClick={() => window.location.href = '/tickets?status=OPEN&assignedTo=me'}
              >
                View Open Tickets
              </Button>
              
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Build />}
                onClick={() => window.location.href = '/tickets?status=IN_PROGRESS&assignedTo=me'}
              >
                View In Progress
              </Button>
              
              <Button
                variant="outlined"
                fullWidth
                startIcon={<CheckCircle />}
                onClick={() => window.location.href = '/tickets?status=RESOLVED&assignedTo=me'}
              >
                View Completed
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Work Summary */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Work Summary
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                    {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completion Rate
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                    {stats.inProgress}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Currently Working
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="error.main" sx={{ fontWeight: 'bold' }}>
                    {stats.open}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Action
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                    {stats.resolved}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Successfully Resolved
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

export default TechnicianDashboard; 
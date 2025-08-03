import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress,
  Fab
} from '@mui/material';
import {
  BugReport,
  Add,
  CheckCircle,
  Schedule,
  PriorityHigh,
  TrendingUp,
  Person,
  Notifications,
  Book,
  Lightbulb,
  Message
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const EmployeeDashboard = ({ statistics, loading, error }) => {
  const [myTickets, setMyTickets] = useState([]);
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [knowledgeBaseRecommendations, setKnowledgeBaseRecommendations] = useState([]);

  // Mock data for demonstration - replace with actual API calls
  useEffect(() => {
    // Simulate API calls for employee-specific data
    setMyTickets([
      { id: 1, title: 'Network connectivity issue', priority: 'HIGH', status: 'IN_PROGRESS', createdAt: '2024-01-15', lastUpdate: '2024-01-15 14:30' },
      { id: 2, title: 'Printer not working', priority: 'MEDIUM', status: 'OPEN', createdAt: '2024-01-14', lastUpdate: '2024-01-14 16:45' },
      { id: 3, title: 'Software installation request', priority: 'LOW', status: 'RESOLVED', createdAt: '2024-01-13', lastUpdate: '2024-01-13 11:20' },
    ]);

    setRecentUpdates([
      { id: 1, ticketId: 1, message: 'Technician Ahmed Benali has started working on your ticket', timestamp: '2024-01-15 14:30', type: 'status_change' },
      { id: 2, ticketId: 2, message: 'Your ticket has been assigned to technician Fatima Zahra', timestamp: '2024-01-14 16:45', type: 'assignment' },
      { id: 3, ticketId: 3, message: 'Your ticket has been resolved successfully', timestamp: '2024-01-13 11:20', type: 'resolution' },
    ]);

    setKnowledgeBaseRecommendations([
      { id: 1, title: 'How to reset your password', category: 'ACCESS', relevance: 95 },
      { id: 2, title: 'Connecting to office WiFi', category: 'NETWORK', relevance: 88 },
      { id: 3, title: 'Installing approved software', category: 'SOFTWARE', relevance: 82 },
    ]);
  }, []);

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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRITICAL': return 'error';
      case 'HIGH': return 'warning';
      case 'MEDIUM': return 'info';
      case 'LOW': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'error';
      case 'IN_PROGRESS': return 'warning';
      case 'WAITING': return 'info';
      case 'RESOLVED': return 'success';
      case 'CLOSED': return 'default';
      default: return 'default';
    }
  };

  const getUpdateIcon = (type) => {
    switch (type) {
      case 'status_change': return <Schedule color="warning" />;
      case 'assignment': return <Person color="info" />;
      case 'resolution': return <CheckCircle color="success" />;
      case 'comment': return <Message color="primary" />;
      default: return <Notifications color="default" />;
    }
  };

  const ticketStatusData = [
    { name: 'Open', value: myTickets.filter(t => t.status === 'OPEN').length, color: '#f44336' },
    { name: 'In Progress', value: myTickets.filter(t => t.status === 'IN_PROGRESS').length, color: '#ff9800' },
    { name: 'Resolved', value: myTickets.filter(t => t.status === 'RESOLVED').length, color: '#4caf50' },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
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

      {/* Header with Quick Ticket Creation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          My Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {/* Navigate to create ticket */}}
        >
          Submit New Request
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* My Ticket Status Overview */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="My Open Tickets"
            value={myTickets.filter(t => t.status === 'OPEN').length}
            icon={<BugReport sx={{ color: 'white' }} />}
            color="error.main"
            subtitle="Tickets awaiting action"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="In Progress"
            value={myTickets.filter(t => t.status === 'IN_PROGRESS').length}
            icon={<Schedule sx={{ color: 'white' }} />}
            color="warning.main"
            subtitle="Being worked on"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Resolved"
            value={myTickets.filter(t => t.status === 'RESOLVED').length}
            icon={<CheckCircle sx={{ color: 'white' }} />}
            color="success.main"
            subtitle="Successfully completed"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Requests"
            value={myTickets.length}
            icon={<TrendingUp sx={{ color: 'white' }} />}
            color="info.main"
            subtitle="All my support requests"
          />
        </Grid>

        {/* Ticket Status Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                My Ticket Status Overview
              </Typography>
              {myTickets.length > 0 ? (
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ticketStatusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {ticketStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <BugReport sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body1" color="text.secondary">
                    No tickets yet. Submit your first support request!
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Updates */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Updates
              </Typography>
              {recentUpdates.length > 0 ? (
                <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {recentUpdates.map((update, index) => (
                    <React.Fragment key={update.id}>
                      <ListItem>
                        <ListItemIcon>
                          {getUpdateIcon(update.type)}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                              {update.message}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              {update.timestamp}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < recentUpdates.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Notifications sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body1" color="text.secondary">
                    No recent updates
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Knowledge Base Recommendations */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Knowledge Base Recommendations
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Based on your recent tickets, you might find these helpful:
              </Typography>
              <Grid container spacing={2}>
                {knowledgeBaseRecommendations.map((article) => (
                  <Grid item xs={12} sm={6} md={4} key={article.id}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Book sx={{ mr: 1, color: 'primary.main' }} />
                          <Chip 
                            label={article.category} 
                            size="small" 
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                        <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 1 }}>
                          {article.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            {article.relevance}% relevant
                          </Typography>
                          <Button
                            size="small"
                            startIcon={<Lightbulb />}
                            onClick={() => {/* Navigate to knowledge base article */}}
                          >
                            Read More
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* My Recent Tickets */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                My Recent Tickets
              </Typography>
              {myTickets.length > 0 ? (
                <List>
                  {myTickets.map((ticket, index) => (
                    <React.Fragment key={ticket.id}>
                      <ListItem>
                        <ListItemIcon>
                          <PriorityHigh color={getPriorityColor(ticket.priority)} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                {ticket.title}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Chip 
                                  label={ticket.priority} 
                                  size="small" 
                                  color={getPriorityColor(ticket.priority)}
                                />
                                <Chip 
                                  label={ticket.status} 
                                  size="small" 
                                  color={getStatusColor(ticket.status)}
                                />
                              </Box>
                            </Box>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              Created: {ticket.createdAt} • Last Update: {ticket.lastUpdate}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < myTickets.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <BugReport sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body1" color="text.secondary">
                    No tickets yet. Submit your first support request!
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Floating Action Button for Quick Ticket Creation */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={() => {/* Navigate to create ticket */}}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default EmployeeDashboard; 
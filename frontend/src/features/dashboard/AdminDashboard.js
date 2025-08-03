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
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Pagination
} from '@mui/material';
import {
  BugReport,
  People,
  Add,
  Assignment,
  Assessment,
  Warning,
  CheckCircle,
  Schedule,
  PriorityHigh,
  Refresh,
  Search,
  FilterList,
  History,
  Security,
  Person,
  Settings,
  Computer
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend } from 'recharts';
import activityLogService from '../../services/activityLogService';

const AdminDashboard = ({ statistics, loading, error }) => {
  const [recentTickets, setRecentTickets] = useState([]);
  const [technicianPerformance, setTechnicianPerformance] = useState([]);
  const [equipmentStatus, setEquipmentStatus] = useState({ active: 0, inactive: 0, critical: 0 });
  const [activityLog, setActivityLog] = useState([]);
  const [logFilter, setLogFilter] = useState('all');
  const [logSearch, setLogSearch] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [logLoading, setLogLoading] = useState(false);
  const [logError, setLogError] = useState(null);
  const [logPage, setLogPage] = useState(0);
  const [logTotalPages, setLogTotalPages] = useState(0);
  const [logTotalElements, setLogTotalElements] = useState(0);

  // Mock data for demonstration - replace with actual API calls
  useEffect(() => {
    // Simulate API calls for additional dashboard data
    setRecentTickets([
      { id: 1, title: 'Network connectivity issue', priority: 'HIGH', status: 'IN_PROGRESS', assignedTo: 'Ahmed Benali', createdAt: '2024-01-15' },
      { id: 2, title: 'Printer not working', priority: 'MEDIUM', status: 'OPEN', assignedTo: 'Fatima Zahra', createdAt: '2024-01-14' },
      { id: 3, title: 'Software installation request', priority: 'LOW', status: 'RESOLVED', assignedTo: 'Mohammed Alami', createdAt: '2024-01-13' },
    ]);

    setTechnicianPerformance([
      { name: 'Ahmed Benali', resolved: 45, pending: 8, slaCompliance: 92 },
      { name: 'Fatima Zahra', resolved: 38, pending: 12, slaCompliance: 88 },
      { name: 'Mohammed Alami', resolved: 52, pending: 5, slaCompliance: 95 },
    ]);

    setEquipmentStatus({ active: 156, inactive: 12, critical: 3 });
  }, []);

  // Load activity logs when tab is active
  useEffect(() => {
    if (activeTab === 1) {
      loadActivityLogs();
    }
  }, [activeTab, logFilter, logSearch, logPage]);

  const loadActivityLogs = async () => {
    try {
      setLogLoading(true);
      setLogError(null);

      const params = {
        page: logPage,
        size: 50,
        searchTerm: logSearch || undefined,
        severity: logFilter === 'all' ? undefined : logFilter.toUpperCase()
      };

      const response = await activityLogService.getActivityLogs(params);
      
      setActivityLog(response.content.map(activityLogService.formatActivityLog));
      setLogTotalPages(response.totalPages);
      setLogTotalElements(response.totalElements);
    } catch (err) {
      console.error('Error loading activity logs:', err);
      setLogError('Failed to load activity logs');
      // Fallback to mock data for demonstration
      setActivityLog([
        {
          id: 1,
          timestamp: '2024-01-15 14:30:25',
          user: 'Ahmed Benali',
          action: 'TICKET_STATUS_CHANGE',
          details: 'Changed ticket #1234 status from OPEN to IN_PROGRESS',
          severity: 'INFO',
          ipAddress: '192.168.1.45',
          userAgent: 'Chrome/120.0.0.0'
        },
        {
          id: 2,
          timestamp: '2024-01-15 14:25:10',
          user: 'admin@dgh.gov.ma',
          action: 'USER_CREATED',
          details: 'Created new user: Fatima Zahra (TECHNICIAN)',
          severity: 'SUCCESS',
          ipAddress: '192.168.1.1',
          userAgent: 'Chrome/120.0.0.0'
        },
        {
          id: 3,
          timestamp: '2024-01-15 14:20:15',
          user: 'Mohammed Alami',
          action: 'TICKET_ASSIGNED',
          details: 'Assigned ticket #1235 to Ahmed Benali',
          severity: 'WARNING',
          ipAddress: '192.168.1.67',
          userAgent: 'Firefox/121.0.0'
        },
        {
          id: 4,
          timestamp: '2024-01-15 14:15:30',
          user: 'admin@dgh.gov.ma',
          action: 'SYSTEM_CONFIG_CHANGE',
          details: 'Updated SLA settings for critical tickets',
          severity: 'ERROR',
          ipAddress: '192.168.1.1',
          userAgent: 'Chrome/120.0.0.0'
        },
        {
          id: 5,
          timestamp: '2024-01-15 14:10:45',
          user: 'Fatima Zahra',
          action: 'TICKET_RESOLVED',
          details: 'Resolved ticket #1230: Printer connectivity issue',
          severity: 'SUCCESS',
          ipAddress: '192.168.1.89',
          userAgent: 'Edge/120.0.0.0'
        },
        {
          id: 6,
          timestamp: '2024-01-15 14:05:20',
          user: 'admin@dgh.gov.ma',
          action: 'EQUIPMENT_DISCOVERED',
          details: 'SNMP discovery found 3 new network devices',
          severity: 'INFO',
          ipAddress: '192.168.1.1',
          userAgent: 'Chrome/120.0.0.0'
        },
        {
          id: 7,
          timestamp: '2024-01-15 14:00:10',
          user: 'Ahmed Benali',
          action: 'LOGIN',
          details: 'User logged in successfully',
          severity: 'INFO',
          ipAddress: '192.168.1.45',
          userAgent: 'Chrome/120.0.0.0'
        },
        {
          id: 8,
          timestamp: '2024-01-15 13:55:30',
          user: 'unknown@dgh.gov.ma',
          action: 'LOGIN_FAILED',
          details: 'Failed login attempt for user: test@dgh.gov.ma',
          severity: 'ERROR',
          ipAddress: '192.168.1.100',
          userAgent: 'Chrome/120.0.0.0'
        }
      ]);
    } finally {
      setLogLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color = 'primary.main', subtitle, trend }) => (
    <Card sx={{ height: '100%', position: 'relative' }}>
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
        {trend && (
          <Chip 
            label={trend} 
            size="small" 
            color={trend.includes('+') ? 'success' : 'error'}
            sx={{ mt: 1 }}
          />
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

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'ERROR': return <Warning color="error" />;
      case 'WARNING': return <Warning color="warning" />;
      case 'SUCCESS': return <CheckCircle color="success" />;
      case 'INFO': return <Schedule color="info" />;
      default: return <History color="default" />;
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'LOGIN': return <Person color="primary" />;
      case 'LOGIN_FAILED': return <Security color="error" />;
      case 'TICKET_STATUS_CHANGE': return <BugReport color="warning" />;
      case 'TICKET_ASSIGNED': return <Assignment color="info" />;
      case 'TICKET_RESOLVED': return <CheckCircle color="success" />;
      case 'USER_CREATED': return <Person color="success" />;
      case 'SYSTEM_CONFIG_CHANGE': return <Settings color="warning" />;
      case 'EQUIPMENT_DISCOVERED': return <Computer color="info" />;
      default: return <History color="default" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'ERROR': return 'error';
      case 'WARNING': return 'warning';
      case 'SUCCESS': return 'success';
      case 'INFO': return 'info';
      default: return 'default';
    }
  };

  const ticketStatusData = [
    { name: 'Open', value: statistics?.ticketStatistics?.openTickets || 0, color: '#f44336' },
    { name: 'In Progress', value: statistics?.ticketStatistics?.inProgressTickets || 0, color: '#ff9800' },
    { name: 'Resolved', value: statistics?.ticketStatistics?.resolvedTickets || 0, color: '#4caf50' },
    { name: 'Closed', value: statistics?.ticketStatistics?.closedTickets || 0, color: '#9e9e9e' },
  ];

  const handleLogPageChange = (event, newPage) => {
    setLogPage(newPage - 1); // API uses 0-based indexing
  };

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

      {/* Header with Quick Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Admin Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {/* Navigate to create user */}}
          >
            Create User
          </Button>
          <Button
            variant="outlined"
            startIcon={<Assignment />}
            onClick={() => {/* Navigate to ticket assignment */}}
          >
            Assign Ticket
          </Button>
          <Button
            variant="outlined"
            startIcon={<Assessment />}
            onClick={() => {/* Navigate to reports */}}
          >
            Generate Report
          </Button>
        </Box>
      </Box>

      {/* Tabs for Dashboard and Activity Log */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Dashboard Overview" />
          <Tab label="Activity Log" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Global Ticket Overview Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Tickets"
              value={statistics?.ticketStatistics?.totalTickets || 0}
              icon={<BugReport sx={{ color: 'white' }} />}
              color="primary.main"
              subtitle="All tickets in the system"
              trend="+12% this week"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Open Tickets"
              value={statistics?.ticketStatistics?.openTickets || 0}
              icon={<BugReport sx={{ color: 'white' }} />}
              color="error.main"
              subtitle="Tickets awaiting resolution"
              trend="-5% this week"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="SLA Breached"
              value={statistics?.ticketStatistics?.slaBreachedTickets || 0}
              icon={<Warning sx={{ color: 'white' }} />}
              color="error.main"
              subtitle="Tickets exceeding SLA"
              trend="+2 this week"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Users"
              value={statistics?.userStatistics?.totalUsers || 0}
              icon={<People sx={{ color: 'white' }} />}
              color="success.main"
              subtitle="Registered system users"
              trend="+3 this month"
            />
          </Grid>

          {/* Ticket Status Distribution Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Ticket Status Distribution
                </Typography>
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
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Equipment Monitoring */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Equipment Status
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <CheckCircle sx={{ fontSize: 40, color: 'success.main' }} />
                      <Typography variant="h4">{equipmentStatus.active}</Typography>
                      <Typography variant="body2" color="text.secondary">Active</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Schedule sx={{ fontSize: 40, color: 'warning.main' }} />
                      <Typography variant="h4">{equipmentStatus.inactive}</Typography>
                      <Typography variant="body2" color="text.secondary">Inactive</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Warning sx={{ fontSize: 40, color: 'error.main' }} />
                      <Typography variant="h4">{equipmentStatus.critical}</Typography>
                      <Typography variant="body2" color="text.secondary">Critical</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Technician Performance */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Technician Performance
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={technicianPerformance}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="resolved" fill="#4caf50" name="Resolved" />
                      <Bar dataKey="pending" fill="#ff9800" name="Pending" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Tickets & Escalations */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Recent Tickets & Escalations
                  </Typography>
                  <IconButton size="small">
                    <Refresh />
                  </IconButton>
                </Box>
                <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {recentTickets.map((ticket, index) => (
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
                              <Chip 
                                label={ticket.priority} 
                                size="small" 
                                color={getPriorityColor(ticket.priority)}
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Assigned to: {ticket.assignedTo}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Status: {ticket.status} • Created: {ticket.createdAt}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < recentTickets.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Box>
          {/* Activity Log Header with Filters */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
              System Activity Log
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Search activities..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                sx={{ minWidth: 250 }}
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Filter</InputLabel>
                <Select
                  value={logFilter}
                  onChange={(e) => setLogFilter(e.target.value)}
                  label="Filter"
                >
                  <MenuItem value="all">All Activities</MenuItem>
                  <MenuItem value="error">Errors</MenuItem>
                  <MenuItem value="warning">Warnings</MenuItem>
                  <MenuItem value="success">Success</MenuItem>
                  <MenuItem value="info">Info</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={loadActivityLogs}
                disabled={logLoading}
              >
                Refresh
              </Button>
            </Box>
          </Box>

          {logError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {logError}
            </Alert>
          )}

          {/* Activity Log Table */}
          <Card>
            <CardContent>
              {logLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Timestamp</TableCell>
                          <TableCell>User</TableCell>
                          <TableCell>Action</TableCell>
                          <TableCell>Details</TableCell>
                          <TableCell>Severity</TableCell>
                          <TableCell>IP Address</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {activityLog.map((log) => (
                          <TableRow key={log.id} hover>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {log.timestamp}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Person sx={{ mr: 1, fontSize: 16 }} />
                                <Typography variant="body2">
                                  {log.user}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {getActionIcon(log.action)}
                                <Typography variant="body2" sx={{ ml: 1 }}>
                                  {log.action}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {log.details}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={log.severity}
                                size="small"
                                color={getSeverityColor(log.severity)}
                                icon={getSeverityIcon(log.severity)}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {log.ipAddress}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  {activityLog.length === 0 && !logLoading && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <History sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                      <Typography variant="body1" color="text.secondary">
                        No activity logs found matching your criteria
                      </Typography>
                    </Box>
                  )}

                  {/* Pagination */}
                  {logTotalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                      <Pagination
                        count={logTotalPages}
                        page={logPage + 1}
                        onChange={handleLogPageChange}
                        color="primary"
                        showFirstButton
                        showLastButton
                      />
                    </Box>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default AdminDashboard; 
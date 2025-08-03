import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Tooltip,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  PriorityHigh,
  WarningAmber,
  LowPriority,
  Replay as ReplayIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { ticketService } from '../../services/ticketService';
import { userService } from '../../services/userService';
import CreateTicketForm from '../../components/forms/CreateTicketForm';
import { TECHNICIAN_PERMISSIONS } from '../../constants/technicianPermissions';
import { 
  PRIORITY_OPTIONS, 
  STATUS_OPTIONS, 
  PRIORITY_COLORS, 
  STATUS_COLORS,
  PRIORITY_LABELS,
  STATUS_LABELS
} from '../../constants/ticketConstants';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [unassignedTickets, setUnassignedTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(''); // 'view', 'edit', 'assign', 'delete', 'escalate', 'reopen'
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0); // 0: Assigned, 1: Unassigned
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assignedTo: ''
  });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'OPEN',
    assignedTo: ''
  });
  const [escalationData, setEscalationData] = useState({
    reason: '',
    details: ''
  });
  const [reopenData, setReopenData] = useState({
    reason: ''
  });

  const { user } = useAuth();

  // Priority and Status options
  const priorities = PRIORITY_OPTIONS;
  const statuses = STATUS_OPTIONS;

  // Priority colors
  const getPriorityColor = (priority) => {
    return PRIORITY_COLORS[priority] || 'default';
  };

  // Status colors
  const getStatusColor = (status) => {
    return STATUS_COLORS[status] || 'default';
  };

  // Load tickets and users
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Determine what tickets to fetch based on user role
        let ticketsData;
        if (user?.role === 'TECHNICIAN') {
          // Technicians see ONLY their assigned tickets
          ticketsData = await ticketService.getTechnicianTickets(user.id);
          
          // Also load unassigned tickets if permission allows
          if (TECHNICIAN_PERMISSIONS.viewUnassignedTickets) {
            const unassignedData = await ticketService.getUnassignedTicketsWithFilters();
            setUnassignedTickets(Array.isArray(unassignedData) ? unassignedData : 
                               (unassignedData?.content ? unassignedData.content : []));
          }
        } else if (user?.role === 'ADMIN') {
          // Admins see all tickets
          ticketsData = await ticketService.getTickets();
        } else {
          // Employees see only their own tickets
          ticketsData = await ticketService.getTickets({ createdBy: user.id });
        }
        
        // Only load users for admins (for assignment purposes)
        if (user?.role === 'ADMIN') {
          const usersData = await userService.getUsers();
          const usersArray = Array.isArray(usersData) ? usersData : 
                            (usersData?.content ? usersData.content : 
                            (usersData?.data ? usersData.data : []));
          setUsers(usersArray.filter(u => u.role === 'TECHNICIAN' || u.role === 'ADMIN'));
        }
        
        // Debug logging
        console.log('Tickets component - ticketsData:', ticketsData);
        console.log('Tickets component - ticketsData type:', typeof ticketsData);
        console.log('Tickets component - ticketsData is array:', Array.isArray(ticketsData));
        
        // Ensure ticketsData is an array
        const ticketsArray = Array.isArray(ticketsData) ? ticketsData : 
                           (ticketsData?.content ? ticketsData.content : 
                           (ticketsData?.data ? ticketsData.data : []));
        
        console.log('Tickets component - ticketsArray:', ticketsArray);
        
        setTickets(ticketsArray);
      } catch (err) {
        setError('Failed to load tickets data');
        console.error('Error loading data:', err);
        setTickets([]);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  // Filter tickets - ensure tickets is always an array
  const filteredTickets = (Array.isArray(tickets) ? tickets : []).filter(ticket => {
    if (filters.status && ticket.status !== filters.status) return false;
    if (filters.priority && ticket.priority !== filters.priority) return false;
    if (filters.assignedTo && ticket.assignedTo?.id !== filters.assignedTo) return false;
    return true;
  });

  // Filter unassigned tickets
  const filteredUnassignedTickets = (Array.isArray(unassignedTickets) ? unassignedTickets : []).filter(ticket => {
    if (filters.status && ticket.status !== filters.status) return false;
    if (filters.priority && ticket.priority !== filters.priority) return false;
    return true;
  });

  // Handle dialog operations
  const handleDialogOpen = (type, ticket = null) => {
    setDialogType(type);
    setSelectedTicket(ticket);
    if (ticket && type === 'edit') {
      setFormData({
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority,
        status: ticket.status,
        assignedTo: ticket.assignedTo?.id || ''
      });
    }
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedTicket(null);
    setFormData({
      title: '',
      description: '',
      priority: 'MEDIUM',
      status: 'OPEN',
      assignedTo: ''
    });
    setEscalationData({ reason: '', details: '' });
    setReopenData({ reason: '' });
  };

  // Handle ticket operations
  const handleUpdateTicket = async () => {
    try {
      const updatedTicket = await ticketService.updateTicket(selectedTicket.id, formData);
      setTickets(tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t));
      handleDialogClose();
    } catch (err) {
      setError('Failed to update ticket');
      console.error('Update error:', err);
    }
  };

  const handleAssignTicket = async () => {
    try {
      const assignedTicket = await ticketService.assignTicket(selectedTicket.id, formData.assignedTo);
      setTickets(tickets.map(t => t.id === assignedTicket.id ? assignedTicket : t));
      handleDialogClose();
    } catch (err) {
      setError('Failed to assign ticket');
      console.error('Assignment error:', err);
    }
  };

  // NEW: Self-assignment for technicians
  const handleSelfAssign = async (ticketId) => {
    try {
      const assignedTicket = await ticketService.assignTicketToSelf(ticketId, user.id);
      setTickets(prev => [...prev, assignedTicket]);
      setUnassignedTickets(prev => prev.filter(t => t.id !== ticketId));
    } catch (err) {
      setError('Failed to self-assign ticket');
      console.error('Self-assignment error:', err);
    }
  };

  // NEW: Escalate ticket
  const handleEscalateTicket = async () => {
    try {
      const escalatedTicket = await ticketService.escalateTicketWithDetails(selectedTicket.id, escalationData);
      setTickets(tickets.map(t => t.id === escalatedTicket.id ? escalatedTicket : t));
      handleDialogClose();
    } catch (err) {
      setError('Failed to escalate ticket');
      console.error('Escalation error:', err);
    }
  };

  // NEW: Reopen ticket
  const handleReopenTicket = async () => {
    try {
      const reopenedTicket = await ticketService.reopenTicket(selectedTicket.id, reopenData.reason);
      setTickets(tickets.map(t => t.id === reopenedTicket.id ? reopenedTicket : t));
      handleDialogClose();
    } catch (err) {
      setError('Failed to reopen ticket');
      console.error('Reopen error:', err);
    }
  };

  const handleDeleteTicket = async () => {
    try {
      await ticketService.deleteTicket(selectedTicket.id);
      setTickets(tickets.filter(t => t.id !== selectedTicket.id));
      handleDialogClose();
    } catch (err) {
      setError('Failed to delete ticket');
      console.error('Delete error:', err);
    }
  };

  const handleRefresh = async () => {
    // Reload data
    window.location.reload();
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Get priority icon
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'HIGH':
        return <PriorityHigh sx={{ color: 'error.main' }} />;
      case 'MEDIUM':
        return <WarningAmber sx={{ color: 'warning.main' }} />;
      case 'LOW':
        return <LowPriority sx={{ color: 'success.main' }} />;
      default:
        return <WarningAmber sx={{ color: 'warning.main' }} />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {user?.role === 'TECHNICIAN' ? 'My Tickets' : 'Ticket Management'}
        </Typography>
        
        {user?.role === 'TECHNICIAN' && (
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Manage your assigned tickets and view unassigned tickets to pick up work
          </Typography>
        )}
        
        {user?.role === 'ADMIN' && (
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Manage all system tickets, assignments, and escalations
          </Typography>
        )}
        
        {user?.role === 'EMPLOYEE' && (
          <Typography variant="body1" color="textSecondary" gutterBottom>
            View and manage your submitted tickets
          </Typography>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Action Buttons */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {/* Only show Create Ticket for Admins and Employees */}
        {(user?.role === 'ADMIN' || user?.role === 'EMPLOYEE') && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateFormOpen(true)}
          >
            Create Ticket
          </Button>
        )}
        
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
        >
          Refresh
        </Button>
      </Box>

      {/* Tabs for Technicians */}
      {user?.role === 'TECHNICIAN' && TECHNICIAN_PERMISSIONS.viewUnassignedTickets && (
        <Box sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label={`My Assigned Tickets (${filteredTickets.length})`} />
            <Tab label={`Unassigned Tickets (${filteredUnassignedTickets.length})`} />
          </Tabs>
        </Box>
      )}

      {/* Tickets Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(tabValue === 0 || user?.role !== 'TECHNICIAN') ? 
                filteredTickets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>{ticket.title}</TableCell>
                    <TableCell>
                      <Chip 
                        icon={getPriorityIcon(ticket.priority)}
                        label={PRIORITY_LABELS[ticket.priority] || ticket.priority} 
                        color={getPriorityColor(ticket.priority)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={STATUS_LABELS[ticket.status] || ticket.status} 
                        color={getStatusColor(ticket.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{ticket.category}</TableCell>
                    <TableCell>{ticket.assignedTo?.name || 'Unassigned'}</TableCell>
                    <TableCell>
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleDialogOpen('view', ticket)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        
                        {/* Only show edit for own tickets or if admin */}
                        {(user?.role === 'ADMIN' || ticket.assignedTo?.id === user?.id) && (
                          <Tooltip title="Edit Ticket">
                            <IconButton
                              size="small"
                              onClick={() => handleDialogOpen('edit', ticket)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        )}

                        {/* Technician-specific actions - only for their own tickets */}
                        {user?.role === 'TECHNICIAN' && ticket.assignedTo?.id === user?.id && (
                          <>
                            {ticket.status === 'CLOSED' && TECHNICIAN_PERMISSIONS.reopenTickets && (
                              <Tooltip title="Reopen Ticket">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDialogOpen('reopen', ticket)}
                                >
                                  <ReplayIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            
                            {ticket.status !== 'CLOSED' && ticket.status !== 'ESCALATED' && TECHNICIAN_PERMISSIONS.escalateTickets && (
                              <Tooltip title="Escalate Ticket">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDialogOpen('escalate', ticket)}
                                >
                                  <WarningAmber />
                                </IconButton>
                              </Tooltip>
                            )}
                          </>
                        )}

                        {/* Admin actions - can modify any ticket */}
                        {user?.role === 'ADMIN' && (
                          <>
                            {ticket.status === 'CLOSED' && (
                              <Tooltip title="Reopen Ticket">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDialogOpen('reopen', ticket)}
                                >
                                  <ReplayIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            
                            {ticket.status !== 'CLOSED' && ticket.status !== 'ESCALATED' && (
                              <Tooltip title="Escalate Ticket">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDialogOpen('escalate', ticket)}
                                >
                                  <WarningAmber />
                                </IconButton>
                              </Tooltip>
                            )}
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                )) : 
                // Unassigned tickets table
                filteredUnassignedTickets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>{ticket.title}</TableCell>
                    <TableCell>
                      <Chip 
                        icon={getPriorityIcon(ticket.priority)}
                        label={PRIORITY_LABELS[ticket.priority] || ticket.priority} 
                        color={getPriorityColor(ticket.priority)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={STATUS_LABELS[ticket.status] || ticket.status} 
                        color={getStatusColor(ticket.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{ticket.category}</TableCell>
                    <TableCell>Unassigned</TableCell>
                    <TableCell>
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleDialogOpen('view', ticket)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        
                        {TECHNICIAN_PERMISSIONS.assignTicketsToSelf && (
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<AssignmentIcon />}
                            onClick={() => handleSelfAssign(ticket.id)}
                          >
                            Assign to Me
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={tabValue === 0 || user?.role !== 'TECHNICIAN' ? filteredTickets.length : filteredUnassignedTickets.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Dialogs */}
      {/* View Ticket Dialog */}
      <Dialog open={dialogOpen && dialogType === 'view'} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Ticket Details</DialogTitle>
        <DialogContent>
          {selectedTicket && (
            <Box>
              <Typography variant="h6">{selectedTicket.title}</Typography>
              <Typography color="textSecondary" gutterBottom>
                {selectedTicket.description}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Chip label={`Priority: ${PRIORITY_LABELS[selectedTicket.priority] || selectedTicket.priority}`} sx={{ mr: 1 }} />
                <Chip label={`Status: ${STATUS_LABELS[selectedTicket.status] || selectedTicket.status}`} sx={{ mr: 1 }} />
                <Chip label={`Category: ${selectedTicket.category}`} />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Ticket Dialog */}
      <Dialog open={dialogOpen && dialogType === 'edit'} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Ticket</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={4}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                {priorities.map((priority) => (
                  <MenuItem key={priority} value={priority}>
                    {PRIORITY_LABELS[priority] || priority}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {STATUS_LABELS[status] || status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleUpdateTicket} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Escalate Ticket Dialog */}
      <Dialog open={dialogOpen && dialogType === 'escalate'} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Escalate Ticket</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Reason for Escalation"
              value={escalationData.reason}
              onChange={(e) => setEscalationData({ ...escalationData, reason: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Additional Details"
              value={escalationData.details}
              onChange={(e) => setEscalationData({ ...escalationData, details: e.target.value })}
              multiline
              rows={4}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleEscalateTicket} variant="contained" color="warning">
            Escalate
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reopen Ticket Dialog */}
      <Dialog open={dialogOpen && dialogType === 'reopen'} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Reopen Ticket</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Reason for Reopening"
              value={reopenData.reason}
              onChange={(e) => setReopenData({ ...reopenData, reason: e.target.value })}
              multiline
              rows={4}
              fullWidth
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleReopenTicket} variant="contained" color="primary">
            Reopen
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Ticket Form */}
      <CreateTicketForm
        open={createFormOpen}
        onClose={() => setCreateFormOpen(false)}
        onTicketCreated={(newTicket) => {
          setTickets([...tickets, newTicket]);
          setCreateFormOpen(false);
        }}
      />
    </Container>
  );
};

export default Tickets; 
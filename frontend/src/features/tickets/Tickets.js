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
  Grid
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { ticketService } from '../../services/ticketService';
import { userService } from '../../services/userService';
import CreateTicketForm from '../../components/forms/CreateTicketForm';
import { 
  PRIORITY_OPTIONS, 
  STATUS_OPTIONS, 
  PRIORITY_COLORS, 
  STATUS_COLORS 
} from '../../constants/ticketConstants';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(''); // 'view', 'edit', 'assign', 'delete'
  const [createFormOpen, setCreateFormOpen] = useState(false);
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
        const [ticketsData, usersData] = await Promise.all([
          ticketService.getTickets(),
          userService.getUsers()
        ]);
        
        // Debug logging
        console.log('Tickets component - ticketsData:', ticketsData);
        console.log('Tickets component - ticketsData type:', typeof ticketsData);
        console.log('Tickets component - ticketsData is array:', Array.isArray(ticketsData));
        
        // Ensure ticketsData is an array
        const ticketsArray = Array.isArray(ticketsData) ? ticketsData : 
                           (ticketsData?.content ? ticketsData.content : 
                           (ticketsData?.data ? ticketsData.data : []));
        
        console.log('Tickets component - ticketsArray:', ticketsArray);
        
        // Ensure usersData is an array
        const usersArray = Array.isArray(usersData) ? usersData : 
                          (usersData?.content ? usersData.content : 
                          (usersData?.data ? usersData.data : []));
        
        setTickets(ticketsArray);
        setUsers(usersArray.filter(u => u.role === 'TECHNICIAN' || u.role === 'ADMIN'));
      } catch (err) {
        setError('Failed to load tickets data');
        console.error('Error loading data:', err);
        setTickets([]);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter tickets - ensure tickets is always an array
  const filteredTickets = (Array.isArray(tickets) ? tickets : []).filter(ticket => {
    if (filters.status && ticket.status !== filters.status) return false;
    if (filters.priority && ticket.priority !== filters.priority) return false;
    if (filters.assignedTo && ticket.assignedTo?.id !== filters.assignedTo) return false;
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
    try {
      setLoading(true);
      const ticketsData = await ticketService.getTickets();
      
      // Ensure ticketsData is an array
      const ticketsArray = Array.isArray(ticketsData) ? ticketsData : 
                         (ticketsData?.content ? ticketsData.content : 
                         (ticketsData?.data ? ticketsData.data : []));
      
      setTickets(ticketsArray);
    } catch (err) {
      setError('Failed to refresh tickets');
      console.error('Refresh error:', err);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            Ticket Management
          </Typography>
          <Box>
            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh} sx={{ mr: 1 }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
                         <Button
               variant="contained"
               startIcon={<AddIcon />}
               onClick={() => setCreateFormOpen(true)}
             >
               New Ticket
             </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    label="Status"
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    {statuses.map(status => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={filters.priority}
                    label="Priority"
                    onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                  >
                    <MenuItem value="">All Priorities</MenuItem>
                    {priorities.map(priority => (
                      <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Assigned To</InputLabel>
                  <Select
                    value={filters.assignedTo}
                    label="Assigned To"
                    onChange={(e) => setFilters({ ...filters, assignedTo: e.target.value })}
                  >
                    <MenuItem value="">All Technicians</MenuItem>
                    {users.map(user => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.displayName || user.username}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

                 {/* Tickets Table */}
         <TableContainer component={Paper}>
           <Table>
             <TableHead>
               <TableRow>
                 <TableCell>ID</TableCell>
                 <TableCell>Title</TableCell>
                 <TableCell>Created By</TableCell>
                 <TableCell>Assigned To</TableCell>
                 <TableCell>Priority</TableCell>
                 <TableCell>Status</TableCell>
                 <TableCell>Created Date</TableCell>
                 <TableCell>Actions</TableCell>
               </TableRow>
             </TableHead>
             <TableBody>
               {filteredTickets.length === 0 ? (
                 <TableRow>
                   <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                     <Typography variant="body1" color="text.secondary">
                       {tickets.length === 0 ? 'No tickets found. Create your first ticket!' : 'No tickets match the current filters.'}
                     </Typography>
                   </TableCell>
                 </TableRow>
               ) : (
                                  filteredTickets
                   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                   .map((ticket) => (
                     <TableRow key={ticket.id}>
                       <TableCell>{ticket.id}</TableCell>
                       <TableCell>{ticket.title}</TableCell>
                       <TableCell>{ticket.createdBy?.displayName || ticket.createdBy?.username}</TableCell>
                       <TableCell>
                         {ticket.assignedTo ? (
                           ticket.assignedTo.displayName || ticket.assignedTo.username
                         ) : (
                           <Chip label="Unassigned" size="small" color="default" />
                         )}
                       </TableCell>
                       <TableCell>
                         <Chip 
                           label={ticket.priority} 
                           size="small" 
                           color={getPriorityColor(ticket.priority)}
                         />
                       </TableCell>
                       <TableCell>
                         <Chip 
                           label={ticket.status} 
                           size="small" 
                           color={getStatusColor(ticket.status)}
                         />
                       </TableCell>
                       <TableCell>
                         {new Date(ticket.createdAt).toLocaleDateString()}
                       </TableCell>
                       <TableCell>
                         <Tooltip title="View Details">
                           <IconButton 
                             size="small" 
                             onClick={() => handleDialogOpen('view', ticket)}
                           >
                             <ViewIcon />
                           </IconButton>
                         </Tooltip>
                         <Tooltip title="Edit Ticket">
                           <IconButton 
                             size="small" 
                             onClick={() => handleDialogOpen('edit', ticket)}
                           >
                             <EditIcon />
                           </IconButton>
                         </Tooltip>
                         <Tooltip title="Assign Ticket">
                           <IconButton 
                             size="small" 
                             onClick={() => handleDialogOpen('assign', ticket)}
                           >
                             <AssignmentIcon />
                           </IconButton>
                         </Tooltip>
                         <Tooltip title="Delete Ticket">
                           <IconButton 
                             size="small" 
                             color="error"
                             onClick={() => handleDialogOpen('delete', ticket)}
                           >
                             <DeleteIcon />
                           </IconButton>
                         </Tooltip>
                       </TableCell>
                     </TableRow>
                   ))
               )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredTickets.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        </TableContainer>
      </Box>

      {/* Dialogs */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogType === 'view' && 'Ticket Details'}
          {dialogType === 'edit' && 'Edit Ticket'}
          {dialogType === 'assign' && 'Assign Ticket'}
          {dialogType === 'delete' && 'Delete Ticket'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'view' && selectedTicket && (
            <Box>
              <Typography variant="h6" gutterBottom>{selectedTicket.title}</Typography>
              <Typography variant="body1" paragraph>{selectedTicket.description}</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Created By:</Typography>
                  <Typography>{selectedTicket.createdBy?.displayName || selectedTicket.createdBy?.username}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Assigned To:</Typography>
                  <Typography>
                    {selectedTicket.assignedTo ? 
                      (selectedTicket.assignedTo.displayName || selectedTicket.assignedTo.username) : 
                      'Unassigned'
                    }
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Priority:</Typography>
                  <Chip label={selectedTicket.priority} color={getPriorityColor(selectedTicket.priority)} />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Status:</Typography>
                  <Chip label={selectedTicket.status} color={getStatusColor(selectedTicket.status)} />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Created:</Typography>
                  <Typography>{new Date(selectedTicket.createdAt).toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Updated:</Typography>
                  <Typography>{new Date(selectedTicket.updatedAt).toLocaleString()}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}

          {(dialogType === 'edit' || dialogType === 'assign') && (
            <Box sx={{ pt: 1 }}>
              {dialogType === 'edit' && (
                <>
                  <TextField
                    fullWidth
                    label="Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    margin="normal"
                    multiline
                    rows={4}
                  />
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={formData.priority}
                      label="Priority"
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      {priorities.map(priority => (
                        <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      label="Status"
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      {statuses.map(status => (
                        <MenuItem key={status} value={status}>{status}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              )}
              
              {(dialogType === 'assign' || dialogType === 'edit') && (
                <FormControl fullWidth margin="normal">
                  <InputLabel>Assign To</InputLabel>
                  <Select
                    value={formData.assignedTo}
                    label="Assign To"
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  >
                    <MenuItem value="">Unassigned</MenuItem>
                    {users.map(user => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.displayName || user.username}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          )}

          {dialogType === 'delete' && (
            <Typography>
              Are you sure you want to delete ticket "{selectedTicket?.title}"? This action cannot be undone.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          {dialogType === 'edit' && (
            <Button onClick={handleUpdateTicket} variant="contained">
              Update Ticket
            </Button>
          )}
          {dialogType === 'assign' && (
            <Button onClick={handleAssignTicket} variant="contained">
              Assign Ticket
            </Button>
          )}
          {dialogType === 'delete' && (
            <Button onClick={handleDeleteTicket} variant="contained" color="error">
              Delete Ticket
            </Button>
          )}
                 </DialogActions>
       </Dialog>

       {/* Create Ticket Form */}
       <CreateTicketForm
         open={createFormOpen}
         onClose={() => setCreateFormOpen(false)}
         onTicketCreated={(newTicket) => {
           setTickets([newTicket, ...tickets]);
           setCreateFormOpen(false);
         }}
       />
     </Container>
   );
 };

export default Tickets; 
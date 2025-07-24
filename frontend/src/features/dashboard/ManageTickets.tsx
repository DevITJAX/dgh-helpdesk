import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { ticketService } from '../../services/ticketService';

const ManageTickets = () => {
  console.log('ManageTickets component loading...');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load tickets on component mount
  useEffect(() => {
    console.log('useEffect triggered, calling loadTickets');
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Loading tickets...');
      const response = await ticketService.getAllTickets();
      console.log('Received response:', response);
      console.log('Response type:', typeof response);
      console.log('Response.content:', response.content);
      console.log('Response keys:', Object.keys(response));
      
      // Handle different response structures
      let ticketsArray = [];
      if (response.content && Array.isArray(response.content)) {
        ticketsArray = response.content;
      } else if (Array.isArray(response)) {
        ticketsArray = response;
      } else if (response.data && Array.isArray(response.data)) {
        ticketsArray = response.data;
      }
      
      setTickets(ticketsArray);
      console.log('Set tickets array:', ticketsArray);
      console.log('Tickets count:', ticketsArray.length);
    } catch (err) {
      console.error('Error loading tickets:', err);
      setError('Failed to load tickets: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  console.log('Rendering ManageTickets, loading:', loading, 'tickets:', tickets.length, 'error:', error);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Tickets
      </Typography>
      
      <Button 
        variant="contained" 
        startIcon={<RefreshIcon />} 
        onClick={loadTickets}
        sx={{ mb: 2 }}
      >
        Refresh Tickets
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 3 }}>
                      No tickets found
                    </TableCell>
                  </TableRow>
                ) : (
                  tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>{ticket.id}</TableCell>
                      <TableCell>{ticket.title}</TableCell>
                      <TableCell>{ticket.status}</TableCell>
                      <TableCell>{ticket.priority}</TableCell>
                      <TableCell>{ticket.category}</TableCell>
                      <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default ManageTickets;

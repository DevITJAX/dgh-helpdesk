import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import { ticketService } from '../../services/ticketService';
import { PRIORITY_OPTIONS, PRIORITY_LABELS, CATEGORY_OPTIONS, CATEGORY_LABELS } from '../../constants/ticketConstants';

const CreateTicketForm = ({ open, onClose, onTicketCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    category: 'GENERAL'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const priorities = PRIORITY_OPTIONS;
  const categories = CATEGORY_OPTIONS;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newTicket = await ticketService.createTicket(formData);
      onTicketCreated(newTicket);
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'MEDIUM',
      category: 'GENERAL'
    });
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Ticket</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            margin="normal"
            required
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            multiline
            rows={4}
            required
            disabled={loading}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              label="Category"
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              disabled={loading}
            >
              {categories.map(category => (
                <MenuItem key={category} value={category}>
                  {CATEGORY_LABELS[category]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Priority</InputLabel>
            <Select
              value={formData.priority}
              label="Priority"
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              disabled={loading}
            >
              {priorities.map(priority => (
                <MenuItem key={priority} value={priority}>
                  {PRIORITY_LABELS[priority]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Creating...' : 'Create Ticket'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateTicketForm; 
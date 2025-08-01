import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Container
} from '@mui/material';

const Users = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage system users and permissions
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Users Overview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          User management features will be implemented here.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Users; 
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Container
} from '@mui/material';

const Equipment = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Equipment Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage IT equipment inventory
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Equipment Overview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Equipment management features will be implemented here.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Equipment; 
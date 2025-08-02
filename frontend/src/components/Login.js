import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Avatar
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    username: 'admin',
    password: 'admin123'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState(null);
  
  const { login, isAuthenticated, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated - REMOVED DOUBLE NAVIGATION
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear error when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Show auth context errors
  useEffect(() => {
    if (error) {
      setGlobalError(error);
    }
  }, [error]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear global error when user starts typing
    if (globalError) {
      setGlobalError(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const performLogin = async () => {
    console.log('performLogin called with:', formData);
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    setIsSubmitting(true);
    setGlobalError(null);

    try {
      console.log('Calling login function...');
      const result = await login(formData.username, formData.password);
      console.log('Login result:', result);
      
      if (!result.success) {
        setGlobalError(result.error || 'Login failed. Please try again.');
        console.log('Login failed:', result.error);
      } else {
        console.log('Login successful, should redirect to dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Better error handling for different scenarios
      if (error.message?.includes('Network Error') || error.code === 'ERR_NETWORK') {
        setGlobalError('Cannot connect to server. Please check if the backend is running.');
      } else if (error.response?.status === 401) {
        setGlobalError('Invalid username or password.');
      } else if (error.response?.status === 500) {
        setGlobalError('Server error. Please try again later.');
      } else {
        setGlobalError(error.message || 'Unexpected error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    console.log('handleSubmit called');
    e.preventDefault();
    e.stopPropagation();
    console.log('Form submission prevented');
    
    await performLogin();
  };

  const handleButtonClick = async (e) => {
    console.log('Button clicked');
    e.preventDefault();
    e.stopPropagation();
    
    await performLogin();
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: 400
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlined />
          </Avatar>
          
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            DGH HelpDesk
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            Sign in to access the IT HelpDesk Management System
          </Typography>

          {globalError && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {globalError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleInputChange}
              error={!!errors.username}
              helperText={errors.username}
              disabled={isSubmitting}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password}
              disabled={isSubmitting}
            />
            
            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={isSubmitting}
              onClick={handleButtonClick}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign In'
              )}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 
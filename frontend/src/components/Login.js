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
import dghLogo from '../dgh_logo.png';

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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        p: 2
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={8}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: 400,
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* DGH Logo - Centered */}
          <Box 
            sx={{ 
              mb: 4, 
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Avatar
              src={dghLogo}
              alt="DGH Logo"
              sx={{ 
                width: 100, 
                height: 100, 
                mb: 3,
                borderRadius: '16px',
                boxShadow: 4,
                border: '3px solid #1976d2'
              }}
            />
            <Typography 
              component="h1" 
              variant="h4" 
              sx={{ 
                fontWeight: 'bold', 
                color: 'primary.main',
                textAlign: 'center',
                mb: 1
              }}
            >
              DGH HelpDesk
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                textAlign: 'center',
                fontWeight: 'medium'
              }}
            >
              Direction Générale de l'Hydraulique
            </Typography>
          </Box>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 4, 
              textAlign: 'center',
              maxWidth: 300
            }}
          >
            Sign in to access the IT HelpDesk Management System
          </Typography>

          {globalError && (
            <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
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
              sx={{ mb: 2 }}
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
              sx={{ mb: 3 }}
            />
            
            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ 
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 2,
                boxShadow: 3
              }}
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
      </Container>
    </Box>
  );
};

export default Login; 
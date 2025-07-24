import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import Login from './Login';
import AdminDashboard from './features/dashboard/AdminDashboard';
import ManageUsers from './features/users/ManageUsers';
import ProtectedRoute from './components/common/ProtectedRoute';
import Root from './Root';

// Create MUI theme with DGH branding
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Professional blue for government
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard/*" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users" 
            element={
              <ProtectedRoute>
                <ManageUsers />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Root />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

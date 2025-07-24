import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { label: 'Home', path: '/dashboard' },
  { label: 'Manage Tickets', path: '/dashboard/tickets' },
  { label: 'Manage Users', path: '/dashboard/users' },
  { label: 'Manage Profile', path: '/dashboard/profile' },
];

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Box component={Link} to="/dashboard" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', mr: 2 }}>
            <img src="/logo192.png" alt="DGH Logo" style={{ height: 40, marginRight: 12 }} />
            <Typography variant="h6" noWrap>
              DGH HelpDesk
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                color={location.pathname === item.path ? 'secondary' : 'inherit'}
                sx={{ mx: 1 }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
          <Button color="inherit" onClick={handleLogout} sx={{ ml: 2 }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout; 
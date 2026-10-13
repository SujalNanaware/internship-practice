import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        <DashboardIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: '.1rem', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          InternDashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" sx={{ textTransform: 'none' }} onClick={() => navigate('/')}>
            Form
          </Button>
          <Button color="inherit" sx={{ textTransform: 'none' }} onClick={() => navigate('/submissions')}>
            Submissions Dashboard
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
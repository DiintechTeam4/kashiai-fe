import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function NavbarForAuth() {
  return (
    <AppBar position="static" style={{backgroundColor: "#ff1100"}}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        
        
        <Box>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
          <Button color="inherit" component={Link} to="/signup">
            Signup
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavbarForAuth;

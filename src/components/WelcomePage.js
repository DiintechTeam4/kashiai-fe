import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';  
import { motion } from 'framer-motion'; 

function WelcomePage() {
  const navigate = useNavigate(); 
  const handleLoginRedirect = () => {
    navigate('/login'); 
  };

  const handleSignupRedirect = () => {
    navigate('/signup'); 
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        flexDirection: 'column',
        textAlign: 'center',
        padding: 2,
      }}
    >
      {}
      <motion.div
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }}   
        transition={{ duration: 1 }}
      >
        <Typography variant="h4" color="#ff1100" gutterBottom>
          Welcome to Kashi AI Dashboard!
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          Please login or sign up to get started.
        </Typography>
      </motion.div>

      {}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '15px' }}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}   
          whileTap={{ scale: 0.95 }}    
        >
          <Button
            variant="contained"
            color="warning"
            sx={{ margin: '10px', minWidth: 150 }}
            onClick={handleLoginRedirect}  
          >
            Login
          </Button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.1 }}   
          whileTap={{ scale: 0.95 }}    
        >
          <Button
            variant="outlined"
            color="primary"
            sx={{ margin: '10px', minWidth: 150 }}
            onClick={handleSignupRedirect}  
          >
            Signup
          </Button>
        </motion.div>
      </motion.div>
    </Box>
  );
}

export default WelcomePage;

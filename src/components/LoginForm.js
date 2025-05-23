import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function LoginForm({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  // const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleLogin = async () => {
    setError('');
    try {
      const response = await fetch(`http://localhost:5000/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      
      localStorage.setItem('token', data.token);
      localStorage.setItem('adminId', data.id);
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <br />
      <Typography variant="h4" gutterBottom>Login</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" style={{backgroundColor: "#ff1100"}} fullWidth onClick={handleLogin}>
        Login
      </Button>
    </Container>
  );
}

export default LoginForm;

import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  
  // const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleSignup = async () => {
    setError('');
    setSuccess(false);
    try {
      const response = await fetch(`http://localhost:5000/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Signup</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">Signup successful! Redirecting to login...</Alert>}
      <TextField
        label="Name"
        fullWidth
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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
      <Button variant="contained" style={{backgroundColor: "#ff1100"}} fullWidth onClick={handleSignup}>
        Signup
      </Button>
    </Container>
  );
}

export default SignupForm;

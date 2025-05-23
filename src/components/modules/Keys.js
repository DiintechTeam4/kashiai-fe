import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';


function APIKeys() {
  const backendUrl = 'http://localhost:5000';
  const navigate = useNavigate();
  const [apiKeys, setApiKeys] = useState({
    openAIKey: '',
    deepgramAPIKey: '',
    lmntAPIKey: '',
  });

  useEffect(() => {
    const fetchApiKeys = async () => {
        const adminId = localStorage.getItem('id'); 
      if (!adminId) {
        console.error('Admin ID not found in localStorage');
        return;
      }
      console.log("adminId"+adminId)
      try {
        const response = await fetch(`${backendUrl}/${adminId}/keys`);
        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setApiKeys({
            openAIKey: data.apiKeys.openAIKey || '',
            deepgramAPIKey: data.apiKeys.deepgramAPIKey || '',
            lmntAPIKey: data.apiKeys.lmntAPIKey || '',
          });
        } else {
          console.error('Failed to fetch API keys');
        }
      } catch (error) {
        console.error('Error fetching API keys:', error);
      }
    };

    fetchApiKeys();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApiKeys((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const adminId = localStorage.getItem('adminId'); 
      if (!adminId) {
        console.error('Admin ID not found in localStorage');
        return;
      }
      console.log("adminId"+adminId)
    try {
      const response = await fetch(`${backendUrl}/${adminId}/keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiKeys),
      });
      if (response.ok) {
        alert('API Keys updated successfully!');
      } else {
        alert('Failed to update API Keys');
      }
    } catch (error) {
      console.error('Error updating API keys:', error);
      alert('An error occurred while updating API Keys.');
    }
  };

  return (
    <div className='flex justify-center items-center'>
    <Box sx={{ maxWidth: 500, mt:5}}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>Manage API Keys</Typography>
          <TextField
            label="OpenAI Key"
            fullWidth
            name="openAIKey"
            value={apiKeys.openAIKey}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            label="Deepgram API Key"
            fullWidth
            name="deepgramAPIKey"
            value={apiKeys.deepgramAPIKey}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            label="LMNT API Key"
            fullWidth
            name="lmntAPIKey"
            value={apiKeys.lmntAPIKey}
            onChange={handleChange}
            margin="normal"
          />
          <Button variant="contained" style={{backgroundColor:"rgb(5, 189, 5)"}} fullWidth onClick={handleSubmit} sx={{ mt: 2 }}>
            Save API Keys
          </Button>
        </CardContent>
      </Card>
    </Box>
    </div>
  );
}

export default APIKeys;

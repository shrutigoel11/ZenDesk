'use client'

import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    console.log('Starting signup process');

    if (typeof window.ethereum === 'undefined') {
      setError('Please install MetaMask to use this feature.');
      return;
    }

    if (!name) {
      setError('Please enter your name.');
      return;
    }

    try {
      console.log('Requesting account access');
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        // Store user information locally (you might want to use a more secure method in production)
        localStorage.setItem('userName', name);
        localStorage.setItem('connectedAddress', accounts[0]);
        
        setSuccess(true);
        console.log('User signed up successfully');
        
        // Redirect to home page after successful signup
        setTimeout(() => router.push('/home'), 2000);
      } else {
        setError('No accounts found. Please check your MetaMask connection.');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setError(`An error occurred during signup: ${error.message}`);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" gutterBottom>
          Sign up with MetaMask
        </Typography>
        <Box component="form" onSubmit={handleSignup} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Account created successfully! Welcome, {name}! Redirecting to home page...
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            Sign Up with MetaMask
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
'use client'

import React, { useState } from 'react';
import { Button, Container, Typography, Box, Paper, Alert } from '@mui/material';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setError('');
    setSuccess(false);

    console.log('Starting login process');

    if (typeof window.ethereum === 'undefined') {
      setError('Please install MetaMask to use this feature.');
      return;
    }

    try {
      console.log('Requesting account access');
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        setSuccess(true);
        console.log('Wallet connected successfully');
        // Store the connected address in localStorage or a state management solution
        localStorage.setItem('connectedAddress', accounts[0]);
        // Redirect to home page after successful connection
        setTimeout(() => router.push('/home'), 2000);
      } else {
        setError('No accounts found. Please check your MetaMask connection.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError(`An error occurred during login: ${error.message}`);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" gutterBottom>
          Connect Your Wallet
        </Typography>
        <Box sx={{ mt: 1, width: '100%' }}>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Wallet connected successfully! Redirecting to home page...
            </Alert>
          )}
          <Button
            onClick={handleLogin}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            Connect Wallet
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
'use client'

import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import { ethers } from 'ethers';
import UserAuthABI from '../../../artifacts/contracts/UserAuth.sol/UserAuth.json';

const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_USERAUTH_CONTRACT_ADDRESS';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (typeof window.ethereum === 'undefined') {
      setError('Please install MetaMask to use this feature.');
      return;
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      const contract = new ethers.Contract(CONTRACT_ADDRESS, UserAuthABI.abi, signer);
      
      const passwordHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(password));
      
      const isLoggedIn = await contract.login(passwordHash);
      
      if (isLoggedIn) {
        console.log('Login successful');
        // Add logic for successful login (e.g., redirect or update state)
      } else {
        setError('Login failed. Please check your password and try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred during login. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            Sign In
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { ethers } from 'ethers';

export default function Login() {
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    // Here you would implement the blockchain interaction for login
    console.log('Login with', address, password);
    // Example: You might use ethers.js to sign a message or interact with a smart contract
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="address"
            label="Ethereum Address"
            name="address"
            autoComplete="address"
            autoFocus
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
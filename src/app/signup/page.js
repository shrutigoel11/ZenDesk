'use client'

import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Alert, Grid } from '@mui/material';
import { ethers } from 'ethers';
import UserAuthABI from '../../../artifacts/contracts/UserAuth.sol/UserAuth.json';

const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_USERAUTH_CONTRACT_ADDRESS';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const generateMnemonic = () => {
    const wallet = ethers.Wallet.createRandom();
    return wallet.mnemonic.phrase;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (typeof window.ethereum === 'undefined') {
      setError('Please install MetaMask to use this feature.');
      return;
    }

    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' }); 
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      const contract = new ethers.Contract(CONTRACT_ADDRESS, UserAuthABI.abi, signer);
      
      const passwordHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(password));
      
      // Assuming your smart contract has a function to register with name and email
      const tx = await contract.registerWithDetails(passwordHash, name, email);
      await tx.wait();
      
      const newMnemonic = generateMnemonic();
      setMnemonic(newMnemonic);
      setSuccess(true);
      console.log('User registered successfully');
    } catch (error) {
      console.error('Error during signup:', error);
      setError('An error occurred during signup. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" gutterBottom>
          Sign up
        </Typography>
        <Box component="form" onSubmit={handleSignup} noValidate sx={{ mt: 1, width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
          </Grid>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Account created successfully! Welcome, {name}!
            </Alert>
          )}
          {mnemonic && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Your Mnemonic Phrase (Save this securely):
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                {mnemonic}
              </Typography>
            </Box>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            Sign Up
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
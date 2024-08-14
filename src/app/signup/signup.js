import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { ethers } from 'ethers';
import UserAuthABI from '../../contracts/UserAuth.json'; // You'll need to create this ABI file

const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS'; // Replace with your deployed contract address

export default function Signup() {
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Create contract instance
      const contract = new ethers.Contract(CONTRACT_ADDRESS, UserAuthABI, signer);
      
      // Hash the password
      const passwordHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(password));
      
      // Call the register function
      const tx = await contract.register(passwordHash);
      await tx.wait();
      
      console.log('User registered successfully');
    } catch (error) {
      console.error('Error during signup:', error);
    }
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
          Sign up
        </Typography>
        <Box component="form" onSubmit={handleSignup} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
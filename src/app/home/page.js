'use client'

import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, Box, Paper, CircularProgress } from '@mui/material';
import Link from 'next/link';
import { ethers } from 'ethers';
import UserAuthABI from '../../../artifacts/contracts/UserAuth.sol/UserAuth.json';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_USERAUTH_CONTRACT_ADDRESS;

export default function Home() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(CONTRACT_ADDRESS, UserAuthABI.abi, signer);

          const isRegistered = await contract.isUserRegistered();
          if (isRegistered) {
            const userName = await contract.getUserName();
            setName(userName);
          }
        } catch (error) {
          console.error('Error checking login status:', error);
        }
      }
      setLoading(false);
    };

    checkLoginStatus();
  }, []);

  if (loading) {
    return (
      <Container component="main" maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!name) {
    return (
      <Container component="main" maxWidth="sm">
        <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h4" gutterBottom>
            Welcome to ZenDesk
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Button
              component={Link}
              href="/login"
              variant="contained"
              sx={{ mb: 2, py: 1.5 }}
            >
              Login
            </Button>
            <Button
              component={Link}
              href="/signup"
              variant="contained"
              sx={{ py: 1.5 }}
            >
              Sign Up
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Hello, {name}! Welcome Back!
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Button
            component={Link}
            href="/wallet"
            variant="contained"
            sx={{ mb: 2, py: 1.5 }}
          >
            Go to Wallet
          </Button>
          <Button
            component={Link}
            href="/marketplace"
            variant="contained"
            sx={{ py: 1.5 }}
          >
            Go to Marketplace
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
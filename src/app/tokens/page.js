'use client';

import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Button, Container, Typography, Box } from '@mui/material';
import styled from '@emotion/styled';

const StyledContainer = styled(Container)`
  min-height: 100vh;
  color: white;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(to bottom, #0a0015, #1a0030);
  padding: 2rem;
`;

const StyledButton = styled(Button)`
  background-color: #ff4d6d;
  color: white;
  &:hover {
    background-color: #ff3d5d;
  }
`;

export default function TokensPage() {
    const [adsenseData, setAdsenseData] = useState(null);
    const [userTokens, setUserTokens] = useState(0);
  
    useEffect(() => {
      fetchAdsenseData();
      fetchUserTokens();
    }, []);
  
    const fetchAdsenseData = async () => {
      try {
        const response = await fetch('/api/adsense?email=user@example.com');
        if (!response.ok) throw new Error('Failed to fetch AdSense data');
        const data = await response.json();
        setAdsenseData(data);
      } catch (error) {
        console.error('Error fetching AdSense data:', error);
      }
    };
  
    const fetchUserTokens = async () => {
      try {
        const response = await fetch('/api/tokens?email=user@example.com');
        if (!response.ok) throw new Error('Failed to fetch user tokens');
        const data = await response.json();
        setUserTokens(data.tokens);
      } catch (error) {
        console.error('Error fetching user tokens:', error);
      }
    };
  
    const handleWatchAd = async () => {
      try {
        const response = await fetch('/api/tokens', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'user@example.com', amount: 1 })
        });
        if (!response.ok) throw new Error('Failed to update tokens');
        fetchUserTokens();
      } catch (error) {
        console.error('Error updating tokens:', error);
      }
    };
  
    const handleBuyTokens = async () => {
      try {
        const response = await fetch('/api/tokens', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'user@example.com', amount: 10 })
        });
        if (!response.ok) throw new Error('Failed to update tokens');
        fetchUserTokens();
      } catch (error) {
        console.error('Error updating tokens:', error);
      }
    };

  if (!adsenseData) return <div>Loading...</div>;

  const barData = {
    labels: ['Impressions', 'Clicks', 'Earnings'],
    datasets: [{
      data: [
        adsenseData.rows[0].cells[0].value,
        adsenseData.rows[0].cells[1].value,
        adsenseData.rows[0].cells[2].value
      ],
      backgroundColor: ['#ff4d6d', '#4d79ff', '#4dff91']
    }]
  };

  const pieData = {
    labels: ['Impressions', 'Clicks'],
    datasets: [{
      data: [
        adsenseData.rows[0].cells[0].value,
        adsenseData.rows[0].cells[1].value
      ],
      backgroundColor: ['#ff4d6d', '#4d79ff']
    }]
  };

  return (
    <StyledContainer>
      <Typography variant="h2" gutterBottom>Tokens Page</Typography>
      <Box mb={4}>
        <Typography variant="h4">Your Tokens: {userTokens}</Typography>
        <StyledButton onClick={handleWatchAd}>Watch Ad for Token</StyledButton>
        <StyledButton onClick={handleBuyTokens}>Buy Tokens</StyledButton>
      </Box>
      <Box mb={4}>
        <Typography variant="h4">Ad Performance</Typography>
        <Bar data={barData} />
      </Box>
      <Box mb={4}>
        <Typography variant="h4">Impressions vs Clicks</Typography>
        <Pie data={pieData} />
      </Box>
    </StyledContainer>
  );
}
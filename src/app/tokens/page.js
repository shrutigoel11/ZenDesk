'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bar, Pie, Line, Radar } from 'react-chartjs-2';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Button, Container, Typography, Box, Grid, Paper, Slider, Switch,
  FormControlLabel, Card, CardContent, IconButton, Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import MovieIcon from '@mui/icons-material/Movie';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
} from 'chart.js';

ChartJS.register(
  ArcElement,
  ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
);

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
});

const TokenCard = ({ value, onIncrease, onDecrease }) => (
  <Card elevation={3}>
    <CardContent>
      <Typography variant="h4" align="center">{value}</Typography>
      <Box display="flex" justifyContent="center" mt={2}>
        <IconButton onClick={onDecrease} color="secondary">
          <RemoveIcon />
        </IconButton>
        <IconButton onClick={onIncrease} color="primary">
          <AddIcon />
        </IconButton>
      </Box>
    </CardContent>
  </Card>
);

const AnimatedNumber = motion(Typography);

export default function EnhancedTokensDashboard() {
  const [userTokens, setUserTokens] = useState(100);
  const [adPerformance, setAdPerformance] = useState({ impressions: 1000, clicks: 50, earnings: 500 });
  const [tokenHistory, setTokenHistory] = useState([65, 59, 80, 81, 56, 55]);
  const [performanceMetrics, setPerformanceMetrics] = useState([65, 59, 90, 81, 56]);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    // Simulating data fetching
    const fetchData = async () => {
      // In a real app, you would fetch data from your API here
    };
    fetchData();
  }, []);

  const handleWatchAd = () => {
    setUserTokens(prev => prev + 1);
    setAdPerformance(prev => ({
      ...prev,
      impressions: prev.impressions + 1,
      clicks: prev.clicks + 1,
      earnings: +(prev.earnings + 0.5).toFixed(2)
    }));
    setTokenHistory(prev => [...prev.slice(1), userTokens + 1]);
  };

  const handleBuyTokens = (amount) => {
    setUserTokens(prev => prev + amount);
    setTokenHistory(prev => [...prev.slice(1), userTokens + amount]);
  };

  const handleTokenSliderChange = (event, newValue) => {
    setUserTokens(newValue);
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const theme = darkMode ? darkTheme : lightTheme;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: theme.palette.divider
        },
        ticks: { color: theme.palette.text.primary }
      },
      x: {
        grid: {
          color: theme.palette.divider
        },
        ticks: { color: theme.palette.text.primary }
      }
    },
    plugins: {
      legend: {
        labels: { color: theme.palette.text.primary }
      }
    }
  };

  const barData = {
    labels: ['Impressions', 'Clicks', 'Earnings'],
    datasets: [{
      label: 'Ad Performance',
      data: [adPerformance.impressions, adPerformance.clicks, adPerformance.earnings],
      backgroundColor: [theme.palette.primary.main, theme.palette.secondary.main, theme.palette.success.main]
    }]
  };

  const pieData = {
    labels: ['Impressions', 'Clicks'],
    datasets: [{
      data: [adPerformance.impressions, adPerformance.clicks],
      backgroundColor: [theme.palette.primary.main, theme.palette.secondary.main]
    }]
  };

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Token Balance Over Time',
      data: tokenHistory,
      fill: true,
      backgroundColor: theme.palette.primary.main + '40',
      borderColor: theme.palette.primary.main,
      tension: 0.4
    }]
  };

  const radarData = {
    labels: ['Engagement', 'Retention', 'Conversion', 'Virality', 'Revenue'],
    datasets: [{
      label: 'Current Performance',
      data: performanceMetrics,
      fill: true,
      backgroundColor: theme.palette.secondary.main + '40',
      borderColor: theme.palette.secondary.main,
      pointBackgroundColor: theme.palette.secondary.main,
      pointBorderColor: theme.palette.background.paper,
      pointHoverBackgroundColor: theme.palette.background.paper,
      pointHoverBorderColor: theme.palette.secondary.main
    }]
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h2" component={motion.h2} initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
            Tokens Dashboard
          </Typography>
          <FormControlLabel
            control={<Switch checked={darkMode} onChange={toggleDarkMode} />}
            label="Dark Mode"
          />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h6" align="center" gutterBottom>Your Tokens</Typography>
              <AnimatedNumber
                variant="h2"
                align="center"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 100 }}
              >
                {userTokens}
              </AnimatedNumber>
              <Slider
                value={userTokens}
                onChange={handleTokenSliderChange}
                aria-labelledby="token-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={0}
                max={200}
                sx={{ mt: 4 }}
              />
              <Box display="flex" justifyContent="center" mt={2}>
                <Tooltip title="Watch Ad for Token">
                  <IconButton onClick={handleWatchAd} color="primary" size="large">
                    <MovieIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Buy 10 Tokens">
                  <IconButton onClick={() => handleBuyTokens(10)} color="secondary" size="large">
                    <ShoppingCartIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>Ad Performance</Typography>
              <Box height={300}>
                <Bar data={barData} options={chartOptions} />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>Impressions vs Clicks</Typography>
              <Box height={300}>
                <Pie data={pieData} options={{...chartOptions, aspectRatio: 1}} />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>Token Balance Trend</Typography>
              <Box height={300}>
                <Line data={lineData} options={chartOptions} />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
              <Box height={400}>
                <Radar data={radarData} options={{...chartOptions, scales: undefined}} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
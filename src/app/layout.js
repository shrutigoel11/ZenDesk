'use client'

import { useState, useEffect } from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './globals.css';
import { ThemeProvider } from '@mui/material/styles';
import { AppBar, Toolbar, Button, Typography, Box, Drawer, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import Link from 'next/link';
import { createTheme } from '@mui/material/styles';
import { usePathname } from 'next/navigation';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TokenIcon from '@mui/icons-material/Token';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const theme = createTheme();

const drawerWidth = 240;

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [name, setName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const address = localStorage.getItem('userAddress');
      if (address) {
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'isRegistered', address }),
        });
        const data = await response.json();
        setIsLoggedIn(data.isRegistered);
        if (data.isRegistered) {
          setName(address.slice(0, 6) + '...' + address.slice(-4));
        }
      }
    };
    checkLoginStatus();
  }, []);

  const isHomePage = pathname === '/home';
  const isAdminPage = pathname === '/admin';
  const showDrawer = ['/wallet', '/marketplace', '/get-tokens'].includes(pathname);

  const drawerContent = (
    <List>
      {[
        { text: 'Home', icon: <HomeIcon />, href: '/home' },
        { text: 'Wallet', icon: <AccountBalanceWalletIcon />, href: '/wallet' },
        { text: 'Get Tokens', icon: <TokenIcon />, href: '/get-tokens' },
        { text: 'Marketplace', icon: <StorefrontIcon />, href: '/marketplace' },
      ].map((item) => (
        <ListItem button key={item.text} component={Link} href={item.href}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          {isHomePage ? (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                <Button component={Link} href="/admin" startIcon={<AdminPanelSettingsIcon />}>
                  Admin
                </Button>
              </Box>
              <Typography variant="h3" component="h1" gutterBottom>
                Hello, {isLoggedIn ? name : 'Guest'}!
              </Typography>
              <Box>
                <Button component={Link} href="/wallet" variant="contained" sx={{ m: 1 }}>
                  Wallet
                </Button>
                <Button component={Link} href="/marketplace" variant="contained" sx={{ m: 1 }}>
                  Marketplace
                </Button>
              </Box>
            </Box>
          ) : isAdminPage ? (
            <Box>{children}</Box>
          ) : showDrawer ? (
            <Box sx={{ display: 'flex' }}>
              <Drawer
                variant="permanent"
                sx={{
                  width: drawerWidth,
                  flexShrink: 0,
                  '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                  },
                }}
              >
                {drawerContent}
              </Drawer>
              <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                {children}
              </Box>
            </Box>
          ) : (
            <Box>
              <AppBar position="static">
                <Toolbar>
                  {isLoggedIn ? (
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                      Welcome, {name}
                    </Typography>
                  ) : (
                    <>
                      <Button color="inherit" component={Link} href="/login">Login</Button>
                      <Button color="inherit" component={Link} href="/signup">Signup</Button>
                    </>
                  )}
                </Toolbar>
              </AppBar>
              <Box sx={{ p: 3 }}>{children}</Box>
            </Box>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
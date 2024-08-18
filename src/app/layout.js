'use client'

import { useState, useEffect } from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './globals.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AppBar, Toolbar, Button, Typography, Box, Drawer, List, ListItem, ListItemText, ListItemIcon, Container, CssBaseline, IconButton } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TokenIcon from '@mui/icons-material/Token';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MenuIcon from '@mui/icons-material/Menu';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#ffffff',
    },
  },
});

const drawerWidth = 240;

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [name, setName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <Box sx={{ mt: 2 }}>
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
    </Box>
  );

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
              <Toolbar>
                {showDrawer && (
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { sm: 'none' } }}
                  >
                    <MenuIcon />
                  </IconButton>
                )}
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                  {isLoggedIn ? `Welcome, ${name}` : 'DApp Platform'}
                </Typography>
                {!isLoggedIn && (
                  <>
                    <Button color="inherit" component={Link} href="/login">Login</Button>
                    <Button color="inherit" component={Link} href="/signup">Signup</Button>
                  </>
                )}
              </Toolbar> */}
            {/* </AppBar> */}
            {showDrawer && (
              <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
              >
                <Drawer
                  variant="temporary"
                  open={mobileOpen}
                  onClose={handleDrawerToggle}
                  ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                  }}
                  sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                  }}
                >
                  {drawerContent}
                </Drawer>
                <Drawer
                  variant="permanent"
                  sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                  }}
                  open
                >
                  {drawerContent}
                </Drawer>
              </Box>
            )}
            <Box component="main" sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` }, display: 'flex', flexDirection: 'column' }}>
              <Toolbar />
              <Container maxWidth={false} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 0 }}>
                {isHomePage ? (
                  <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    {isLoggedIn && (
                      <Box sx={{ position: 'absolute', top: 80, right: 24 }}>
                        <Button component={Link} href="/admin" startIcon={<AdminPanelSettingsIcon />} variant="outlined">
                          Admin
                        </Button>
                      </Box>
                    )}
                    <Typography variant="h3" component="h1" gutterBottom>
                      Hello, {isLoggedIn ? name : 'Guest'}!
                    </Typography>
                    <Box sx={{ mt: 4 }}>
                      <Button component={Link} href="/wallet" variant="contained" sx={{ m: 1 }}>
                        Wallet
                      </Button>
                      <Button component={Link} href="/marketplace" variant="contained" sx={{ m: 1 }}>
                        Marketplace
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    {children}
                  </Box>
                )}
              </Container>
            </Box>
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
}
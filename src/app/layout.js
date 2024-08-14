import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './globals.css';
import ThemeProvider from './ThemeProvider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Link from 'next/link';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AppBar position="static">
            <Toolbar>
              <Button color="inherit" component={Link} href="/">Home</Button>
              <Button color="inherit" component={Link} href="/wallet">Wallet</Button>
              <Button color="inherit" component={Link} href="/marketplace">Marketplace</Button>
              <Button color="inherit" component={Link} href="/login">Login</Button>
              <Button color="inherit" component={Link} href="/signup">Signup</Button>
            </Toolbar>
          </AppBar>
          <main style={{ padding: '20px' }}>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
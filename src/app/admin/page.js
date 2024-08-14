'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { 
  Typography, 
  Button, 
  TextField, 
  Box, 
  Container, 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const ADMIN_ADDRESS = '0xE22B6D3e3Ccfe6dc83107453a46B6E88f7eeD348';

export default function AdminPage() {
  const [address, setAddress] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAddress(address);
        setIsAdmin(address.toLowerCase() === ADMIN_ADDRESS.toLowerCase());
        if (address.toLowerCase() === ADMIN_ADDRESS.toLowerCase()) {
          fetchUsers();
        }
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      }
    } else {
      console.log('Please install MetaMask!');
    }
  };

  const fetchUsers = async () => {
    // In a real application, you would fetch this data from your backend
    // This is just a mock-up
    setUsers([
      { id: 1, address: '0x123...', tokens: 100 },
      { id: 2, address: '0x456...', tokens: 200 },
      { id: 3, address: '0x789...', tokens: 300 },
    ]);
  };

  const handleDeleteUser = (userId) => {
    // In a real application, you would call your backend to delete the user
    setUsers(users.filter(user => user.id !== userId));
  };

  if (!isAdmin) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Admin Access Denied
          </Typography>
          <Typography variant="body1">
            You do not have permission to access this page.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" gutterBottom>
          Connected as: {address}
        </Typography>
        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User Address</TableCell>
                <TableCell align="right">Tokens</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell component="th" scope="row">
                    {user.address}
                  </TableCell>
                  <TableCell align="right">{user.tokens}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleDeleteUser(user.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Total Users: {users.length}
        </Typography>
      </Box>
    </Container>
  );
}
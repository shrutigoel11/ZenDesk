'use client';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { alchemy } from '../utils/alchemy';
import { getContract } from '../utils/contracts';
import { 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Alert,
  Box,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

// Simulated backend
const backend = {
  users: {},
  addTokens: (address, amount) => {
    if (!backend.users[address]) {
      backend.users[address] = { tokens: 0 };
    }
    backend.users[address].tokens += amount;
    return backend.users[address].tokens;
  },
  getTokens: (address) => {
    return backend.users[address]?.tokens || 0;
  }
};

export default function Wallet() {
  const [balance, setBalance] = useState('0');
  const [address, setAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [tokenBalances, setTokenBalances] = useState([]);
  const [userTokens, setUserTokens] = useState(0);
  const [openAddTokensDialog, setOpenAddTokensDialog] = useState(false);
  const [tokenAmount, setTokenAmount] = useState('');

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            setIsConnected(true);
            fetchWalletData(accounts[0]);
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      }
    };

    checkConnection();
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAddress(address);
        setIsConnected(true);
        fetchWalletData(address);
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      }
    } else {
      console.log('Please install MetaMask!');
    }
  };

  const disconnectWallet = () => {
    setAddress('');
    setIsConnected(false);
    setBalance('0');
    setTokenBalances([]);
    setUserTokens(0);
  };

  const fetchWalletData = async (address) => {
    try {
      const balance = await alchemy.core.getBalance(address, 'latest');
      setBalance(ethers.utils.formatEther(balance));
      fetchTokenBalances(address);
      const contract = getContract(new ethers.providers.Web3Provider(window.ethereum).getSigner());
      const tokens = await contract.balanceOf(address);
      setUserTokens(ethers.utils.formatEther(tokens));
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    }
  };

  const fetchTokenBalances = async (address) => {
    try {
      const balances = await alchemy.core.getTokenBalances(address);
      const nonZeroBalances = balances.tokenBalances.filter(
        token => token.tokenBalance !== '0'
      );

      const tokenDataPromises = nonZeroBalances.map(async (token) => {
        const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);
        return {
          name: metadata.name,
          symbol: metadata.symbol,
          balance: ethers.utils.formatUnits(token.tokenBalance, metadata.decimals),
          logo: metadata.logo
        };
      });

      const tokenData = await Promise.all(tokenDataPromises);
      setTokenBalances(tokenData);
    } catch (error) {
      console.error('Error fetching token balances:', error);
    }
  };

  const updateUserTokens = (address) => {
    const tokens = backend.getTokens(address);
    setUserTokens(tokens);
  };

  const handleAddTokens = async () => {
    const amount = ethers.utils.parseEther(tokenAmount);
    try {
      const contract = getContract(new ethers.providers.Web3Provider(window.ethereum).getSigner());
      const tx = await contract.mint(address, amount);
      await tx.wait();
      updateUserTokens(address);
      setTokenAmount('');
      setOpenAddTokensDialog(false);
    } catch (error) {
      console.error('Error adding tokens:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Wallet Dashboard
      </Typography>
      {isConnected && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Wallet Connected
        </Alert>
      )}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Account Details
          </Typography>
          <Typography variant="body1">
            <strong>Address:</strong> {address}
          </Typography>
          <Typography variant="body1">
            <strong>ETH Balance:</strong> {balance} ETH
          </Typography>
          <Typography variant="body1">
            <strong>Tokens:</strong> {userTokens}
          </Typography>
          {isConnected && (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => setOpenAddTokensDialog(true)}
              sx={{ mt: 2 }}
            >
              Add Tokens
            </Button>
          )}
        </CardContent>
      </Card>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Token Balances
          </Typography>
          <List>
            {tokenBalances.map((token, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar src={token.logo} alt={token.name}>
                    <AccountBalanceWalletIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={`${token.name} (${token.symbol})`} 
                  secondary={`Balance: ${token.balance}`} 
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
      {!isConnected ? (
        <Button variant="contained" color="primary" onClick={connectWallet}>
          Connect Wallet
        </Button>
      ) : (
        <Button variant="contained" color="secondary" onClick={disconnectWallet}>
          Disconnect Wallet
        </Button>
      )}

      <Dialog open={openAddTokensDialog} onClose={() => setOpenAddTokensDialog(false)}>
        <DialogTitle>Add Tokens</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the number of tokens you want to add to your wallet.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Token Amount"
            type="number"
            fullWidth
            variant="standard"
            value={tokenAmount}
            onChange={(e) => setTokenAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddTokensDialog(false)}>Cancel</Button>
          <Button onClick={handleAddTokens}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
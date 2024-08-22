'use client'

import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import logo from '../logo.png';
import { ethers } from 'ethers';

// Styled components
const Container = styled(motion.div)`
  min-height: 100vh;
  color: white;
  font-family: 'Poppins', sans-serif;
  position: relative;
  z-index: 2;
  background: linear-gradient(to bottom, #0a0015, #1a0030);
`;

const Header = styled(motion.header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 3rem;
  background-color: rgba(10, 0, 21, 0.8);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Logo = styled(motion.div)`
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
  align-items: center;
`;

const NavLink = styled(motion.a)`
  color: white;
  text-decoration: none;
  font-weight: 700;
  font-family: 'Montserrat', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    width: ${props => props.isActive ? '100%' : '0'};
    height: 2px;
    bottom: -5px;
    left: 0;
    background-color: #ff4d6d;
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const MainContent = styled(motion.main)`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled(motion.h1)`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #ff4d6d, #4d79ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
  }
`;

const Button = styled(motion.button)`
  background-color: #ff4d6d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #ff3057;
  }
`;

const BalanceDisplay = styled(motion.div)`
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const TransactionHistory = styled(motion.div)`
  margin-top: 2rem;
`;

const Transaction = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #ff4d6d;
    box-shadow: 0 0 0 2px rgba(255, 77, 109, 0.2);
  }
`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.5, 
      when: "beforeChildren",
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function SepoliaTestnetPage() {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const connectedAddress = localStorage.getItem('connectedAddress');
    if (connectedAddress) {
      setAddress(connectedAddress);
      fetchBalance(connectedAddress);
      fetchTransactions(connectedAddress);
    } else {
      router.push('/');
    }
  }, [router]);

  const fetchBalance = async (address) => {
    setIsLoading(true);
    setError('');
    try {
      const provider = new ethers.providers.JsonRpcProvider('https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID');
      const balance = await provider.getBalance(address);
      setBalance(ethers.utils.formatEther(balance));
    } catch (error) {
        console.error('Detailed error:', error);
        setError('Failed to fetch balance. Please try again.');
      }
  };

  const fetchTransactions = async (address) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=YOUR_ETHERSCAN_API_KEY`);
      const data = await response.json();
      if (data.status === '1') {
        setTransactions(data.result.slice(0, 5)); // Get the last 5 transactions
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to fetch transactions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestTokens = async () => {
    window.open('https://sepoliafaucet.com/', '_blank');
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('https://sepoliafaucet.com/api/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Tokens requested successfully! They should arrive in your wallet soon.');
        fetchBalance(address);
      } else {
        throw new Error(data.message || 'Failed to request tokens');
      }
    } catch (error) {
      console.error('Error requesting tokens:', error);
      setError('Failed to request tokens. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <Logo
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => router.push('/home')}
        >
          <Image src={logo} alt="Zendesk" width={180} height={55} />
        </Logo>
        <Nav>
          <NavLink 
            onClick={() => router.push('/home')} 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            isActive={pathname === '/home'}
          >
            Home
          </NavLink>
          <NavLink 
            onClick={() => router.push('/wallet')} 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            isActive={pathname === '/wallet'}
          >
            Crypto
          </NavLink>
          <NavLink 
            onClick={() => router.push('/marketplace')} 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            isActive={pathname === '/marketplace'}
          >
            Marketplace
          </NavLink>
          <NavLink 
            onClick={() => router.push('/sepolia')} 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            isActive={pathname === '/sepolia'}
          >
            Sepolia Testnet
          </NavLink>
          <NavLink 
            onClick={() => router.push('/tokens')} 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            isActive={pathname === '/tokens'}
          >
            Tokens
          </NavLink>
          <NavLink 
            onClick={() => router.push('/')} 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
          >
            Logout
          </NavLink>
        </Nav>
      </Header>
      <MainContent>
        <Title variants={itemVariants}>Sepolia Testnet</Title>
        <Card variants={itemVariants}>
          <h2>Your Sepolia Address</h2>
          <Input 
            type="text" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your Sepolia address"
          />
          <BalanceDisplay variants={itemVariants}>
            Balance: {isLoading ? 'Loading...' : `${balance} ETH`}
          </BalanceDisplay>
          <Button 
            onClick={handleRequestTokens}
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Request Testnet Tokens'}
          </Button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </Card>
        <Card variants={itemVariants}>
          <h2>Transaction History</h2>
          <TransactionHistory>
            <AnimatePresence>
              {isLoading ? (
                <p>Loading transactions...</p>
              ) : transactions.length > 0 ? (
                transactions.map((tx) => (
                  <Transaction
                    key={tx.hash}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.5 }}
                  >
                    <span>{tx.from === address.toLowerCase() ? 'Sent' : 'Received'}</span>
                    <span>{ethers.utils.formatEther(tx.value)} ETH</span>
                    <span>{tx.from === address.toLowerCase() ? tx.to : tx.from}</span>
                  </Transaction>
                ))
              ) : (
                <p>No transactions found.</p>
              )}
            </AnimatePresence>
          </TransactionHistory>
        </Card>
      </MainContent>
    </Container>
  );
}
'use client'

import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from '../logo.png';

const Container = styled.div`
  min-height: 100vh;
  color: white;
  font-family: 'Poppins', sans-serif;
  position: relative;
  z-index: 2;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 3rem;
  background-color: rgba(10, 0, 21, 0.8);
  backdrop-filter: blur(10px);
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
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
`;

const LogoutButton = styled(motion.button)`
  background-color: #ff4d6d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-weight: 700;
  cursor: pointer;
`;

const MainContent = styled.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #ff4d6d, #4d79ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.8);
`;

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

export default function HomePage() {
  const [address, setAddress] = useState('');
  const router = useRouter();

  useEffect(() => {
    const connectedAddress = localStorage.getItem('connectedAddress');
    if (connectedAddress) {
      setAddress(connectedAddress);
    } else {
      router.push('/');
    }
  }, [router]);

  const handleNavigation = (page) => {
    router.push(`/${page}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('connectedAddress');
    router.push('/');
  };

  return (
    <Container>
      <Header>
        <Logo>
          <Image src={logo} alt="Zendesk" width={80} height={45} />
        </Logo>
        <Nav>
          <NavLink onClick={() => handleNavigation('wallet')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Wallet
          </NavLink>
          <NavLink onClick={() => handleNavigation('marketplace')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Marketplace
          </NavLink>
          <NavLink onClick={() => handleNavigation('tokens')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Tokens
          </NavLink>
          <LogoutButton onClick={handleLogout} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Logout
          </LogoutButton>
        </Nav>
      </Header>
      <MainContent>
        <Title>Welcome to ZenDesk</Title>
        <Subtitle>Connected Address: {address}</Subtitle>
        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Your Dashboard</h2>
          <p>Here you can view your NFTs, manage your wallet, and explore the marketplace.</p>
        </Card>
        {/* Add more content cards here */}
      </MainContent>
    </Container>
  );
}
'use client'

import React, { useEffect, useState, useRef } from 'react';
import styled from '@emotion/styled';
import { keyframes, Global, css } from '@emotion/react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from './logo.png';

const GradientBackground = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #0a0015, #1a0025, #0a0015);
  background-size: 400% 400%;
  z-index: -1;
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const GradientBall = styled(motion.div)`
  position: fixed;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  filter: blur(30px);
  opacity: 0.6;
  animation: ${gradientAnimation} 15s ease infinite;
`;

const Container = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  color: white;
  font-family: 'Playfair Display', serif;
`;

const Header = styled(motion.header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 3rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
  background-color: rgba(10, 0, 21, 0.5);
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
`;

const NavLink = styled(motion.a)`
  color: white;
  text-decoration: none;
  font-weight: 700;
  font-family: 'Montserrat', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: color 0.3s ease;
  position: relative;
  &:hover {
    color: #ffffff;
  }
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: -5px;
    left: 0;
    background-color: #ff4d6d;
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  &:hover::after {
    transform: scaleX(1);
  }
`;

const MainContent = styled(motion.main)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding-top: 80px;
`;

const TextContent = styled.div`
  max-width: 50%;
`;

const Title = styled(motion.h1)`
  font-size: 4.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
  font-family: 'Playfair Display', serif;
`;

const Subtitle = styled(motion.p)`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  font-weight: 300;
  line-height: 1.6;
  font-family: 'Lora', serif;
`;

const Button = styled(motion.button)`
  background-color: #ff4d6d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Montserrat', sans-serif;

  &:hover {
    background-color: #ff3057;
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(255, 77, 109, 0.4);
  }
`;

const loadingLineAnimation = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const LoadingOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #0a0015;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const LoadingLine = styled.div`
  width: 200px;
  height: 4px;
  background-color: #ff4d6d;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, #ffffff, transparent);
    animation: ${loadingLineAnimation} 1.5s infinite;
  }
`;

const MetamaskPopup = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(26, 0, 37, 0.9);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  backdrop-filter: blur(10px);
  max-width: 90%;
  width: 400px;
`;

const PopupText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: white;
  text-align: center;
`;

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMetamaskPopup, setShowMetamaskPopup] = useState(false);
  const { scrollYProgress } = useScroll();
  const router = useRouter();

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const backgroundOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.5]);

  const ball1Y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const ball2Y = useTransform(scrollYProgress, [0, 1], ['50%', '0%']);
  const ball3Y = useTransform(scrollYProgress, [0, 1], ['100%', '50%']);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 3000);
    const connectedAddress = localStorage.getItem('connectedAddress');
    if (connectedAddress) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async () => {
    setIsConnecting(true);

    if (typeof window.ethereum === 'undefined') {
      setShowMetamaskPopup(true);
      setIsConnecting(false);
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        setIsLoggedIn(true);
        localStorage.setItem('connectedAddress', accounts[0]);
        setTimeout(() => router.push('/home'), 2000);
      } else {
        console.error('No accounts found');
      }
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        when: 'beforeChildren',
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Global
        styles={css`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lora:wght@400;700&family=Montserrat:wght@400;700&display=swap');
          body {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            background-color: #0a0015;
            overflow-x: hidden;
          }
        `}
      />
      <GradientBackground style={{ y: backgroundY, opacity: backgroundOpacity }} />
      <GradientBall 
        style={{ 
          top: ball1Y,
          left: '60%',
          background: 'radial-gradient(circle at 30% 30%, #ff4d6d, #ff4d6d00)',
        }} 
      />
      <GradientBall 
        style={{ 
          top: ball2Y, 
          left: '20%',
          background: 'radial-gradient(circle at 30% 30%, #4d79ff, #4d79ff00)',
        }} 
      />
      <GradientBall 
        style={{ 
          top: ball3Y, 
          left: '80%',
          background: 'radial-gradient(circle at 30% 30%, #4dffb8, #4dffb800)',
        }} 
      />
      <AnimatePresence>
        {isLoading && (
          <LoadingOverlay
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LoadingLine />
          </LoadingOverlay>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showMetamaskPopup && (
          <MetamaskPopup
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <PopupText>Please install MetaMask to proceed.</PopupText>
            <Button onClick={() => setShowMetamaskPopup(false)}>Close</Button>
          </MetamaskPopup>
        )}
      </AnimatePresence>
      <Header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 3 }}
      >
        <Logo>
          <Image src={logo} alt="Zendesk" width={180} height={55} />
        </Logo>
        <Nav>
          {['Explore', 'News', 'Developers', 'Designers'].map((item) => (
            <NavLink
              key={item}
              href="#"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item}
            </NavLink>
          ))}
        </Nav>
      </Header>
      <Container>
        <MainContent
          variants={contentVariants}
          initial="hidden"
          animate="visible"
        >
          <TextContent>
            <Title variants={itemVariants}>
              ZenDesk.io
            </Title>
            <Subtitle variants={itemVariants}>
              A collection of unique NFTs showcasing the world's most beautiful gradients for
              your personal and commercial projects. Available at zero cost.
            </Subtitle>
            <Button
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLogin}
            >
              {isConnecting ? "Connecting..." : isLoggedIn ? "Connected" : "Connect with MetaMask"}
            </Button>
          </TextContent>
        </MainContent>
        {/* Add more content sections here for scrolling effect */}
        <Section>
          <h2>Explore Our Collection</h2>
          <p>Discover a world of stunning gradients and unique NFTs.</p>
        </Section>
        <Section>
          <h2>How It Works</h2>
          <p>Learn about our platform and how to get started with ZenDesk.io.</p>
        </Section>
        <Section>
          <h2>Join Our Community</h2>
          <p>Connect with other designers and developers passionate about beautiful gradients.</p>
        </Section>
      </Container>
    </>
  );
}

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  color: white;

  h2 {
    font-size: 3rem;
    margin-bottom: 1rem;
    font-family: 'Playfair Display', serif;
  }

  p {
    font-size: 1.2rem;
    max-width: 600px;
    font-family: 'Lora', serif;
  }
`;
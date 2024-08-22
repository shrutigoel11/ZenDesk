  'use client'

  import React, { useEffect, useState, useRef } from 'react';
  import styled from '@emotion/styled';
  import { keyframes, Global, css } from '@emotion/react';
  import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
  import { useRouter } from 'next/navigation';
  import Image from 'next/image';
  import logo from './logo.png';

  const GradientBackground = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #0a0015;
    z-index: -1;
  `;

  const float = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  `;

  const GradientBall = styled(motion.div)`
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    filter: blur(30px);
    opacity: 0.6;
    animation: ${float} 6s ease-in-out infinite;
  `;

  const Container = styled(motion.div)`
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
    color: white;
    font-family: 'Poppins', sans-serif;
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
    min-height: calc(56vh);
    margin-top: 80px;
  `;

  const TextContent = styled.div`
    max-width: 50%;
  `;

  const Title = styled(motion.h1)`
    font-size: 4.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
  `;

  const Subtitle = styled(motion.p)`
    font-size: 1rem;
    margin-bottom: 2rem;
    font-weight: 300;
    line-height: 1.6;
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

    &:hover {
      background-color: #ff3057;
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(255, 77, 109, 0.4);
    }
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

  const fluidAnimation = keyframes`
    0%, 100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
    25% { border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%; }
    50% { border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%; }
    75% { border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%; }
  `;

  const LoadingShape = styled(motion.div)`
    width: 100px;
    height: 100px;
    background: linear-gradient(45deg, #ff4d6d, #4d79ff, #4dffb8);
    animation: ${fluidAnimation} 10s ease-in-out infinite;
  `;

  const MetamaskSection = styled(motion.div)`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    text-align: left;
  `;

  const MetamaskMessage = styled(motion.p)`
    font-size: 1.2rem;
    margin-bottom: 2rem;
    max-width: 600px;
  `;

  const spinAnimation = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  `;

  const LoadingSpinner = styled.div`
    width: 20px;
    height: 20px;
    border: 2px solid #ffffff;
    border-top: 2px solid transparent;
    border-radius: 50%;
    animation: ${spinAnimation} 1s linear infinite;
  `;

  export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [isConnecting, setIsConnecting] = useState(false);
    const { scrollYProgress } = useScroll();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const metamaskSectionRef = useRef(null);
    const [headerVisible, setHeaderVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
      setTimeout(() => setIsLoading(false), 3000); // Simulating load time
      const connectedAddress = localStorage.getItem('connectedAddress');
      if (connectedAddress) {
        setIsLoggedIn(true);
      }
      const handleScroll = () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY.current) {
          setHeaderVisible(false);
        } else {
          setHeaderVisible(true);
        }
        lastScrollY.current = currentScrollY;
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToMetamask = () => {
      metamaskSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    const randomMovement = () => {
      return Math.random() * 50 - 25; // Reduced range to -25 to 25 for smoother movement
    };

    const ball1X = useTransform(scrollYProgress, [0, 1], ['60%', `${60 + randomMovement()}%`]);
    const ball1Y = useTransform(scrollYProgress, [0, 1], ['20%', `${20 + randomMovement()}%`]);
    const ball2X = useTransform(scrollYProgress, [0, 1], ['20%', `${20 + randomMovement()}%`]);
    const ball2Y = useTransform(scrollYProgress, [0, 1], ['60%', `${60 + randomMovement()}%`]);
    const ball3X = useTransform(scrollYProgress, [0, 1], ['80%', `${80 + randomMovement()}%`]);
    const ball3Y = useTransform(scrollYProgress, [0, 1], ['40%', `${40 + randomMovement()}%`]);

    const ballOpacity = useTransform(scrollYProgress, [0, 1], [0.6, 0.4]);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
      setError('');
      setSuccess(false);
      setIsConnecting(true);

      console.log('Starting login process');

      if (typeof window.ethereum === 'undefined') {
        setError('Please install MetaMask to use this feature.');
        setIsConnecting(false);
        return;
      }

      try {
        console.log('Requesting account access');
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        if (accounts.length > 0) {
          setSuccess(true);
          setIsLoggedIn(true);
          console.log('Wallet connected successfully');
          localStorage.setItem('connectedAddress', accounts[0]);
          setTimeout(() => router.push('/home'), 2000);
        } else {
          setError('No accounts found. Please check your MetaMask connection.');
        }
      } catch (error) {
        console.error('Error during login:', error);
        setError(`An error occurred during login: ${error.message}`);
      } finally {
        setIsConnecting(false);
      }
    };

    return (
      <>
        <Global
          styles={css`
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&family=Montserrat:wght@700&display=swap');
            body {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              background-color: #0a0015;
              overflow-x: hidden;
              scrollbar-width: none;
              -ms-overflow-style: none;
              &::-webkit-scrollbar {
                display: none;
              }
            }
          `}
        />
        <GradientBackground />
        <GradientBall 
          style={{ 
            top: ball1Y,
            left: ball1X,
            background: 'radial-gradient(circle at 30% 30%, #ff4d6d, #ff4d6d00)',
            opacity: ballOpacity,
          }} 
        />
        <GradientBall 
          style={{ 
            top: ball2Y, 
            left: ball2X,
            background: 'radial-gradient(circle at 30% 30%, #4d79ff, #4d79ff00)',
            opacity: ballOpacity,
          }} 
        />
        <GradientBall 
          style={{ 
            top: ball3Y, 
            left: ball3X,
            background: 'radial-gradient(circle at 30% 30%, #4dffb8, #4dffb800)',
            opacity: ballOpacity,
          }} 
        />
        <AnimatePresence>
          {isLoading && (
            <LoadingOverlay
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <LoadingShape />
            </LoadingOverlay>
          )}
        </AnimatePresence>
        <Header
          initial={{ y: 0 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
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
        <Container
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 3 }}
        >
          <MainContent>
            <TextContent>
              <Title
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 3.2 }}
              >
                ZenDesk.io
              </Title>
              <Subtitle
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 3.4 }}
              >
                A bunch of Collectable NFTs Hand crafting unique world most beautiful gradients for
                your personal as well as commercial projects. For a low
                cost of zero dollars and
              </Subtitle>
              <Button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 3.6 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={scrollToMetamask}
              >
                START BUILDING
              </Button>
            </TextContent>
          </MainContent>
          <MetamaskSection
            ref={metamaskSectionRef}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <MetamaskMessage
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </MetamaskMessage>
            <Button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoggedIn ? 0 : 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          onClick={handleLogin}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={isConnecting || isLoggedIn}
        >
          {isConnecting ? <LoadingSpinner /> : isLoggedIn ? "Connected" : "Connect with MetaMask"}
        </Button>
          </MetamaskSection>
        </Container>
      </>
    );
  }
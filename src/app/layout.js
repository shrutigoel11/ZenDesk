'use client'

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/react';
import { motion, AnimatePresence } from 'framer-motion';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0015 0%, #1a0b2e 100%);
  color: white;
`;

const GradientOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 50%, rgba(76, 0, 255, 0.1) 0%, rgba(76, 0, 255, 0) 70%);
  pointer-events: none;
  z-index: 1;
`;

const NotLoggedInMessage = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  z-index: 1000;
`;

export default function RootLayout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkLoginStatus = () => {
      const connectedAddress = localStorage.getItem('connectedAddress');
      setIsLoggedIn(!!connectedAddress);

      if (connectedAddress && pathname === '/') {
        router.push('/home');
      } else if (!connectedAddress && pathname !== '/') {
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
          router.push('/');
        }, 3000);
      }
    };

    checkLoginStatus();

    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, [router, pathname]);

  return (
    <html lang="en">
      <head>
        <title>ZenDesk</title>
        <meta name="description" content="ZenDesk - Your NFT Marketplace" />
      </head>
      <body>
        <Global
          styles={css`
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&family=Montserrat:wght@700&display=swap');
            
            body {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              font-family: 'Poppins', sans-serif;
            }
          `}
        />
        <LayoutContainer>
          <GradientOverlay 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          />
          {children}
          <AnimatePresence>
            {showMessage && (
              <NotLoggedInMessage
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2>You must be logged in to access this page</h2>
                <p>Redirecting to login...</p>
              </NotLoggedInMessage>
            )}
          </AnimatePresence>
        </LayoutContainer>
      </body>
    </html>
  );
}
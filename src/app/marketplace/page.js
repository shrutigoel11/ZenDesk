'use client'

import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import Link from 'next/link';
import { ethers } from 'ethers';
import UserAuthABI from '../../../artifacts/contracts/UserAuth.sol/UserAuth.json';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_USERAUTH_CONTRACT_ADDRESS;

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #0a2a2a;
  background-image: 
    linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  z-index: -1;
`;

const StyledButton = styled(Button)`
  background: rgba(0, 255, 255, 0.1);
  color: #00ffff;
  border: 1px solid #00ffff;
  padding: 8px 16px;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 255, 255, 0.2);
  }
`;

const AnimatedSphere = () => {
  useFrame((state) => {
    state.camera.position.x = Math.sin(state.clock.elapsedTime * 0.3) * 4
    state.camera.position.y = Math.cos(state.clock.elapsedTime * 0.3) * 4
    state.camera.lookAt(0, 0, 0)
  })

  return (
    <Sphere args={[1, 64, 64]}>
      <MeshDistortMaterial
        color="#00ffff"
        attach="material"
        distort={0.3}
        speed={1.5}
        roughness={0}
        metalness={0.8}
      />
    </Sphere>
  )
}

export default function Home() {
  const [name, setName] = useState('');

  useEffect(() => {
    const checkLoginStatus = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(CONTRACT_ADDRESS, UserAuthABI.abi, signer);

          const isRegistered = await contract.isUserRegistered();
          if (isRegistered) {
            const userName = await contract.getUserName();
            setName(userName);
          }
        } catch (error) {
          console.error('Error checking login status:', error);
        }
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <>
      <Background />
      <Container maxWidth="lg" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" sx={{ color: '#00ffff', mb: 1 }}>
              Welcome
            </Typography>
            <Typography variant="h2" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 4 }}>
              SOLARIN<br />HAS<br />ARRIVED
            </Typography>
            <StyledButton variant="outlined">
              Discover
            </StyledButton>
          </Box>
          <Box sx={{ width: '50%', height: '500px' }}>
            <Canvas>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <AnimatedSphere />
            </Canvas>
          </Box>
        </Box>
      </Container>
    </>
  );
}
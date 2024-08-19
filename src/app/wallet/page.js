'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the CryptoPage component with ssr disabled
const CryptoPage = dynamic(() => import('../components/CryptoPage'), { ssr: false });

export default function WalletPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // or return a loading spinner
  }

  return <CryptoPage />;
}
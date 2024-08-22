'use client'

import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import logo from '../logo.png';

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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: #b8b8b8;
`;

const Input = styled.input`
  padding: 0.75rem;
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #ff4d6d;
    box-shadow: 0 0 0 2px rgba(255, 77, 109, 0.2);
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
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
    transform: scale(0);
    transition: transform 0.3s ease-out;
  }

  &:hover::before {
    transform: scale(1);
  }

  &:hover {
    box-shadow: 0 0 15px rgba(255, 77, 109, 0.6);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;

  &:focus {
    outline: none;
    border-color: #ff4d6d;
    box-shadow: 0 0 0 2px rgba(255, 77, 109, 0.2);
  }

  option {
    background: #1a0030;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #4d79ff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #3d69ff;
  }
`;

const NFTGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const NFTCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
  }
`;

const NFTImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const NFTInfo = styled.div`
  padding: 1rem;
`;

const NFTName = styled.h3`
  margin: 0;
  color: #ff4d6d;
`;

const NFTPrice = styled.p`
  margin: 0.5rem 0;
  color: #b8b8b8;
`;

const NFTDetails = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(26, 0, 48, 0.9);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

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
};export default function MarketplacePage() {
  const [name, setName] = useState('');
  const [nfts, setNfts] = useState([]);
  const [price, setPrice] = useState('');
  const [blockchain, setBlockchain] = useState('ETH');
  const [file, setFile] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        console.log('Fetching NFTs...');
        const response = await fetch('/api/opensea-nfts');
        console.log('API response status:', response.status);
        if (!response.ok) {
          throw new Error(`API responded with ${response.status}`);
        }
        const data = await response.json();
        console.log('API response data:', data);
        if (data && data.assets && data.assets.length > 0) {
          console.log('Setting NFTs:', data.assets);
          setNfts(data.assets);
        } else {
          console.error('Unexpected data structure or no assets:', data);
          setNfts([]); // Set to empty array to trigger "No NFTs available" message
        }
      } catch (error) {
        console.error('Error fetching NFTs:', error);
        setNfts([]); // Set to empty array to trigger "No NFTs available" message
      }
    };
  
    fetchNFTs();
  }, []);

  const handleCreateNFT = async (e) => {
    e.preventDefault();
    try {
      // Implement NFT creation logic here
      console.log('Creating NFT:', { name, price, blockchain, file });
      alert("NFT created successfully!");

      // Reset form
      setName('');
      setPrice('');
      setBlockchain('ETH');
      setFile(null);
    } catch (error) {
      console.error('Error creating NFT:', error);
      alert("Error creating NFT. Please try again.");
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
            isActive={pathname === '/home'}
          >
            Home
          </NavLink>
          <NavLink 
            onClick={() => router.push('/wallet')} 
            isActive={pathname === '/wallet'}
          >
            Crypto
          </NavLink>
          <NavLink 
            onClick={() => router.push('/marketplace')} 
            isActive={pathname === '/marketplace'}
          >
            Marketplace
          </NavLink>
          <NavLink 
            onClick={() => router.push('/sepolia')} 
            isActive={pathname === '/sepolia'}
          >
            Sepolia Testnet
          </NavLink>
          <NavLink 
            onClick={() => router.push('/tokens')} 
            isActive={pathname === '/tokens'}
          >
            Tokens
          </NavLink>
          <NavLink 
            onClick={() => router.push('/')} 
          >
            Logout
          </NavLink>
        </Nav>
      </Header>
      <MainContent>
        <Title variants={itemVariants}>NFT Marketplace</Title>
        
        <Card variants={itemVariants}>
          <h2>Create NFT</h2>
          <Form onSubmit={handleCreateNFT}>
            <InputGroup>
              <Label htmlFor="nftName">NFT Name</Label>
              <Input 
                id="nftName"
                type="text" 
                placeholder="Enter NFT name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </InputGroup>
            <InputGroup>
              <Label htmlFor="nftPrice">Price</Label>
              <Input 
                id="nftPrice"
                type="number" 
                placeholder="Enter price" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                required 
              />
            </InputGroup>
            <InputGroup>
              <Label htmlFor="nftBlockchain">Blockchain</Label>
              <Select 
                id="nftBlockchain"
                value={blockchain} 
                onChange={(e) => setBlockchain(e.target.value)}
              >
                <option value="ETH">Ethereum</option>
                <option value="Polygon">Polygon</option>
                <option value="Solana">Solana</option>
              </Select>
            </InputGroup>
            <InputGroup>
              <Label htmlFor="nftFile">Upload NFT</Label>
              <FileInput 
                id="nftFile"
                type="file" 
                onChange={(e) => setFile(e.target.files[0])} 
                accept="image/*"
              />
              <FileInputLabel htmlFor="nftFile">
                {file ? file.name : 'Choose File'}
              </FileInputLabel>
            </InputGroup>
            <Button type="submit">
              Create NFT
            </Button>
          </Form>
        </Card>
        <Card variants={itemVariants}>
  <h2>Browse NFTs</h2>
  <NFTGrid>
  {nfts.length > 0 ? (
    nfts.map((nft) => (
      <NFTCard key={nft.id} whileHover={{ scale: 1.05 }}>
        <NFTImage src={nft.image_url} alt={nft.name || 'NFT'} />
        <NFTInfo>
          <NFTName>{nft.name || 'Unnamed NFT'}</NFTName>
          <NFTPrice>
            {nft.last_sale && nft.last_sale.payment_token
              ? `${nft.last_sale.payment_token.eth_price.toFixed(4)} ETH`
              : 'No price data'}
          </NFTPrice>
        </NFTInfo>
        <NFTDetails
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h3>{nft.name || 'Unnamed NFT'}</h3>
          <p>Collection: {nft.collection ? nft.collection.name : 'Unknown'}</p>
          <p>Description: {nft.description ? nft.description.substring(0, 100) + '...' : 'No description'}</p>
          <p>
            Price: {nft.last_sale && nft.last_sale.payment_token
              ? `${nft.last_sale.payment_token.eth_price.toFixed(4)} ETH`
              : 'No price data'}
          </p>
          {nft.permalink && (
            <Button as="a" href={nft.permalink} target="_blank" rel="noopener noreferrer">
              View on OpenSea
            </Button>
          )}
        </NFTDetails>
      </NFTCard>
    ))
  ) : (
    <p>No NFTs available. There might be an issue with the API or no NFTs match the criteria.</p>
  )}
</NFTGrid>
</Card>
      </MainContent>
    </Container>
  );
}
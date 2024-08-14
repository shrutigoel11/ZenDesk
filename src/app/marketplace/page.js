'use client';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ethers } from 'ethers';
import { alchemy } from '../utils/alchemy';
import { getContract, createNFT, buyNFT, getNFTs } from '../utils/contracts';
import { 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  Grid, 
  TextField,
  Box,
  Container,
  Chip,
  IconButton,
  Tooltip,
  Modal,
  Fade,
  Backdrop
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/system';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  paddingTop: '100%', // 1:1 Aspect Ratio
  position: 'relative',
  '&:hover': {
    '& .hover-image': {
      opacity: 1,
    },
  },
}));

const HoverImage = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  opacity: 0,
  transition: 'opacity 0.3s ease-in-out',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
}));

// Simulated backend
const backend = {
  users: {},
  nfts: [],
  addNFT: (address, nft) => {
    nft.seller = address;
    backend.nfts.push(nft);
  },
  removeNFT: (nftId) => {
    backend.nfts = backend.nfts.filter(nft => nft.id !== nftId);
  },
  buyNFT: (buyerAddress, nftId) => {
    const nftIndex = backend.nfts.findIndex(nft => nft.id === nftId);
    if (nftIndex !== -1) {
      const nft = backend.nfts[nftIndex];
      const requiredTokens = nft.price * 200; // 1 Token = 0.005 ETH
      if (backend.users[buyerAddress]?.tokens >= requiredTokens) {
        backend.users[buyerAddress].tokens -= requiredTokens;
        backend.users[nft.seller].tokens += requiredTokens;
        backend.nfts.splice(nftIndex, 1);
        return true;
      }
    }
    return false;
  },
  getTokens: (address) => {
    return backend.users[address]?.tokens || 0;
  },
  setTokens: (address, amount) => {
    if (!backend.users[address]) {
      backend.users[address] = { tokens: 0 };
    }
    backend.users[address].tokens = amount;
  }
};

export default function Marketplace() {
  const [nfts, setNfts] = useState([]);
  const [ethPrice, setEthPrice] = useState(0);
  const [address, setAddress] = useState('');
  const [userTokens, setUserTokens] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchNFTs();
    fetchEthPrice();
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
        updateUserTokens(address);
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      }
    } else {
      console.log('Please install MetaMask!');
    }
  };

  const updateUserTokens = (address) => {
    const tokens = backend.getTokens(address);
    setUserTokens(tokens);
  };

  const fetchNFTs = async () => {
    setNfts(backend.nfts);
  };

  const fetchEthPrice = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      const data = await response.json();
      setEthPrice(data.ethereum.usd);
    } catch (error) {
      console.error('Error fetching ETH price:', error);
    }
  };
  
  const onSubmit = async (data) => {
    try {
      const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
      await createNFT(signer, data.name, data.price);
      fetchNFTs();
      reset();
    } catch (error) {
      console.error('Error creating NFT:', error);
    }
  };

  const handleBuyNFT = async (nft) => {
    try {
      const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
      await buyNFT(signer, nft.id);
      alert('NFT purchased successfully!');
      fetchNFTs();
      updateUserTokens(address);
    } catch (error) {
      console.error('Error buying NFT:', error);
      alert('Failed to purchase NFT. Please check your token balance and try again.');
    }
  };

  const handleDeleteNFT = (nftId) => {
    backend.removeNFT(nftId);
    fetchNFTs();
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenModal(true);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        NFT Marketplace
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body1">
          Current ETH Price: ${ethPrice}
        </Typography>
        <Chip label={`Address: ${address}`} />
        <Chip label={`Tokens: ${userTokens}`} color="primary" />
      </Box>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Create NFT
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="NFT Name"
                  fullWidth
                  margin="normal"
                />
              )}
            />
             <Controller
      name="image"
      control={control}
      defaultValue=""
      rules={{ required: false }}
      render={({ field: { onChange, ...rest } }) => (
        <TextField
          {...rest}
          type="file"
          inputProps={{ accept: "image/*" }}
          onChange={(e) => {
            const file = e.target.files[0];
            onChange(file);
          }}
          fullWidth
          margin="normal"
        />
      )}
    />
            <Controller
              name="price"
              control={control}
              defaultValue=""
              rules={{ required: true, min: 0 }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  step="0.01"
                  label="Price in ETH"
                  fullWidth
                  margin="normal"
                />
              )}
            />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              Create NFT
            </Button>
          </form>
        </CardContent>
      </Card>

      <Typography variant="h5" gutterBottom>
        Available NFTs
      </Typography>
      <Grid container spacing={3}>
        {nfts.map((nft) => (
          <Grid item xs={12} sm={6} md={4} key={nft.id}>
            <StyledCard>
              <StyledCardMedia
                image={nft.image}
                title={nft.name}
                onClick={() => handleImageClick(nft.image)}
              >
                <HoverImage className="hover-image">
                  <Typography variant="body2" color="white">Click to enlarge</Typography>
                </HoverImage>
              </StyledCardMedia>
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {nft.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {nft.price} ETH (${(nft.price * ethPrice).toFixed(2)})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Seller: {nft.seller.slice(0, 6)}...{nft.seller.slice(-4)}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => handleBuyNFT(nft)}
                    startIcon={<AddIcon />}
                  >
                    Buy for {nft.price * 200} Tokens
                  </Button>
                  {nft.seller === address && (
                    <Tooltip title="Delete NFT">
                      <IconButton onClick={() => handleDeleteNFT(nft.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: 600,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}>
            <img src={selectedImage} alt="Enlarged NFT" style={{ width: '100%', height: 'auto' }} />
          </Box>
        </Fade>
      </Modal>
    </Container>
  );
}
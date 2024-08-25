'use client'

import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import logo from '../logo.png';
import { FaEdit, FaInstagram, FaTwitter, FaLinkedin, FaGithub, FaCamera, FaUser } from 'react-icons/fa';
import NavLinks from '../components/NavLinks';
import axios from 'axios';


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

const TextArea = styled.textarea`
  padding: 0.75rem;
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: #ff4d6d;
    box-shadow: 0 0 0 2px rgba(255, 77, 109, 0.2);
  }
`;

const ProfileCard = styled(Card)`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  align-items: start;
`;

const ProfileImageContainer = styled.div`
position: relative;
width: 200px;
height: 200px;
border-radius: 50%;
overflow: hidden;
margin: 0 auto;
background-color: #2a0a4a; // Add this line for a background color
display: flex;
justify-content: center;
align-items: center;
`;

const ProfileImage = styled.img`
width: 100%;
height: 100%;
object-fit: cover;
`;

const DefaultProfileIcon = styled(FaUser)`
font-size: 100px;
color: #ff4d6d;
`;

const ProfileImageUpload = styled.label`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: rgba(255, 77, 109, 0.8);
  color: white;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 77, 109, 1);
  }
`;

const ProfileDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ProfileField = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProfileLabel = styled.label`
  font-size: 0.9rem;
  color: #b8b8b8;
  margin-bottom: 0.25rem;
`;

const ProfileValue = styled.p`
  font-size: 1rem;
  color: white;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;



const SocialIcon = styled.a`
  color: white;
  font-size: 1.5rem;
  transition: color 0.3s ease;

  &:hover {
    color: #ff4d6d;
  }
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
};
export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [about, setAbout] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  useEffect(() => {
    const storedAddress = localStorage.getItem('connectedAddress');
    if (storedAddress) {
      setWalletAddress(storedAddress);
    } else {
      router.push('/'); // Redirect to home if no wallet address is found
    }
  }, []);

  useEffect(() => {
    if (walletAddress) {
      fetchUserData(walletAddress);
    }
  }, [walletAddress]);

  const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const pinataSecretApiKey = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY;

const pinFileToIPFS = async (file) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  let formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(url, formData, {
    maxContentLength: 'Infinity',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      'pinata_api_key': pinataApiKey,
      'pinata_secret_api_key': pinataSecretApiKey
    }
  });

  return response.data.IpfsHash;
};

const pinJSONToIPFS = async (JSONBody) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

  const response = await axios.post(url, JSONBody, {
    headers: {
      'Content-Type': 'application/json',
      'pinata_api_key': pinataApiKey,
      'pinata_secret_api_key': pinataSecretApiKey
    }
  });

  return response.data.IpfsHash;
};


const fetchUserData = async (address) => {
  try {
    const response = await fetch(`/api/profile/${address}`);
    if (response.ok) {
      const { ipfsHash } = await response.json();
      if (ipfsHash) {
        const profileDataResponse = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
        const profileData = await profileDataResponse.json();
        
        setName(profileData.name || '');
        setEmail(profileData.email || '');
        setPhone(profileData.phone || '');
        setAbout(profileData.about || '');
        setProfileImage(profileData.profileImage || null);
        setInstagram(profileData.instagram || '');
        setTwitter(profileData.twitter || '');
        setLinkedin(profileData.linkedin || '');
        setGithub(profileData.github || '');
      }
    } else if (response.status === 404) {
      console.log('Profile not found. This is expected for new users.');
    } else {
      throw new Error('Failed to fetch user data');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = profileImage;
      if (profileImage instanceof File) {
        const imageHash = await pinFileToIPFS(profileImage);
        imageUrl = `ipfs://${imageHash}`;
      }
  
      const profileData = {
        walletAddress,
        name,
        email,
        phone,
        about,
        profileImage: imageUrl,
        instagram,
        twitter,
        linkedin,
        github,
      };
  
      const ipfsHash = await pinJSONToIPFS(profileData);
  
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress, ipfsHash }),
      });
  
      if (response.ok) {
        alert('Profile updated successfully!');
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(`Failed to update profile: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(`Error updating profile: ${error.message}`);
    }
  };


  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
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
          <NavLinks />
        </Nav>
      </Header>
      <MainContent>
        <Title variants={itemVariants}>User Profile</Title>
        
        <ProfileCard variants={itemVariants}>
        <ProfileImageContainer>
  {profileImage ? (
    <ProfileImage 
      src={profileImage instanceof File ? URL.createObjectURL(profileImage) : profileImage} 
      alt="Profile" 
    />
  ) : (
    <DefaultProfileIcon />
  )}
  {isEditing && (
    <ProfileImageUpload htmlFor="profileImage">
      <FaCamera />
      <input 
        id="profileImage"
        type="file" 
        onChange={handleImageChange} 
        accept="image/*"
        style={{ display: 'none' }}
      />
    </ProfileImageUpload>
  )}
</ProfileImageContainer>
          
          <ProfileDetails>
            {isEditing ? (
              <Form onSubmit={handleProfileUpdate}>
                <InputGroup>
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name"
                    type="text" 
                    placeholder="Enter your name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                  />
                </InputGroup>
                <InputGroup>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    type="email" 
                    placeholder="Enter your email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </InputGroup>
                <InputGroup>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone"
                    type="tel" 
                    placeholder="Enter your phone number" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                  />
                </InputGroup>
                <InputGroup>
                  <Label htmlFor="about">About</Label>
                  <TextArea 
                    id="about"
                    placeholder="Tell us about yourself" 
                    value={about} 
                    onChange={(e) => setAbout(e.target.value)} 
                  />
                </InputGroup>
                <InputGroup>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input 
                    id="instagram"
                    type="text" 
                    placeholder="Your Instagram username" 
                    value={instagram} 
                    onChange={(e) => setInstagram(e.target.value)} 
                  />
                </InputGroup>
                <InputGroup>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input 
                    id="twitter"
                    type="text" 
                    placeholder="Your Twitter username" 
                    value={twitter} 
                    onChange={(e) => setTwitter(e.target.value)} 
                  />
                </InputGroup>
                <InputGroup>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input 
                    id="linkedin"
                    type="text" 
                    placeholder="Your LinkedIn profile URL" 
                    value={linkedin} 
                    onChange={(e) => setLinkedin(e.target.value)} 
                  />
                </InputGroup>
                <InputGroup>
                  <Label htmlFor="github">GitHub</Label>
                  <Input 
                    id="github"
                    type="text" 
                    placeholder="Your GitHub username" 
                    value={github} 
                    onChange={(e) => setGithub(e.target.value)} 
                  />
                </InputGroup>
                <Button type="submit">
                  Update Profile
                </Button>
              </Form>
            ) : (
              <>
                <h2>Your Profile <FaEdit onClick={() => setIsEditing(true)} style={{ cursor: 'pointer', marginLeft: '10px' }} /></h2>
                <ProfileField>
                  <ProfileLabel>Name</ProfileLabel>
                  <ProfileValue>{name}</ProfileValue>
                </ProfileField>
                <ProfileField>
                  <ProfileLabel>Email</ProfileLabel>
                  <ProfileValue>{email}</ProfileValue>
                </ProfileField>
                <ProfileField>
                  <ProfileLabel>Phone</ProfileLabel>
                  <ProfileValue>{phone}</ProfileValue>
                </ProfileField>
                <ProfileField>
                  <ProfileLabel>About</ProfileLabel>
                  <ProfileValue>{about}</ProfileValue>
                </ProfileField>
                <ProfileField>
                  <ProfileLabel>Wallet Address</ProfileLabel>
                  <ProfileValue>{walletAddress}</ProfileValue>
                </ProfileField>
                <SocialLinks>
                  {instagram && <SocialIcon href={`https://instagram.com/${instagram}`} target="_blank"><FaInstagram /></SocialIcon>}
                  {twitter && <SocialIcon href={`https://twitter.com/${twitter}`} target="_blank"><FaTwitter /></SocialIcon>}
                  {linkedin && <SocialIcon href={linkedin} target="_blank"><FaLinkedin /></SocialIcon>}
                  {github && <SocialIcon href={`https://github.com/${github}`} target="_blank"><FaGithub /></SocialIcon>}
                </SocialLinks>
              </>
            )}
          </ProfileDetails>
        </ProfileCard>
      </MainContent>
    </Container>
  );
}
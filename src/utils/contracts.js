import { ethers } from 'ethers';
import ZendeskNFTABI from '../../contracts/ZendeskNFT.json';

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export const getContract = (signer) => {
  return new ethers.Contract(contractAddress, ZendeskNFTABI.abi, signer);
};

export const createNFT = async (signer, to, tokenId) => {
  const contract = getContract(signer);
  return await contract.mint(to, tokenId);
};

// export const getNFTs = async (address) => {
//   const contract = getContract(new ethers.providers.Web3Provider(window.ethereum).getSigner());
//   return await contract.balanceOf(address);
// };

export const buyNFT = async (signer, tokenId) => {
  const contract = getContract(signer);
  const tx = await contract.buyNFT(tokenId);
  await tx.wait();
};

export const getNFTs = async (provider) => {
  const contract = getContract(provider);
  const totalSupply = await contract.totalSupply();
  const nfts = [];
  for (let i = 1; i <= totalSupply; i++) {
    const nft = await contract.getNFT(i);
    nfts.push({
      id: i,
      name: nft.name,
      price: ethers.utils.formatEther(nft.price),
      seller: nft.seller
    });
  }
  return nfts;
};
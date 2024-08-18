import { ethers } from 'ethers';
import { NFTStorage, File } from 'nft.storage';
import ZendeskNFTABI from '../../contracts/ZendeskNFT.json';

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const nftStorageApiKey = process.env.NFT_STORAGE_API_KEY;

const nftStorage = new NFTStorage({ token: nftStorageApiKey });

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, description, price, image } = req.body;

      // Upload image to IPFS
      const imageFile = new File([Buffer.from(image, 'base64')], 'nft.png', { type: 'image/png' });
      const imageCid = await nftStorage.storeBlob(imageFile);
      const imageUrl = `https://ipfs.io/ipfs/${imageCid}`;

      // Create metadata and upload to IPFS
      const metadata = await nftStorage.store({
        name,
        description,
        image: imageUrl,
      });

      // Mint NFT
      const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
      const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
      const contract = new ethers.Contract(contractAddress, ZendeskNFTABI.abi, signer);

      const tx = await contract.mint(signer.address, metadata.url, ethers.utils.parseEther(price));
      await tx.wait();

      res.status(200).json({ success: true, tokenId: tx.tokenId, metadata: metadata.url });
    } catch (error) {
      console.error('Error creating NFT:', error);
      res.status(500).json({ success: false, error: 'Failed to create NFT' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
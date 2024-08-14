import { ethers } from 'ethers';
import UserAuthABI from '../../contracts/UserAuth.json';

const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
const userAuthContract = new ethers.Contract(process.env.USER_AUTH_CONTRACT_ADDRESS, UserAuthABI, provider);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { action, address, passwordHash } = req.body;

    try {
      if (action === 'register') {
        const tx = await userAuthContract.register(passwordHash);
        await tx.wait();
        res.status(200).json({ message: 'User registered successfully' });
      } else if (action === 'login') {
        const isLoggedIn = await userAuthContract.login(passwordHash);
        res.status(200).json({ isLoggedIn });
      } else if (action === 'isRegistered') {
        const isRegistered = await userAuthContract.isUserRegistered();
        res.status(200).json({ isRegistered });
      } else {
        res.status(400).json({ error: 'Invalid action' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
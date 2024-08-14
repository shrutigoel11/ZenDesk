import { ethers } from 'ethers';
import UserAuthABI from '../../contracts/UserAuth.json';

const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
const userAuthContract = new ethers.Contract(process.env.USER_AUTH_CONTRACT_ADDRESS, UserAuthABI, provider);

const ADMIN_ADDRESS = '0xE22B6D3e3Ccfe6dc83107453a46B6E88f7eeD348';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { address } = req.query;

    if (address.toLowerCase() !== ADMIN_ADDRESS.toLowerCase()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    try {
      // In a real-world scenario, you'd fetch this data from your database
      // This is a mock-up
      const users = [
        { id: 1, address: '0x123...', tokens: 100 },
        { id: 2, address: '0x456...', tokens: 200 },
        { id: 3, address: '0x789...', tokens: 300 },
      ];

      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    const { address, userId } = req.body;

    if (address.toLowerCase() !== ADMIN_ADDRESS.toLowerCase()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    try {

      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
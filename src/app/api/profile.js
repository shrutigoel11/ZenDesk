import { connectToDatabase } from '../../utils/dbConnect';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const { address } = req.query;
        const db = await connectToDatabase();
        const profile = await db.collection('profiles').findOne({ walletAddress: address });

        if (profile) {
          res.status(200).json(profile);
        } else {
          res.status(404).json({ message: 'Profile not found' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
      }
      break;

    case 'POST':
      try {
        const db = await connectToDatabase();
        const profileData = req.body;
        const { walletAddress, ...updateData } = profileData;

        if (!walletAddress) {
          return res.status(400).json({ message: 'Wallet address is required' });
        }

        const result = await db.collection('profiles').updateOne(
          { walletAddress: walletAddress },
          { $set: updateData },
          { upsert: true }
        );

        if (result.acknowledged) {
          const updatedProfile = await db.collection('profiles').findOne({ walletAddress: walletAddress });
          res.status(200).json(updatedProfile);
        } else {
          res.status(500).json({ message: 'Failed to update profile' });
        }
      } catch (error) {
        console.error('Server-side error:', error);
        res.status(500).json({ message: 'Error updating profile', error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
import { connectToDatabase } from '../../../utils/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { walletAddress, ipfsHash } = req.body;
    const { db } = await connectToDatabase();

    try {
      await db.collection('profiles').updateOne(
        { walletAddress },
        { $set: { ipfsHash } },
        { upsert: true }
      );
      res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating profile' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
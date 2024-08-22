import { connectToDatabase } from '../../utils/dbConnect';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { walletAddress, name, email, phone, about, profileImage } = req.body;
      console.log('Received data:', { walletAddress, name, email, phone, about, profileImage });
      
      const db = await connectToDatabase();
      console.log('Connected to database');
      
      const result = await db.collection('profiles').updateOne(
        { walletAddress },
        { $set: { name, email, phone, about, profileImage } },
        { upsert: true }
      );
      console.log('Database operation result:', result);

      res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
      console.error('Error in /api/profile:', error);
      res.status(500).json({ message: 'Error updating profile', error: error.toString() });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
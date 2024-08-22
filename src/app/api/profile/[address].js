// import { connectToDatabase } from '../../../utils/dbConnect';

// export default async function handler(req, res) {
//   if (req.method === 'GET') {
//     try {
//       const { address } = req.query;
//       const db = await connectToDatabase();
      
//       const profile = await db.collection('profiles').findOne({ walletAddress: address });

//       if (profile) {
//         res.status(200).json(profile);
//       } else {
//         res.status(404).json({ message: 'Profile not found' });
//       }
//     } catch (error) {
//       res.status(500).json({ message: 'Error fetching profile', error: error.message });
//     }
//   } else {
//     res.setHeader('Allow', ['GET']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }
import dbConnect from '../../utils/dbConnect';
import User from '../../models/User';
import jwt from 'jsonwebtoken';

dbConnect();

const ADMIN_ADDRESS = '0xE22B6D3e3Ccfe6dc83107453a46B6E88f7eeD348';

const authenticateToken = (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return null;

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return user;
  } catch (e) {
    return null;
  }
};

export default async function handler(req, res) {
    const { method } = req;
    console.log('Request method:', method); // Log the request method
  
    const user = authenticateToken(req, res);
    console.log('Authenticated user:', user); // Log the authenticated user
  
    if (!user || user.address.toLowerCase() !== ADMIN_ADDRESS.toLowerCase()) {
      console.log('Access denied. User:', user, 'ADMIN_ADDRESS:', ADMIN_ADDRESS);
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
  
    switch (method) {
      case 'GET':
        try {
          const users = await User.find({}).select('-__v');
          console.log('Users fetched:', users); // Log the fetched users
          res.status(200).json({ success: true, data: users });
        } catch (error) {
          console.error('Error fetching users:', error);
          res.status(400).json({ success: false, message: error.message });
        }
        break;
    case 'DELETE':
      try {
        const { userId } = req.body;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
          return res.status(400).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
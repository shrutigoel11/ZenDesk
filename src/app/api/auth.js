import dbConnect from '../../utils/dbConnect';
import User from '../../models/User';
import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';

dbConnect();
const token = jwt.sign({ id: user._id, address: user.address }, process.env.JWT_SECRET, { expiresIn: '1d' });
res.status(200).json({ success: true, token, user });
export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'POST':
      try {
        const { action, address, name } = req.body;

        if (action === 'signup') {
          let user = await User.findOne({ address });
          if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
          }
          user = await User.create({ address, name });
          const token = jwt.sign({ id: user._id, address: user.address }, process.env.JWT_SECRET, { expiresIn: '1d' });
          res.status(201).json({ success: true, token, user });
        } else if (action === 'login') {
          const user = await User.findOne({ address });
          if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
          }
          const token = jwt.sign({ id: user._id, address: user.address }, process.env.JWT_SECRET, { expiresIn: '1d' });
          res.status(200).json({ success: true, token, user });
        } else {
          res.status(400).json({ success: false, message: 'Invalid action' });
        }
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
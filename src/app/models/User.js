import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  address: {
    type: String,
    required: [true, 'Please provide an address'],
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  tokens: {
    type: Number,
    default: 0,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);

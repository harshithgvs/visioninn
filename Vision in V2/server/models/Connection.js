import mongoose from 'mongoose';

const connectionSchema = new mongoose.Schema({
  requesterId: { type: String, required: true },
  recipientId: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  message: { type: String }
}, { timestamps: true });

export default mongoose.models.Connection || mongoose.model('Connection', connectionSchema);

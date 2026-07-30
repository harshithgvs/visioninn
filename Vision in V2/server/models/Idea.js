import mongoose from 'mongoose';

const ideaSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  authorName: { type: String, required: true },
  title: { type: String, required: true },
  problem: { type: String, required: true },
  solution: { type: String, required: true },
  targetMarket: { type: String },
  techStack: { type: String },
  status: { type: String, default: 'Timestamped' },
  isPublic: { type: Boolean, default: false },
  hash: { type: String, required: true },
  timestamp: { type: String, required: true },
  versionHistory: [{
    version: Number,
    date: String,
    note: String
  }]
}, { timestamps: true });

export default mongoose.models.Idea || mongoose.model('Idea', ideaSchema);

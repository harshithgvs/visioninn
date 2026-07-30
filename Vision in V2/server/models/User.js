import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, default: 'founder' },
  roleLabel: { type: String, default: 'Student Founder' },
  headline: { type: String },
  college: { type: String },
  skills: [{ type: String }],
  bio: { type: String },
  avatar: { type: String },
  cover: { type: String },
  startupName: { type: String },
  socials: {
    linkedin: String,
    github: String,
    twitter: String,
    website: String
  },
  portfolio: [{ type: String }],
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);

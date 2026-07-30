import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import ideaRoutes from './routes/ideaRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import fundingRoutes from './routes/fundingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/funding', fundingRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'VisionIn API Ecosystem',
    mode: process.env.MONGODB_URI ? 'MongoDB Atlas' : 'Local Dynamic Memory Store',
    timestamp: new Date().toISOString()
  });
});

// Database Connection (MongoDB Atlas fallback gracefully handled)
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log(' Connected to MongoDB Atlas Database'))
    .catch(err => console.warn(' MongoDB Atlas connection string set but failed to connect:', err.message));
} else {
  console.log(' Running VisionIn Server in Local High-Fidelity Reactive Storage Mode');
}

app.listen(PORT, () => {
  console.log(` VisionIn Production API Server active on http://localhost:${PORT}`);
});

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import analyzeRoutes from './routes/analyzeRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import generateRoutes from './routes/generateRoutes.js';
import maliRoutes from './routes/maliRoutes.js';
import { startEmailScheduler } from './emailScheduler.js';

const app = express();
const PORT = 5000;

// Enable CORS for frontend requests
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // standard Vite dev server urls
  credentials: true
}));

// Parse incoming request JSON bodies
app.use(express.json());

// Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/mali', maliRoutes);

// Start background email queue worker
startEmailScheduler();

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'healthy', project: 'ProfileForge API Server' });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`  ProfileForge Backend running on port ${PORT}`);
  console.log(`=========================================`);
});

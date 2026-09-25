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
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests (supports localhost, vercel.app, custom domains)
app.use(cors({
  origin: true,
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

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const isDirectRun = Boolean(process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename));

// Start background email queue worker only when running as standalone server
if (isDirectRun) {
  startEmailScheduler();
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', project: 'ProfileForge API Server', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.status(200).json({ status: 'healthy', project: 'ProfileForge API Server' });
});

// Start Express Server only when run directly (e.g. node backend/server.js)
if (isDirectRun) {
  app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`  ProfileForge Backend running on port ${PORT}`);
    console.log(`=========================================`);
  });
}

export default app;

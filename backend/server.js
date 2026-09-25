import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
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

// Register API routes with dual prefixes for full serverless / proxy compatibility
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/analyze', analyzeRoutes);
app.use('/analyze', analyzeRoutes);

app.use('/api/profiles', profileRoutes);
app.use('/profiles', profileRoutes);

app.use('/api/generate', generateRoutes);
app.use('/generate', generateRoutes);

app.use('/api/mali', maliRoutes);
app.use('/mali', maliRoutes);

// Health check endpoints
const healthHandler = (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    project: 'ProfileForge API Server', 
    timestamp: new Date().toISOString(),
    env: process.env.VERCEL ? 'vercel-serverless' : 'local-node'
  });
};

app.get('/api/health', healthHandler);
app.get('/health', healthHandler);
app.get('/', healthHandler);

// Global error handling middleware - returns JSON error rather than crashing container
app.use((err, req, res, next) => {
  console.error('Express Error Handler:', err);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal Server Error' 
  });
});

const __filename = fileURLToPath(import.meta.url);
const isDirectRun = Boolean(process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename));

// Start background email queue worker only when running as standalone server
if (isDirectRun) {
  startEmailScheduler();
}

// Start Express Server only when run directly (e.g. node backend/server.js)
if (isDirectRun) {
  app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`  ProfileForge Backend running on port ${PORT}`);
    console.log(`=========================================`);
  });
}

export default app;

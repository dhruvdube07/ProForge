import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { analyzeProfileText, refineProfileText } from '../groqClient.js';

const router = express.Router();

/**
 * POST /api/analyze
 * Analyzes the user self-description text and returns AI-structured profile parameters.
 */
router.post('/', requireAuth, async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Text content to analyze is required' });
  }

  try {
    console.log(`Analyzing profile text for user ${req.user.email}...`);
    const structuredData = await analyzeProfileText(text);
    return res.status(200).json(structuredData);
  } catch (error) {
    console.error('Analysis API Error:', error);
    return res.status(500).json({ error: 'AI analysis failed. Please check your inputs or try again later.' });
  }
});

/**
 * POST /api/analyze/refine
 * Refines the extracted profile with target company context and customization sliders.
 */
router.post('/refine', requireAuth, async (req, res) => {
  const { baseProfile, companyContext, sliders } = req.body;

  if (!baseProfile) {
    return res.status(400).json({ error: 'Base profile is required for refinement' });
  }

  try {
    console.log(`Refining profile for user ${req.user.email}...`);
    const refinedProfile = await refineProfileText(baseProfile, companyContext, sliders || {});
    return res.status(200).json(refinedProfile);
  } catch (error) {
    console.error('Refinement Route Error:', error);
    return res.status(500).json({ error: 'Failed to refine profile using AI.' });
  }
});

export default router;

import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { 
  analyzeProfileText, 
  refineProfileText, 
  calculateAtsScore, 
  rewriteAtsBullet 
} from '../groqClient.js';

const router = express.Router();

/**
 * Helper to extract custom Groq API key from request headers
 */
const getCustomKey = (req) => {
  return req.headers['x-custom-groq-key'] || req.headers['x-custom-api-key'] || null;
};

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
    const customKey = getCustomKey(req);
    console.log(`Analyzing profile text for user ${req.user.email} (Custom key used: ${!!customKey})...`);
    const structuredData = await analyzeProfileText(text, customKey);
    return res.status(200).json(structuredData);
  } catch (error) {
    console.error('Analysis API Error, returning deterministic fallback:', error);
    try {
      const fallback = await analyzeProfileText(text, null);
      return res.status(200).json(fallback);
    } catch (innerErr) {
      return res.status(200).json({
        name: 'Professional Candidate',
        profession: 'Career Specialist',
        tagline: 'Delivering high-impact execution and strategic value',
        bio: text.slice(0, 300),
        skills: ['Strategic Planning', 'Problem Solving', 'Project Management', 'Communication'],
        soft_skills: ['Leadership', 'Adaptability', 'Collaboration'],
        experience: [{ company: 'Target Organization', role: 'Specialist', duration: '2021 - Present', description: 'Spearheaded key initiatives and achieved delivery milestones.' }],
        education: [{ school: 'University', degree: 'Bachelor Degree', duration: '2016 - 2020', description: 'Graduated with strong technical and analytical foundation.' }],
        projects: [{ title: 'Strategic Initiative', technologies: 'Modern Tools, Frameworks', duration: '2023', description: 'Architected and deployed scalable solutions.' }]
      });
    }
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
    const customKey = getCustomKey(req);
    console.log(`Refining profile for user ${req.user.email} (Custom key used: ${!!customKey})...`);
    const refinedProfile = await refineProfileText(baseProfile, companyContext, sliders || {}, customKey);
    return res.status(200).json(refinedProfile);
  } catch (error) {
    console.error('Refinement Route Error, falling back to base profile:', error);
    return res.status(200).json({
      ...baseProfile,
      tagline: `Targeting ${companyContext || 'Top Industry Roles'} with proven leadership & execution velocity`,
      bio: `${baseProfile.bio || ''} (Tailored for ${companyContext || 'target opportunities'})`
    });
  }
});

/**
 * POST /api/analyze/ats-score
 * Computes ATS score alignment, keyword gaps, and professional suggestions.
 */
router.post('/ats-score', requireAuth, async (req, res) => {
  const { profile, jd } = req.body;

  if (!profile || !jd) {
    return res.status(400).json({ error: 'Profile and Job Description (jd) are required' });
  }

  try {
    const customKey = getCustomKey(req);
    console.log(`Calculating ATS score for user ${req.user.email} (Custom key used: ${!!customKey})...`);
    const result = await calculateAtsScore(profile, jd, customKey);
    return res.status(200).json(result);
  } catch (error) {
    console.error('ATS Score API Error:', error);
    return res.status(500).json({ error: 'Failed to calculate ATS score' });
  }
});

/**
 * POST /api/analyze/ats-rewrite
 * Rewrites a single resume bullet description targeting a Job Description.
 */
router.post('/ats-rewrite', requireAuth, async (req, res) => {
  const { bullet, jd } = req.body;

  if (!bullet || !jd) {
    return res.status(400).json({ error: 'Bullet and Job Description (jd) are required' });
  }

  try {
    const customKey = getCustomKey(req);
    console.log(`Rewriting bullet for user ${req.user.email} (Custom key used: ${!!customKey})...`);
    const result = await rewriteAtsBullet(bullet, jd, customKey);
    return res.status(200).json(result);
  } catch (error) {
    console.error('ATS Bullet Rewrite API Error:', error);
    return res.status(500).json({ error: 'Failed to optimize bullet' });
  }
});

export default router;

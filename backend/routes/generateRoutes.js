import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { generateResumePdf, generateCoverLetterPdf } from '../pdfGenerator.js';
import { generateOutreachStudio, generateLinkedInPost } from '../groqClient.js';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const defaultGroq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/**
 * Helper to extract custom API key and return correct Groq instance
 */
const getGroqClient = (req) => {
  const customKey = req.headers['x-custom-groq-key'] || req.headers['x-custom-api-key'];
  if (customKey && customKey.trim() !== '') {
    return new Groq({ apiKey: customKey });
  }
  return defaultGroq;
};

const getCustomKey = (req) => {
  return req.headers['x-custom-groq-key'] || req.headers['x-custom-api-key'] || null;
};

/**
 * POST /api/generate/resume
 * Generates and downloads a custom-styled PDF resume.
 */
router.post('/resume', requireAuth, async (req, res) => {
  const profile = req.body;

  if (!profile) {
    return res.status(400).json({ error: 'Profile data is required for resume generation' });
  }

  try {
    const pdfBuffer = await generateResumePdf(profile);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="resume-${profile.name?.replace(/\s+/g, '-') || 'profile'}.pdf"`);
    return res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF Generation Route Error:', error);
    return res.status(500).json({ error: 'Failed to generate PDF resume' });
  }
});

/**
 * POST /api/generate/resume-preview
 * Generates and returns a preview of the PDF resume inline.
 */
router.post('/resume-preview', requireAuth, async (req, res) => {
  const profile = req.body;

  if (!profile) {
    return res.status(400).json({ error: 'Profile data is required for resume generation' });
  }

  try {
    const pdfBuffer = await generateResumePdf(profile);
    res.setHeader('Content-Type', 'application/pdf');
    return res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF Preview Generation Route Error:', error);
    return res.status(500).json({ error: 'Failed to generate PDF preview' });
  }
});

/**
 * POST /api/generate/cover-letter
 * Generates and downloads outreach cover letter as standard PDF.
 */
router.post('/cover-letter', requireAuth, async (req, res) => {
  const { profile, coverLetterText } = req.body;

  if (!profile || !coverLetterText) {
    return res.status(400).json({ error: 'Profile and cover letter content are required' });
  }

  try {
    const pdfBuffer = await generateCoverLetterPdf(profile, coverLetterText);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="cover_letter.pdf"');
    return res.send(pdfBuffer);
  } catch (error) {
    console.error('Cover Letter PDF Generation Error:', error);
    return res.status(500).json({ error: 'Failed to generate Cover Letter PDF' });
  }
});

/**
 * POST /api/generate/signature
 * Unimplemented mock/placeholder for signature assets.
 */
router.post('/signature', requireAuth, async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text signature is required' });
  }
  return res.status(200).json({ message: 'Signature generated mock successfully' });
});

/**
 * POST /api/generate/linkedin
 * Generates an engaging LinkedIn bio from the profile data.
 */
router.post('/linkedin', requireAuth, async (req, res) => {
  const profile = req.body;

  if (!profile) {
    return res.status(400).json({ error: 'Profile data is required for LinkedIn bio generation' });
  }

  const name = profile.name || 'Professional';
  const profession = profile.profession || 'Professional';
  const bio = profile.bio || '';
  const tagline = profile.tagline || '';
  
  const parseSkills = (arr) => {
    if (Array.isArray(arr)) return arr;
    try { return JSON.parse(arr); } catch(e) { return []; }
  };
  
  const skills = parseSkills(profile.skills);
  const achievements = parseSkills(profile.achievements);

  const prompt = `
Write an engaging, professional, and optimized LinkedIn "About" section for a professional named ${name}, who works as a ${profession}.

Here are some details about them:
- Tagline: "${tagline}"
- About summary: "${bio}"
- Core skills: ${skills.join(', ')}
- Achievements: ${achievements.join(', ')}

Instructions:
1. Write a strong, catchy first-line hook.
2. Use professional yet conversational paragraphs (2-3 paragraphs max) outlining their value proposition and drive.
3. Include a bulleted "Areas of Expertise" or "Core Skills" list using professional emojis (like 🚀, 💻, 📊, 🎯).
4. End with a friendly call-to-action (CTA) inviting connections or inquiries.
5. Do NOT include markdown styling like headings (#, ##) or code blocks. Just write plain text with line breaks.
`;

  try {
    const groqClient = getGroqClient(req);
    const chatCompletion = await groqClient.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert LinkedIn copywriter and career coach. You write compelling personal branding bios.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'qwen/qwen3.8-27b',
      temperature: 0.7
    });

    const resultText = chatCompletion.choices[0]?.message?.content || '';
    return res.status(200).json({ text: resultText.trim() });
  } catch (error) {
    console.error('LinkedIn Bio Generation Route Error:', error);
    return res.status(500).json({ error: 'Failed to generate LinkedIn bio using AI' });
  }
});

/**
 * POST /api/generate/outreach
 * Generates cover letter, LinkedIn message, and Elevator Pitch for outreach.
 */
router.post('/outreach', requireAuth, async (req, res) => {
  const { profile, companyName, jobTitle, jd, tone } = req.body;

  if (!profile || !companyName || !jobTitle) {
    return res.status(400).json({ error: 'Profile, companyName, and jobTitle are required' });
  }

  try {
    const customKey = getCustomKey(req);
    console.log(`Generating outreach materials for user ${req.user.email} (Custom key: ${!!customKey})...`);
    const result = await generateOutreachStudio(profile, companyName, jobTitle, jd, tone, customKey);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Outreach Generation Route Error:', error);
    return res.status(500).json({ error: 'Failed to generate outreach materials using AI' });
  }
});

/**
 * POST /api/generate/linkedin-post
 * Generates viral LinkedIn posts from a career milestone or project.
 */
router.post('/linkedin-post', requireAuth, async (req, res) => {
  const { milestone, description, style } = req.body;

  if (!milestone || !description) {
    return res.status(400).json({ error: 'Milestone and description are required' });
  }

  try {
    const customKey = getCustomKey(req);
    console.log(`Generating LinkedIn post for user ${req.user.email} (Custom key: ${!!customKey})...`);
    const result = await generateLinkedInPost(milestone, description, style, customKey);
    return res.status(200).json(result);
  } catch (error) {
    console.error('LinkedIn Post Generation Route Error:', error);
    return res.status(500).json({ error: 'Failed to generate LinkedIn post using AI' });
  }
});

export default router;

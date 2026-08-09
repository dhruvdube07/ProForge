import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { generateResumePdf, generateCoverLetterPdf } from '../pdfGenerator.js';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

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
    res.setHeader('Content-Disposition', `attachment; filename="${(profile.name || 'resume').replace(/\s+/g, '_')}_resume.pdf"`);
    return res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF Resume Generation Route Error:', error);
    return res.status(500).json({ error: 'Failed to generate resume PDF' });
  }
});

/**
 * POST /api/generate/resume-preview
 * Generates and returns a custom-styled PDF resume for inline browser display.
 */
router.post('/resume-preview', requireAuth, async (req, res) => {
  const profile = req.body;

  if (!profile) {
    return res.status(400).json({ error: 'Profile data is required for preview generation' });
  }

  try {
    const pdfBuffer = await generateResumePdf(profile);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="preview.pdf"');
    return res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF Resume Preview Generation Error:', error);
    return res.status(500).json({ error: 'Failed to generate resume preview PDF' });
  }
});

/**
 * POST /api/generate/cover-letter
 * Generates and downloads a PDF cover letter.
 */
router.post('/cover-letter', requireAuth, async (req, res) => {
  const { profile, companyName, jobTitle, letterContent } = req.body;

  if (!profile) {
    return res.status(400).json({ error: 'Profile data is required for cover letter generation' });
  }

  try {
    const pdfBuffer = await generateCoverLetterPdf(profile, companyName, jobTitle, letterContent);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${(profile.name || 'cover_letter').replace(/\s+/g, '_')}_cover_letter.pdf"`);
    return res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF Cover Letter Route Error:', error);
    return res.status(500).json({ error: 'Failed to generate cover letter PDF' });
  }
});

/**
 * POST /api/generate/signature
 * Generates a clean, professional HTML email signature block.
 */
router.post('/signature', requireAuth, async (req, res) => {
  const profile = req.body;

  if (!profile) {
    return res.status(400).json({ error: 'Profile data is required for signature generation' });
  }

  const name = profile.name || 'Your Name';
  const profession = profile.profession || 'Professional';
  const tagline = profile.tagline || '';
  const email = profile.email || req.user.email || '';

  // Return a beautifully styled HTML signature
  const htmlSignature = `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.5; color: #1f2937; max-width: 500px;">
  <tr>
    <!-- Left Border accent -->
    <td style="width: 4px; background-color: #0d9488; border-radius: 2px;"></td>
    <!-- Content Area -->
    <td style="padding-left: 16px;">
      <div style="font-weight: 800; font-size: 18px; color: #111827; letter-spacing: -0.3px;">${name}</div>
      <div style="font-weight: 600; font-size: 13px; color: #0d9488; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px;">${profession}</div>
      ${tagline ? `<div style="font-style: italic; font-size: 12px; color: #6b7280; margin-top: 4px;">"${tagline}"</div>` : ''}
      
      <!-- Horizontal Separator -->
      <div style="height: 1px; background-color: #f3f4f6; margin: 10px 0;"></div>
      
      <!-- Contact Info -->
      <table cellpadding="0" cellspacing="0" border="0" style="font-size: 12px; color: #4b5563;">
        <tr>
          <td style="padding-bottom: 4px;">
            <span style="color: #0d9488; font-weight: bold; margin-right: 4px;">✉</span> 
            <a href="mailto:${email}" style="color: #4b5563; text-decoration: none;">${email}</a>
          </td>
        </tr>
        <tr>
          <td>
            <span style="color: #0d9488; font-weight: bold; margin-right: 4px;">✦</span> 
            <span style="color: #9ca3af;">Created using ProfileForge AI Studio</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
  `;

  return res.status(200).json({ html: htmlSignature.trim() });
});

/**
 * POST /api/generate/linkedin
 * Uses Groq LLM to write an engaging LinkedIn "About Me" summary.
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
    const chatCompletion = await groq.chat.completions.create({
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
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7
    });

    const resultText = chatCompletion.choices[0]?.message?.content || '';
    return res.status(200).json({ text: resultText.trim() });
  } catch (error) {
    console.error('LinkedIn Bio Generation Route Error:', error);
    return res.status(500).json({ error: 'Failed to generate LinkedIn bio using AI' });
  }
});

export default router;

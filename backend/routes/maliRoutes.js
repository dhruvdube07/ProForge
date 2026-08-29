import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { generateMaliEmail } from '../groqClient.js';
import { 
  getSchedulesForUser, 
  readSchedules, 
  writeSchedules 
} from '../emailScheduler.js';

const router = express.Router();

// Helper to extract custom API key
const getCustomKey = (req) => {
  return req.headers['x-custom-groq-key'] || req.headers['x-custom-api-key'] || null;
};

/**
 * GET /api/mali/schedules
 * Fetch scheduled emails for the logged-in user.
 */
router.get('/schedules', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;
    const userSchedules = getSchedulesForUser(userId, userEmail);
    return res.status(200).json(userSchedules);
  } catch (error) {
    console.error('Error fetching schedules route:', error);
    return res.status(500).json({ error: 'Failed to retrieve email queue.' });
  }
});

/**
 * POST /api/mali/schedules
 * Queue a new email.
 */
router.post('/schedules', requireAuth, async (req, res) => {
  const { toEmail, subject, body, scheduledAt, isImmediate, senderName, fontFamily, bgTheme } = req.body;

  if (!toEmail || !subject || !body) {
    return res.status(400).json({ error: 'Recipient email, subject, and body are required.' });
  }

  try {
    const userId = req.user.id;
    const userEmail = req.user.email;
    const schedules = readSchedules();

    const newEmail = {
      id: `mali-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: userId,
      toEmail: toEmail,
      subject: subject,
      body: body,
      scheduledAt: isImmediate ? new Date().toISOString() : scheduledAt,
      status: 'pending',
      replyTo: userEmail,
      senderName: senderName || 'ProForge AI Mali Studio',
      fontFamily: fontFamily || 'Arial, sans-serif',
      bgTheme: bgTheme || '#ffffff',
      createdAt: new Date().toISOString()
    };

    schedules.push(newEmail);
    writeSchedules(schedules);

    return res.status(201).json(newEmail);
  } catch (error) {
    console.error('Error creating email schedule:', error);
    return res.status(500).json({ error: 'Failed to schedule email.' });
  }
});

/**
 * PUT /api/mali/schedules/:id
 * Edit details of a pending scheduled email.
 */
router.put('/schedules/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { toEmail, subject, body, scheduledAt, isImmediate, senderName, fontFamily, bgTheme } = req.body;

  try {
    const userId = req.user.id;
    const schedules = readSchedules();
    const index = schedules.findIndex(s => s.id === id && s.userId === userId);

    if (index === -1) {
      return res.status(404).json({ error: 'Email record not found or access denied.' });
    }

    const email = schedules[index];
    if (email.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending emails can be modified.' });
    }

    if (toEmail) email.toEmail = toEmail;
    if (subject) email.subject = subject;
    if (body) email.body = body;
    if (senderName) email.senderName = senderName;
    if (fontFamily) email.fontFamily = fontFamily;
    if (bgTheme) email.bgTheme = bgTheme;
    if (scheduledAt !== undefined) {
      email.scheduledAt = isImmediate ? new Date().toISOString() : scheduledAt;
    }

    writeSchedules(schedules);
    return res.status(200).json(email);
  } catch (error) {
    console.error('Error updating email schedule:', error);
    return res.status(500).json({ error: 'Failed to update email.' });
  }
});

/**
 * DELETE /api/mali/schedules/:id
 * Cancel / delete an email from the queue.
 */
router.delete('/schedules/:id', requireAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const userId = req.user.id;
    let schedules = readSchedules();
    
    const email = schedules.find(s => s.id === id && s.userId === userId);
    if (!email) {
      return res.status(404).json({ error: 'Email record not found or access denied.' });
    }

    schedules = schedules.filter(s => !(s.id === id && s.userId === userId));
    writeSchedules(schedules);

    return res.status(200).json({ message: 'Email canceled and removed from queue.' });
  } catch (error) {
    console.error('Error deleting email schedule:', error);
    return res.status(500).json({ error: 'Failed to cancel email.' });
  }
});

/**
 * POST /api/mali/generate
 * AI email template generation via Groq Llama/Qwen.
 */
router.post('/generate', requireAuth, async (req, res) => {
  const { profile, targetRole, companyContext, tone, promptInstruction } = req.body;

  if (!profile) {
    return res.status(400).json({ error: 'Active candidate profile is required for generation.' });
  }

  try {
    const customKey = getCustomKey(req);
    console.log(`Mali AI generating email draft for user ${req.user.email} (Custom key used: ${!!customKey})...`);
    
    const emailDraft = await generateMaliEmail(
      profile, 
      targetRole, 
      companyContext, 
      tone, 
      promptInstruction, 
      customKey
    );
    
    return res.status(200).json(emailDraft);
  } catch (error) {
    console.error('Mali AI Generator API Error:', error);
    return res.status(500).json({ error: 'AI email generation failed. Please check your inputs.' });
  }
});

export default router;

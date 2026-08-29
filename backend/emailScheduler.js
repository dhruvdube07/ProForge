import fs from 'fs';
import path from 'path';
import { sendCustomEmail } from './emailClient.js';

const dbPath = path.join(process.cwd(), 'scheduled_emails.json');

// Read the schedules from JSON file
export function readSchedules() {
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading scheduled emails file:', err);
  }
  return [];
}

// Write the schedules to JSON file
export function writeSchedules(schedules) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(schedules, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing scheduled emails file:', err);
  }
}

/**
 * Gets schedules for a specific user.
 * If the user has absolutely no records, we dynamically seed 2 mock example emails.
 */
export function getSchedulesForUser(userId, userEmail) {
  let schedules = readSchedules();
  const userSchedules = schedules.filter(s => s.userId === userId);

  if (userSchedules.length === 0) {
    // Generate 2 built-in scheduled examples
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 5);
    nextWeek.setHours(14, 30, 0, 0);

    const examples = [
      {
        id: `mock-1-${userId}`,
        userId: userId,
        toEmail: 'recruiter@techglobal.io',
        subject: 'Follow-up: Senior Software Developer Interview',
        body: `<p>Hi Sarah,</p><p>Thank you for taking the time to discuss the Senior Developer opportunity yesterday. I really enjoyed hearing about the team's upcoming cloud migration projects.</p><p>I am very excited about the possibility of joining the team and look forward to hearing about the next steps.</p><p>Best regards,<br><strong>[Your Name]</strong></p>`,
        scheduledAt: tomorrow.toISOString(),
        status: 'pending',
        replyTo: userEmail,
        createdAt: new Date().toISOString()
      },
      {
        id: `mock-2-${userId}`,
        userId: userId,
        toEmail: 'careers@innovationlabs.co',
        subject: 'Introduction: Passionate Full-Stack Engineer',
        body: `<p>Hello Hiring Team,</p><p>I have been following Innovation Labs' recent work in generative AI dashboards. With my background in building high-performance React applications, I wanted to reach out regarding potential opportunities.</p><p>You can <a href="http://localhost:5173/" style="color: #3b82f6; text-decoration: underline;">view my portfolio</a> to see some of my recent client-side React and Node.js work.</p><p>I would love to connect for a brief 10-minute introduction call.</p><p>Best,<br><strong>[Your Name]</strong></p>`,
        scheduledAt: nextWeek.toISOString(),
        status: 'pending',
        replyTo: userEmail,
        createdAt: new Date().toISOString()
      }
    ];

    schedules = [...schedules, ...examples];
    writeSchedules(schedules);
    return examples;
  }

  return userSchedules;
}

// Background scheduler interval runner
export function startEmailScheduler() {
  console.log('=========================================');
  console.log('  Mali AI Email Scheduler Daemon Started');
  console.log('=========================================');

  setInterval(async () => {
    try {
      const schedules = readSchedules();
      const now = new Date();
      let changed = false;

      for (const email of schedules) {
        if (email.status === 'pending' && new Date(email.scheduledAt) <= now) {
          console.log(`[Scheduler] Attempting to dispatch email ${email.id} to ${email.toEmail}...`);
          try {
            // For mock examples, if the email starts with mock, don't actually triggerSMTP (or trigger it, but fail gracefully if not authenticated)
            // Let's actually attempt to send it. If SMTP credentials fail, we mark it as failed, which is realistic!
            // Build the styled HTML body wrap dynamically if custom styles are chosen
            const fontFamily = email.fontFamily || 'Arial, sans-serif';
            const bgTheme = email.bgTheme || '#ffffff';
            const textColor = bgTheme === '#1e293b' || bgTheme === '#0f172a' ? '#ffffff' : '#1f2937';
            
            // Format styling wrap
            const styledBody = `
              <div style="font-family: ${fontFamily}; background-color: ${bgTheme}; padding: 32px 24px; color: ${textColor}; border-radius: 8px; border: 1px solid #e5e7eb; min-height: 100%;">
                <div style="max-width: 600px; margin: 0 auto; line-height: 1.6; font-size: 14px;">
                  ${email.body}
                </div>
              </div>
            `;
            
            await sendCustomEmail(email.toEmail, email.subject, styledBody, email.replyTo, email.senderName);
            
            email.status = 'sent';
            email.sentAt = new Date().toISOString();
            console.log(`[Scheduler] Email ${email.id} sent successfully!`);
          } catch (err) {
            console.error(`[Scheduler] Email dispatch failed for ${email.id}:`, err.message);
            email.status = 'failed';
            email.error = err.message || 'SMTP transmission failure';
          }
          changed = true;
        }
      }

      if (changed) {
        writeSchedules(schedules);
      }
    } catch (err) {
      console.error('[Scheduler Exception] Background queue error:', err);
    }
  }, 10000); // Poll every 10 seconds
}

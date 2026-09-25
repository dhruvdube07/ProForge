import express from 'express';
import { supabase } from '../supabaseClient.js';
import { sendOtpEmail, sendTestEmail } from '../emailClient.js';
import { requireAuth } from '../middleware/auth.js';
import { recordLogin } from '../loginHistory.js';
import { localStore } from '../localStore.js';

const router = express.Router();

// Helper to generate 6-digit OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * POST /api/auth/signup
 * Registers a pending signup, generating and sending an OTP to verify the user.
 */
router.post('/signup', async (req, res) => {
  const { email, password, firstName, lastName, gender } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'First name, last name, email, and password are required' });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    // 1. Check localStore first
    const localExisting = localStore.findUserByEmail(cleanEmail);
    if (localExisting) {
      return res.status(400).json({ error: 'An account with this email address already exists. Please log in instead.' });
    }

    // 2. Check Supabase if available
    try {
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
      if (!listError && users) {
        const existingUser = users.find(u => u.email?.toLowerCase() === cleanEmail);
        if (existingUser) {
          return res.status(400).json({ error: 'An account with this email address already exists. Please log in instead.' });
        }
      }
    } catch (e) {
      // Supabase is offline/unreachable, continue with local storage
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes expiry

    // Save in local storage
    localStore.saveOtp(cleanEmail, otp, expiresAt);

    // Also attempt Supabase if online
    try {
      await supabase.from('otps').delete().eq('email', cleanEmail);
      await supabase.from('otps').insert({ email: cleanEmail, otp, expires_at: expiresAt });
    } catch (e) {
      // ignore Supabase error
    }

    console.log(`\n========================================`);
    console.log(`[VERIFICATION OTP] Email: ${cleanEmail} -> CODE: ${otp}`);
    console.log(`========================================\n`);

    // Dispatch email if SMTP configured
    let emailSent = false;
    try {
      await sendOtpEmail(cleanEmail, otp);
      emailSent = true;
    } catch (mailErr) {
      console.warn('Notice: Zoho SMTP mail dispatch skipped/failed. OTP logged to console.');
    }

    return res.status(200).json({
      message: emailSent
        ? 'Verification OTP sent to your email inbox!'
        : `Verification code generated: ${otp} (Also logged to server console)`,
      otp: process.env.NODE_ENV !== 'production' ? otp : undefined
    });
  } catch (error) {
    console.error('Signup Route Error:', error);
    return res.status(500).json({ error: 'Internal server error during registration request.' });
  }
});

/**
 * POST /api/auth/verify-otp
 * Verifies OTP and registers user, returning authentication session tokens.
 */
router.post('/verify-otp', async (req, res) => {
  const { email, password, otp, firstName, lastName, gender } = req.body;

  if (!email || !password || !otp) {
    return res.status(400).json({ error: 'Email, password, and OTP are required' });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    // 1. Verify OTP via localStore or Supabase
    const isLocalOtpValid = localStore.verifyOtp(cleanEmail, String(otp).trim());
    let isOtpValid = isLocalOtpValid;

    if (!isOtpValid) {
      try {
        const now = new Date().toISOString();
        const { data: otpRecords } = await supabase
          .from('otps')
          .select('*')
          .eq('email', cleanEmail)
          .eq('otp', String(otp).trim())
          .gt('expires_at', now)
          .limit(1);

        if (otpRecords && otpRecords.length > 0) {
          isOtpValid = true;
          await supabase.from('otps').delete().eq('email', cleanEmail);
        }
      } catch (e) {
        // ignore
      }
    }

    if (!isOtpValid) {
      return res.status(400).json({ error: 'Invalid or expired OTP code. Please enter the latest OTP.' });
    }

    // 2. Create user in localStore
    let user;
    try {
      user = localStore.createUser({
        email: cleanEmail,
        password,
        firstName: firstName || 'User',
        lastName: lastName || '',
        gender: gender || 'luna'
      });
    } catch (userErr) {
      user = localStore.findUserByEmail(cleanEmail);
    }

    // 3. Attempt Supabase user registration if online
    try {
      await supabase.auth.admin.createUser({
        email: cleanEmail,
        password,
        email_confirm: true,
        user_metadata: {
          name: user.name,
          first_name: user.firstName,
          last_name: user.lastName,
          gender: user.gender
        }
      });
    } catch (e) {
      // Supabase is offline, continue with local auth
    }

    const token = localStore.generateToken(user);
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    await recordLogin(cleanEmail, clientIp, req.headers['user-agent']);

    return res.status(200).json({
      message: 'Account created and verified successfully!',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        first_name: user.firstName,
        last_name: user.lastName,
        gender: user.gender
      }
    });
  } catch (error) {
    console.error('OTP Verification Route Exception:', error);
    return res.status(500).json({ error: 'Internal server error during verification' });
  }
});

/**
 * POST /api/auth/login
 * Log in returning users using email + password.
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    // 1. Check localStore user
    const localUser = localStore.findUserByEmail(cleanEmail);
    if (localUser && localStore.validatePassword(localUser, password)) {
      const token = localStore.generateToken(localUser);
      const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      await recordLogin(cleanEmail, clientIp, req.headers['user-agent']);

      return res.status(200).json({
        message: 'Logged in successfully',
        token,
        user: {
          id: localUser.id,
          email: localUser.email,
          name: localUser.name,
          first_name: localUser.firstName,
          last_name: localUser.lastName,
          gender: localUser.gender || 'luna'
        }
      });
    }

    // 2. Fallback to Supabase if online
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      });

      if (!error && data?.user) {
        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        await recordLogin(cleanEmail, clientIp, req.headers['user-agent']);

        return res.status(200).json({
          message: 'Logged in successfully',
          token: data.session.access_token,
          user: {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name || cleanEmail.split('@')[0],
            first_name: data.user.user_metadata?.first_name || data.user.user_metadata?.name?.split(' ')[0] || cleanEmail.split('@')[0],
            last_name: data.user.user_metadata?.last_name || data.user.user_metadata?.name?.split(' ')[1] || '',
            gender: data.user.user_metadata?.gender || 'luna'
          }
        });
      }
    } catch (supaErr) {
      // Supabase is offline
    }

    return res.status(400).json({ error: 'Invalid email or password. Please verify your credentials or create an account.' });
  } catch (error) {
    console.error('Login Route Exception:', error);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
});

/**
 * POST /api/auth/resend-otp
 */
router.post('/resend-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  localStore.saveOtp(cleanEmail, otp, expiresAt);

  console.log(`\n========================================`);
  console.log(`[RESENT OTP] Email: ${cleanEmail} -> CODE: ${otp}`);
  console.log(`========================================\n`);

  try {
    await sendOtpEmail(cleanEmail, otp);
  } catch (e) {
    // console log fallback
  }

  return res.status(200).json({
    message: `A fresh OTP code has been generated: ${otp}`,
    otp: process.env.NODE_ENV !== 'production' ? otp : undefined
  });
});

/**
 * POST /api/auth/forgot-password
 * Generates and sends an OTP for password reset.
 */
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required' });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    // 1. Check if user exists in localStore or Supabase
    const localUser = localStore.findUserByEmail(cleanEmail);
    let userExists = !!localUser;

    if (!userExists) {
      try {
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
        if (!listError && users) {
          const existing = users.find(u => u.email?.toLowerCase() === cleanEmail);
          if (existing) userExists = true;
        }
      } catch (e) {
        // Supabase offline, ignore
      }
    }

    if (!userExists) {
      return res.status(404).json({ error: 'No account registered with this email address. Please sign up or verify spelling.' });
    }

    // 2. Generate 6-digit OTP
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    localStore.saveOtp(cleanEmail, otp, expiresAt);

    try {
      await supabase.from('otps').delete().eq('email', cleanEmail);
      await supabase.from('otps').insert({ email: cleanEmail, otp, expires_at: expiresAt });
    } catch (e) {
      // ignore Supabase error
    }

    console.log(`\n========================================`);
    console.log(`[PASSWORD RESET OTP] Email: ${cleanEmail} -> CODE: ${otp}`);
    console.log(`========================================\n`);

    // 3. Dispatch email if SMTP configured
    let emailSent = false;
    try {
      await sendOtpEmail(cleanEmail, otp);
      emailSent = true;
    } catch (mailErr) {
      console.warn('Notice: Zoho SMTP mail dispatch skipped/failed. Password reset OTP logged to console.');
    }

    return res.status(200).json({
      message: emailSent
        ? 'Password reset OTP has been sent to your email inbox!'
        : `Reset code generated: ${otp} (Also logged to server console)`,
      otp: process.env.NODE_ENV !== 'production' ? otp : undefined
    });
  } catch (error) {
    console.error('Forgot Password Route Error:', error);
    return res.status(500).json({ error: 'Internal server error while processing password reset request.' });
  }
});

/**
 * POST /api/auth/reset-password
 * Verifies OTP and updates user's password.
 */
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ error: 'Email, OTP code, and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters long' });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    // 1. Verify OTP
    let isOtpValid = localStore.verifyOtp(cleanEmail, String(otp).trim());

    if (!isOtpValid) {
      try {
        const now = new Date().toISOString();
        const { data: otpRecords } = await supabase
          .from('otps')
          .select('*')
          .eq('email', cleanEmail)
          .eq('otp', String(otp).trim())
          .gt('expires_at', now)
          .limit(1);

        if (otpRecords && otpRecords.length > 0) {
          isOtpValid = true;
          await supabase.from('otps').delete().eq('email', cleanEmail);
        }
      } catch (e) {
        // ignore
      }
    }

    if (!isOtpValid) {
      return res.status(400).json({ error: 'Invalid or expired OTP reset code. Please request a new code.' });
    }

    // 2. Update password in localStore
    let user = localStore.findUserByEmail(cleanEmail);
    if (user) {
      user = localStore.updatePassword(cleanEmail, newPassword);
    } else {
      user = localStore.createUser({
        email: cleanEmail,
        password: newPassword,
        firstName: cleanEmail.split('@')[0],
        lastName: '',
        gender: 'luna'
      });
    }

    // 3. Update in Supabase if online
    try {
      const { data: { users } } = await supabase.auth.admin.listUsers();
      const supaUser = users?.find(u => u.email?.toLowerCase() === cleanEmail);
      if (supaUser) {
        await supabase.auth.admin.updateUserById(supaUser.id, { password: newPassword });
      }
    } catch (e) {
      // Supabase is offline
    }

    // 4. Issue authenticated session token
    const token = localStore.generateToken(user);
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    await recordLogin(cleanEmail, clientIp, req.headers['user-agent']);

    return res.status(200).json({
      message: 'Password reset successfully! You are now logged in.',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        first_name: user.firstName,
        last_name: user.lastName,
        gender: user.gender || 'luna'
      }
    });
  } catch (error) {
    console.error('Reset Password Route Error:', error);
    return res.status(500).json({ error: 'Internal server error while resetting password.' });
  }
});

/**
 * PUT /api/auth/update-profile
 */
router.put('/update-profile', requireAuth, async (req, res) => {
  const { firstName, lastName, gender } = req.body;

  try {
    const user = localStore.findUserById(req.user.id);
    if (user) {
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (firstName || lastName) user.name = `${user.firstName} ${user.lastName}`.trim();
      if (gender) user.gender = gender;
    }

    return res.status(200).json({
      message: 'Profile updated successfully!',
      user: {
        id: req.user.id,
        email: req.user.email,
        name: `${firstName || req.user.user_metadata?.first_name || ''} ${lastName || req.user.user_metadata?.last_name || ''}`.trim(),
        first_name: firstName || req.user.user_metadata?.first_name,
        last_name: lastName || req.user.user_metadata?.last_name,
        gender: gender || req.user.user_metadata?.gender
      }
    });
  } catch (err) {
    console.error('Update Profile Route Exception:', err);
    return res.status(500).json({ error: 'Internal server error during profile update' });
  }
});

/**
 * POST /api/auth/send-test-email
 */
router.post('/send-test-email', requireAuth, async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Recipient email is required' });
  }

  try {
    await sendTestEmail(email);
    return res.status(200).json({ message: 'Diagnostic test email sent successfully!' });
  } catch (error) {
    console.error('Test Email Diagnostic Route Error:', error);
    return res.status(500).json({ error: 'Failed to send test email. Check SMTP server parameters.' });
  }
});

export default router;

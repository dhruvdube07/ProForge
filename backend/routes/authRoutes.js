import express from 'express';
import { supabase } from '../supabaseClient.js';
import { sendOtpEmail, sendTestEmail } from '../emailClient.js';
import { requireAuth } from '../middleware/auth.js';
import { recordLogin } from '../loginHistory.js';

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

  if (!email || !password || !firstName || !lastName || !gender) {
    return res.status(400).json({ error: 'First name, last name, email, password, and gender are required' });
  }

  try {
    // Check if the user already exists in auth.users by listing users
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.error('Error listing users during signup check:', listError);
    } else {
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        return res.status(400).json({ error: 'An account with this email address already exists. Please log in instead.' });
      }
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes expiry

    // Delete any existing OTPs for this email to prevent spam
    await supabase.from('otps').delete().eq('email', email);

    // Store OTP in database
    const { error: dbError } = await supabase
      .from('otps')
      .insert({ email, otp, expires_at: expiresAt });

    if (dbError) {
      console.error('Error inserting OTP:', dbError);
      return res.status(500).json({ error: 'Failed to generate verification session' });
    }

    // Send email via Zoho SMTP
    await sendOtpEmail(email, otp);

    return res.status(200).json({ message: 'Verification OTP sent successfully! Please check your email inbox.' });
  } catch (error) {
    console.error('Signup Route Error:', error);
    return res.status(500).json({ error: 'Internal server error during registration request.' });
  }
});

/**
 * POST /api/auth/verify-otp
 * Verifies OTP and registers user in Supabase with email + password, returning native JWT token.
 */
router.post('/verify-otp', async (req, res) => {
  const { email, password, otp, firstName, lastName, gender } = req.body;

  if (!email || !password || !otp || !firstName || !lastName || !gender) {
    return res.status(400).json({ error: 'Email, password, OTP, first name, last name, and gender are required' });
  }

  try {
    // 1. Verify OTP
    const now = new Date().toISOString();
    const { data: otpRecords, error: otpError } = await supabase
      .from('otps')
      .select('*')
      .eq('email', email)
      .eq('otp', otp)
      .gt('expires_at', now)
      .order('created_at', { ascending: false })
      .limit(1);

    if (otpError) {
      console.error('Error verifying OTP:', otpError);
      return res.status(500).json({ error: 'Database query error during verification' });
    }

    if (!otpRecords || otpRecords.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired OTP. Please request a new one.' });
    }

    // Clean up OTP record
    await supabase.from('otps').delete().eq('email', email);

    // 2. Create user in Supabase Auth
    const { data: authData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name: `${firstName} ${lastName}`,
        first_name: firstName,
        last_name: lastName,
        gender: gender
      }
    });

    if (createError) {
      console.error('Supabase admin createUser error:', createError);
      return res.status(400).json({ error: `Registration failed: ${createError.message}` });
    }

    // 3. Sign in the newly created user to retrieve official session tokens
    const { data: sessionData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) {
      console.error('Login error after registration:', signInError);
      return res.status(500).json({ error: `Sign up succeeded but sign in failed: ${signInError.message}` });
    }

    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    await recordLogin(email, clientIp, req.headers['user-agent']);

    return res.status(200).json({
      message: 'Account created successfully!',
      token: sessionData.session.access_token,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: authData.user.user_metadata?.name || `${firstName} ${lastName}`,
        first_name: authData.user.user_metadata?.first_name || firstName,
        last_name: authData.user.user_metadata?.last_name || lastName,
        gender: authData.user.user_metadata?.gender || gender
      }
    });

  } catch (error) {
    console.error('OTP Verification Route Exception:', error);
    return res.status(500).json({ error: 'Internal server error during verification' });
  }
});

/**
 * POST /api/auth/login
 * Log in returning users using email + password. Returns official Supabase JWT token.
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Supabase signInWithPassword error:', error);
      return res.status(400).json({ error: error.message });
    }

    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    await recordLogin(email, clientIp, req.headers['user-agent']);

    return res.status(200).json({
      message: 'Logged in successfully',
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || email.split('@')[0],
        first_name: data.user.user_metadata?.first_name || data.user.user_metadata?.name?.split(' ')[0] || email.split('@')[0],
        last_name: data.user.user_metadata?.last_name || data.user.user_metadata?.name?.split(' ')[1] || '',
        gender: data.user.user_metadata?.gender || 'male'
      }
    });
  } catch (error) {
    console.error('Login Route Exception:', error);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
});

/**
 * POST /api/auth/resend-otp
 * Resends a fresh OTP to the user's email.
 */
router.post('/resend-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // Re-generate OTP session
    await supabase.from('otps').delete().eq('email', email);
    const { error: dbError } = await supabase
      .from('otps')
      .insert({ email, otp, expires_at: expiresAt });

    if (dbError) {
      console.error('Resend OTP db error:', dbError);
      return res.status(500).json({ error: 'Failed to generate new OTP' });
    }

    await sendOtpEmail(email, otp);
    return res.status(200).json({ message: 'A new OTP has been sent successfully!' });
  } catch (error) {
    console.error('Resend OTP Exception:', error);
    return res.status(500).json({ error: 'Internal server error during resending OTP' });
  }
});

/**
 * PUT /api/auth/update-profile
 * Updates authenticated user's metadata details.
 */
router.put('/update-profile', requireAuth, async (req, res) => {
  const { firstName, lastName, gender } = req.body;

  try {
    const { data, error } = await supabase.auth.admin.updateUserById(req.user.id, {
      user_metadata: {
        ...req.user.user_metadata,
        first_name: firstName || req.user.user_metadata?.first_name,
        last_name: lastName || req.user.user_metadata?.last_name,
        name: firstName && lastName ? `${firstName} ${lastName}` : req.user.user_metadata?.name,
        gender: gender || req.user.user_metadata?.gender
      }
    });

    if (error) {
      console.error('Supabase admin updateUserById error:', error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: 'Profile updated successfully!',
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name,
        first_name: data.user.user_metadata?.first_name,
        last_name: data.user.user_metadata?.last_name,
        gender: data.user.user_metadata?.gender
      }
    });
  } catch (err) {
    console.error('Update Profile Route Exception:', err);
    return res.status(500).json({ error: 'Internal server error during profile update' });
  }
});

/**
 * POST /api/auth/send-test-email
 * Dispatches a diagnostic test email to the user's destination email address.
 */
router.post('/send-test-email', requireAuth, async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Recipient email is required' });
  }

  try {
    console.log(`Sending diagnostic test email to ${email} for user ${req.user.email}...`);
    await sendTestEmail(email);
    return res.status(200).json({ message: 'Diagnostic test email sent successfully!' });
  } catch (error) {
    console.error('Test Email Diagnostic Route Error:', error);
    return res.status(500).json({ error: 'Failed to send test email. Check SMTP server parameters.' });
  }
});

export default router;

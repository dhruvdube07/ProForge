import { supabase } from '../supabaseClient.js';

/**
 * Express middleware to enforce authentication via native Supabase JWT verification.
 */
export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.error('Supabase JWT Auth Error:', error?.message || 'User not found');
      return res.status(401).json({ error: 'Invalid or expired authentication token' });
    }

    req.user = user; // Contains id, email, and user_metadata
    next();
  } catch (error) {
    console.error('Auth Middleware Exception:', error);
    return res.status(500).json({ error: 'Internal server error during auth verification' });
  }
};

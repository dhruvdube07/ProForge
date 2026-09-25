import { supabase } from '../supabaseClient.js';
import { localStore } from '../localStore.js';

/**
 * Express middleware to enforce authentication via localStore JWT or native Supabase JWT.
 */
export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  // 1. Try localStore token verification first
  const decoded = localStore.verifyToken(token);
  if (decoded) {
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      user_metadata: {
        name: decoded.name,
        first_name: decoded.first_name,
        last_name: decoded.last_name,
        gender: decoded.gender
      }
    };
    return next();
  }

  // 2. Fallback to Supabase verification if online
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired authentication token' });
    }

    req.user = user;
    return next();
  } catch (error) {
    console.error('Supabase Auth verification unreachable, invalid token');
    return res.status(401).json({ error: 'Invalid or expired authentication session' });
  }
};

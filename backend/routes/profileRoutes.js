import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

const DB_COLUMNS = [
  'id', 'user_id', 'name', 'profession', 'skills', 'soft_skills', 'hobbies', 
  'interests', 'strengths', 'achievements', 'goal', 'personality_traits', 
  'values', 'tagline', 'bio', 'template_preference', 'font_preference', 
  'created_at', 'updated_at'
];

/**
 * Packs all non-native columns (e.g. experience, education, contact_email) 
 * into the 'values' JSONB column to adapt to the Supabase schema.
 */
function serializeProfile(profileData) {
  const dbData = {};
  const extra = {};
  
  for (const [key, value] of Object.entries(profileData)) {
    if (DB_COLUMNS.includes(key)) {
      dbData[key] = value;
    } else {
      extra[key] = value;
    }
  }
  
  // If the profileData has its own values array, preserve it as values_list
  if (profileData.values) {
    extra.values_list = profileData.values;
  }
  
  dbData.values = extra;
  return dbData;
}

/**
 * Unpacks the packed attributes inside the 'values' JSONB column 
 * back to the root level of the profile object.
 */
function deserializeProfile(dbData) {
  if (!dbData) return dbData;
  const profile = { ...dbData };
  
  if (dbData.values && typeof dbData.values === 'object' && !Array.isArray(dbData.values)) {
    const extra = dbData.values;
    Object.assign(profile, extra);
    
    if (extra.values_list) {
      profile.values = extra.values_list;
      delete profile.values_list;
    } else {
      profile.values = [];
    }
  } else {
    profile.values = Array.isArray(dbData.values) ? dbData.values : [];
  }
  
  return profile;
}

/**
 * GET /api/profiles/public/:idOrSlug
 * Public endpoint to fetch a single profile by ID or by custom slug.
 * Access is guest-friendly (requires no authentication headers).
 */
router.get('/public/:idOrSlug', async (req, res) => {
  const { idOrSlug } = req.params;

  try {
    let query = supabase.from('profiles').select('*');
    
    // Check if UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(idOrSlug)) {
      query = query.eq('id', idOrSlug);
    } else {
      query = query.eq('values->>slug', idOrSlug);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      console.error('Error fetching public profile:', error);
      return res.status(404).json({ error: 'Public profile not found' });
    }

    return res.status(200).json(deserializeProfile(data[0]));
  } catch (err) {
    console.error('Public fetch profile route error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/profiles
 * Fetches all saved profiles belonging to the authenticated user.
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', req.user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching profiles:', error);
      return res.status(500).json({ error: error.message });
    }

    const deserializedData = data.map(row => deserializeProfile(row));
    return res.status(200).json(deserializedData);
  } catch (err) {
    console.error('Fetch profiles route error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/profiles/:id
 * Fetches a single profile by ID, verifying ownership.
 */
router.get('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (error) {
      console.error('Error fetching profile detail:', error);
      return res.status(404).json({ error: 'Profile not found or access denied' });
    }

    return res.status(200).json(deserializeProfile(data));
  } catch (err) {
    console.error('Fetch profile detail route error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/profiles
 * Saves a new profile for the authenticated user.
 */
router.post('/', requireAuth, async (req, res) => {
  const profileData = req.body;

  try {
    const serializedData = serializeProfile(profileData);
    
    // Inject user ID and timestamp
    serializedData.user_id = req.user.id;
    serializedData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('profiles')
      .insert(serializedData)
      .select()
      .single();

    if (error) {
      console.error('Error inserting profile:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(deserializeProfile(data));
  } catch (err) {
    console.error('Create profile route error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/profiles/:id
 * Updates an existing profile, verifying ownership.
 */
router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Do not allow updating the user_id or id
  delete updateData.id;
  delete updateData.user_id;

  try {
    const serializedData = serializeProfile(updateData);
    serializedData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('profiles')
      .update(serializedData)
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(deserializeProfile(data));
  } catch (err) {
    console.error('Update profile route error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/profiles/:id
 * Deletes a profile, verifying ownership.
 */
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select();

    if (error) {
      console.error('Error deleting profile:', error);
      return res.status(500).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Profile not found or access denied' });
    }

    return res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (err) {
    console.error('Delete profile route error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

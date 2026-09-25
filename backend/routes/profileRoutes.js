import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { supabase } from '../supabaseClient.js';
import { localStore } from '../localStore.js';

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
 */
router.get('/public/:idOrSlug', async (req, res) => {
  const { idOrSlug } = req.params;

  // 1. Try localStore
  const localProf = localStore.getProfileById(idOrSlug);
  if (localProf) {
    return res.status(200).json(localProf);
  }

  // 2. Try Supabase
  try {
    let query = supabase.from('profiles').select('*');
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(idOrSlug)) {
      query = query.eq('id', idOrSlug);
    } else {
      query = query.eq('values->>slug', idOrSlug);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return res.status(200).json(deserializeProfile(data[0]));
    }
  } catch (err) {
    // Supabase offline
  }

  return res.status(404).json({ error: 'Public profile not found' });
});

/**
 * GET /api/profiles
 */
router.get('/', requireAuth, async (req, res) => {
  // 1. Try Supabase if online
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', req.user.id)
      .order('updated_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return res.status(200).json(data.map(row => deserializeProfile(row)));
    }
  } catch (err) {
    // Supabase offline, fallback to localStore
  }

  // 2. Local fallback
  const localList = localStore.getProfilesByUser(req.user.id);
  return res.status(200).json(localList);
});

/**
 * GET /api/profiles/:id
 */
router.get('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;

  // 1. Check localStore
  const localProf = localStore.getProfileById(id);
  if (localProf && localProf.user_id === req.user.id) {
    return res.status(200).json(localProf);
  }

  // 2. Fallback to Supabase
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (!error && data) {
      return res.status(200).json(deserializeProfile(data));
    }
  } catch (err) {
    // offline
  }

  return res.status(404).json({ error: 'Profile not found or access denied' });
});

/**
 * POST /api/profiles
 */
router.post('/', requireAuth, async (req, res) => {
  const profileData = req.body;

  // Always save locally first for instant, guaranteed persistence
  const savedLocal = localStore.saveProfile(profileData, req.user.id);

  // Sync to Supabase in background if online
  try {
    const serializedData = serializeProfile(savedLocal);
    serializedData.user_id = req.user.id;
    serializedData.updated_at = new Date().toISOString();
    await supabase.from('profiles').insert(serializedData);
  } catch (err) {
    // Supabase offline, local saved safely
  }

  return res.status(201).json(savedLocal);
});

/**
 * PUT /api/profiles/:id
 */
router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  delete updateData.user_id;

  // Update in localStore
  const updatedLocal = localStore.saveProfile({ ...updateData, id }, req.user.id);

  // Sync to Supabase in background if online
  try {
    const serializedData = serializeProfile(updatedLocal);
    serializedData.updated_at = new Date().toISOString();
    await supabase.from('profiles').update(serializedData).eq('id', id).eq('user_id', req.user.id);
  } catch (err) {
    // offline
  }

  return res.status(200).json(updatedLocal);
});

/**
 * DELETE /api/profiles/:id
 */
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;

  localStore.deleteProfile(id, req.user.id);

  try {
    await supabase.from('profiles').delete().eq('id', id).eq('user_id', req.user.id);
  } catch (err) {
    // offline
  }

  return res.status(200).json({ message: 'Profile deleted successfully' });
});

export default router;

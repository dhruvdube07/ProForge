import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

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

    return res.status(200).json(data);
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

    return res.status(200).json(data);
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
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        ...profileData,
        user_id: req.user.id,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting profile:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(data);
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
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
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

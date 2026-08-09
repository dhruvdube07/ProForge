import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';

export const useProfile = () => {
  const { token } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dbTablesError, setDbTablesError] = useState(false);

  /**
   * Identifies database missing-table errors from messages.
   */
  const checkDbError = useCallback((err) => {
    const msg = err.message || '';
    if (
      msg.includes('public.profiles') ||
      msg.includes('public.otps') ||
      msg.includes('relation "profiles" does not exist') ||
      msg.includes('relation "otps" does not exist') ||
      msg.includes('Could not find the table')
    ) {
      setDbTablesError(true);
    }
  }, []);

  /**
   * Helper to perform authenticated fetch requests.
   */
  const authFetch = useCallback(async (url, options = {}) => {
    if (!token) {
      throw new Error('User is not authenticated');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      let errorMsg = 'API request failed';
      try {
        const errorData = await response.json();
        errorMsg = errorData.error || errorMsg;
      } catch (e) {
        // Ignore
      }
      throw new Error(errorMsg);
    }

    return response;
  }, [token]);

  /**
   * Fetch all profiles for the current user.
   */
  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch('/api/profiles');
      const data = await res.json();
      setProfiles(data);
      setDbTablesError(false); // Reset if success
      return data;
    } catch (err) {
      checkDbError(err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [authFetch, checkDbError]);

  /**
   * Fetch a single profile by ID.
   */
  const fetchProfile = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch(`/api/profiles/${id}`);
      setDbTablesError(false);
      return await res.json();
    } catch (err) {
      checkDbError(err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [authFetch, checkDbError]);

  /**
   * Save a new profile.
   */
  const createProfile = useCallback(async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch('/api/profiles', {
        method: 'POST',
        body: JSON.stringify(profileData)
      });
      const data = await res.json();
      setProfiles(prev => [data, ...prev]);
      setDbTablesError(false);
      return data;
    } catch (err) {
      checkDbError(err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [authFetch, checkDbError]);

  /**
   * Update an existing profile.
   */
  const updateProfile = useCallback(async (id, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch(`/api/profiles/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
      const data = await res.json();
      setProfiles(prev => prev.map(p => p.id === id ? data : p));
      setDbTablesError(false);
      return data;
    } catch (err) {
      checkDbError(err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [authFetch, checkDbError]);

  /**
   * Delete a profile.
   */
  const deleteProfile = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await authFetch(`/api/profiles/${id}`, {
        method: 'DELETE'
      });
      setProfiles(prev => prev.filter(p => p.id !== id));
      setDbTablesError(false);
      return true;
    } catch (err) {
      checkDbError(err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [authFetch, checkDbError]);

  /**
   * Send text description to Groq API for analysis.
   */
  const analyzeText = useCallback(async (text) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch('/api/analyze', {
        method: 'POST',
        body: JSON.stringify({ text })
      });
      return await res.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  /**
   * Generate PDF Resume (trigger browser download).
   */
  const generateResume = useCallback(async (profile) => {
    setError(null);
    try {
      const response = await authFetch('/api/generate/resume', {
        method: 'POST',
        body: JSON.stringify(profile)
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(profile.name || 'Remo').replace(/\s+/g, '_')}_resume.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [authFetch]);

  /**
   * Generate PDF Cover Letter (trigger browser download).
   */
  const generateCoverLetter = useCallback(async (profile, companyName, jobTitle, letterContent) => {
    setError(null);
    try {
      const response = await authFetch('/api/generate/cover-letter', {
        method: 'POST',
        body: JSON.stringify({ profile, companyName, jobTitle, letterContent })
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(profile.name || 'Remo').replace(/\s+/g, '_')}_cover_letter.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [authFetch]);

  /**
   * Generate HTML Email Signature.
   */
  const generateSignature = useCallback(async (profile) => {
    setError(null);
    try {
      const res = await authFetch('/api/generate/signature', {
        method: 'POST',
        body: JSON.stringify(profile)
      });
      const data = await res.json();
      return data.html;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [authFetch]);

  /**
   * Generate AI LinkedIn Bio.
   */
  const generateLinkedIn = useCallback(async (profile) => {
    setError(null);
    try {
      const res = await authFetch('/api/generate/linkedin', {
        method: 'POST',
        body: JSON.stringify(profile)
      });
      const data = await res.json();
      return data.text;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [authFetch]);

  /**
   * Fetch PDF Resume as inline URL for iframe preview.
   */
  const getResumePreviewUrl = useCallback(async (profile) => {
    setError(null);
    try {
      const response = await authFetch('/api/generate/resume-preview', {
        method: 'POST',
        body: JSON.stringify(profile)
      });
      const blob = await response.blob();
      return window.URL.createObjectURL(blob);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [authFetch]);

  const refineText = useCallback(async (baseProfile, companyContext, sliders) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch('/api/analyze/refine', {
        method: 'POST',
        body: JSON.stringify({ baseProfile, companyContext, sliders })
      });
      return await res.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  return {
    profiles,
    loading,
    error,
    dbTablesError,
    fetchProfiles,
    fetchProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    analyzeText,
    generateResume,
    generateCoverLetter,
    generateSignature,
    generateLinkedIn,
    getResumePreviewUrl,
    refineText
  };
};

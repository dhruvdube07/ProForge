import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, Download, Calendar, Sparkles } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import DownloadButtons from '../components/DownloadButtons';

export default function ProfileDetail() {
  const { id } = useParams();
  const { fetchProfile, generateResume, loading, error } = useProfile();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile(id)
      .then(data => setProfile(data))
      .catch(err => console.error('Error fetching profile:', err));
  }, [id, fetchProfile]);

  const handleEdit = () => {
    navigate('/dashboard', { state: { profile } });
  };

  const handleDownload = async () => {
    try {
      await generateResume(profile);
    } catch (err) {
      alert(`Error downloading resume: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-10 h-10 border-4 border-themePrimary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-themeTextSecondary">Loading profile details...</span>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-theme text-sm font-semibold">
          {error || 'Profile not found.'}
        </div>
        <button
          onClick={() => navigate('/profiles')}
          className="flex items-center gap-1.5 mx-auto py-2 px-4 bg-themeBg hover:bg-themeBorder text-themeText text-xs font-semibold rounded-theme border border-themeBorder cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Profiles
        </button>
      </div>
    );
  }

  const parseArray = (field) => {
    if (Array.isArray(field)) return field;
    try { return JSON.parse(field); } catch (e) { return []; }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center border-b border-themeBorder pb-4">
        <button
          onClick={() => navigate('/profiles')}
          className="flex items-center gap-1.5 py-2 px-3 border border-themeBorder hover:bg-themeBg rounded-theme text-xs font-semibold text-themeText transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to History
        </button>

        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 py-2 px-3 bg-themePrimary hover:bg-themePrimaryDark text-white text-xs font-semibold rounded-theme shadow cursor-pointer transition-colors"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>
          <button
            onClick={handleEdit}
            className="flex items-center gap-1.5 py-2 px-3 bg-themeBg hover:bg-themeBorder text-themeText text-xs font-semibold rounded-theme border border-themeBorder cursor-pointer transition-colors"
          >
            <Edit3 className="h-4 w-4 text-themePrimary" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="glass-panel p-8 rounded-theme space-y-6 text-left">
        {/* Name and Title */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-themeText">{profile.name}</h1>
            <span className="text-xxs px-2 py-0.5 rounded-full bg-themePrimary/10 text-themePrimary font-bold uppercase">
              {profile.template_preference || 'Modern'}
            </span>
          </div>
          <p className="text-lg text-themePrimary font-semibold">{profile.profession}</p>
          {profile.tagline && <p className="text-sm text-themeTextSecondary italic">"{profile.tagline}"</p>}
        </div>

        {/* Saved Timestamp */}
        <div className="flex items-center gap-1 text-xs text-themeTextSecondary">
          <Calendar className="h-4 w-4" />
          <span>Last modified: {new Date(profile.updated_at).toLocaleString()}</span>
        </div>

        <div className="h-px bg-themeBorder"></div>

        {/* Narrative columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-bold text-themeTextSecondary uppercase tracking-wider mb-2">About Me</h3>
            <p className="text-sm text-themeText leading-relaxed bg-themeBg p-4 rounded-theme border border-themeBorder">
              {profile.bio || 'No bio entered.'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-themeTextSecondary uppercase tracking-wider mb-2">Career Goal</h3>
            <p className="text-sm text-themeText leading-relaxed bg-themeBg p-4 rounded-theme border border-themeBorder">
              {profile.goal || 'No goal entered.'}
            </p>
          </div>
        </div>

        <div className="h-px bg-themeBorder"></div>

        {/* Badge Grids read-only view */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-themeTextSecondary uppercase tracking-wider">Profile Characteristics</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'Technical Skills', key: 'skills' },
              { title: 'Soft Skills', key: 'soft_skills' },
              { title: 'Strengths', key: 'strengths' },
              { title: 'Achievements', key: 'achievements' },
              { title: 'Hobbies', key: 'hobbies' },
              { title: 'Interests', key: 'interests' },
              { title: 'Personality Traits', key: 'personality_traits' },
              { title: 'Values', key: 'values' }
            ].map((section) => {
              const items = parseArray(profile[section.key]);
              if (items.length === 0) return null;
              return (
                <div key={section.key} className="bg-themeBg p-4 rounded-theme border border-themeBorder space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wide text-themePrimary">{section.title}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((item, idx) => (
                      <span key={idx} className="bg-themeCard py-1 px-2.5 rounded-full border border-themeBorder text-xs text-themeText font-medium">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="h-px bg-themeBorder"></div>

        {/* Quick export suite */}
        <DownloadButtons profile={profile} />
      </div>
    </div>
  );
}

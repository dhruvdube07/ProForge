import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Edit3, Trash2, Download, Sparkles, Calendar, Tag } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';

export default function MyProfiles() {
  const { profiles, loading, error, fetchProfiles, deleteProfile, generateResume } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfiles().catch(err => console.error('Failed to load profiles:', err));
  }, [fetchProfiles]);

  const handleEdit = (profile) => {
    // Navigate to dashboard and send the profile in location state
    navigate('/dashboard', { state: { profile } });
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this profile from your history?')) {
      try {
        await deleteProfile(id);
      } catch (err) {
        alert(`Error deleting profile: ${err.message}`);
      }
    }
  };

  const handleDownload = async (profile, e) => {
    e.stopPropagation();
    try {
      await generateResume(profile);
    } catch (err) {
      alert(`Error downloading resume: ${err.message}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-themeBorder pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-themeText flex items-center gap-2">
            <History className="h-6 w-6 sm:h-7 sm:w-7 text-themePrimary" />
            My Profiles History
          </h1>
          <p className="text-xs sm:text-sm text-themeTextSecondary mt-1">
            Access, download, or edit your saved resumes and branding structures.
          </p>
        </div>
        
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 py-2 px-4 bg-themePrimary hover:bg-themePrimaryDark text-white font-semibold rounded-theme text-xs sm:text-sm shadow hover-lift transition-all duration-300 cursor-pointer"
        >
          <Sparkles className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          Create New Profile
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-theme text-center">
          {error}
        </div>
      )}

      {loading && profiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-10 h-10 border-4 border-themePrimary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-themeTextSecondary">Loading saved profiles...</span>
        </div>
      ) : profiles.length === 0 ? (
        /* Empty State */
        <div className="glass-panel max-w-md mx-auto p-8 rounded-theme text-center space-y-5 py-12">
          <div className="w-16 h-16 bg-themePrimary/10 rounded-full flex items-center justify-center mx-auto text-themePrimary">
            <History className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-themeText">No Profiles Found</h3>
            <p className="text-sm text-themeTextSecondary">
              You haven't generated or saved any profiles yet. Start by writing a self-description!
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-2.5 px-4 bg-themePrimary hover:bg-themePrimaryDark text-white font-semibold rounded-theme text-sm transition-all duration-300 cursor-pointer hover-lift"
          >
            Forge Your First Profile
          </button>
        </div>
      ) : (
        /* Profiles Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              onClick={() => handleEdit(profile)}
              className="glass-panel p-6 rounded-theme relative overflow-hidden group cursor-pointer hover-lift text-left"
            >
              {/* Badge for Template Type */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-themePrimary/10 text-themePrimary text-xxs font-semibold uppercase tracking-wider">
                <Tag className="h-3 w-3" />
                {profile.template_preference || 'Modern'}
              </div>

              {/* Title & Profession */}
              <div className="space-y-1 pr-16">
                <h3 className="font-bold text-lg text-themeText truncate group-hover:text-themePrimary transition-colors">
                  {profile.name || 'Untitled Profile'}
                </h3>
                <p className="text-xs text-themePrimary font-semibold tracking-wide uppercase truncate">
                  {profile.profession || 'Professional'}
                </p>
              </div>

              {/* Tagline / Bio Summary */}
              <p className="text-xs text-themeTextSecondary italic mt-3 line-clamp-2">
                {profile.tagline ? `"${profile.tagline}"` : profile.bio || 'No summary text available.'}
              </p>

              {/* Footer Divider */}
              <div className="h-px bg-themeBorder my-4"></div>

              {/* Saved Timestamp */}
              <div className="flex items-center gap-1 text-xxs text-themeTextSecondary mb-4">
                <Calendar className="h-3 w-3" />
                <span>Saved: {new Date(profile.updated_at).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>

              {/* Actions Footer */}
              <div className="flex gap-2 justify-end">
                <button
                  onClick={(e) => handleDownload(profile, e)}
                  className="flex items-center gap-1.5 py-1.5 px-3 bg-themePrimary hover:bg-themePrimaryDark text-white text-xs font-semibold rounded-theme shadow-sm transition-all duration-200 cursor-pointer"
                  title="Quick Download PDF Resume"
                >
                  <Download className="h-3.5 w-3.5" />
                  PDF
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(profile);
                  }}
                  className="flex items-center gap-1.5 py-1.5 px-3 bg-themeBg hover:bg-themeBorder text-themeText text-xs font-semibold rounded-theme border border-themeBorder transition-all duration-200 cursor-pointer"
                >
                  <Edit3 className="h-3.5 w-3.5 text-themePrimary" />
                  Edit
                </button>
                <button
                  onClick={(e) => handleDelete(profile.id, e)}
                  className="p-1.5 text-themeTextSecondary hover:text-red-500 hover:bg-red-500/10 rounded-theme transition-colors cursor-pointer"
                  title="Delete Profile"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

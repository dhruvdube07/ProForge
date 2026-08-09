import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, History, LogOut, LayoutDashboard, User, Settings, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('male');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const openSettings = () => {
    if (user) {
      setFirstName(user.first_name || user.name?.split(' ')[0] || '');
      setLastName(user.last_name || user.name?.split(' ')[1] || '');
      setGender(user.gender || 'male');
    }
    setMessage('');
    setError('');
    setIsSettingsOpen(true);
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await updateUserProfile(firstName, lastName, gender);
      // Remove light mode on profile save if theme applied
      document.documentElement.classList.remove('light');
      setMessage('Profile settings saved successfully!');
      setTimeout(() => setIsSettingsOpen(false), 1500);
    } catch (err) {
      setError(err.message || 'Failed to save settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-themeBorder bg-themeCard/80 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
            <div className="p-2 bg-themePrimary/10 rounded-theme group-hover:bg-themePrimary/20 transition-colors">
              <Sparkles className="h-6 w-6 text-themePrimary" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-themeText flex items-center gap-1.5">
              ProForge
              <span className="text-xxs px-1.5 py-0.5 rounded-full bg-themePrimary/15 text-themePrimary font-semibold uppercase tracking-wider">
                Remo AI
              </span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2.5 sm:gap-4 mr-2">
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-1.5 py-2 px-3 rounded-theme text-sm font-medium transition-all duration-300 ${
                    isActive('/dashboard')
                      ? 'bg-themePrimary text-white shadow-sm'
                      : 'text-themeTextSecondary hover:text-themeText hover:bg-themeBg'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>

                <Link
                  to="/profiles"
                  className={`flex items-center gap-1.5 py-2 px-3 rounded-theme text-sm font-medium transition-all duration-300 ${
                    isActive('/profiles')
                      ? 'bg-themePrimary text-white shadow-sm'
                      : 'text-themeTextSecondary hover:text-themeText hover:bg-themeBg'
                  }`}
                >
                  <History className="h-4 w-4" />
                  <span className="hidden sm:inline">My Profiles</span>
                </Link>
              </div>
            )}

            {/* Right Side Control Bar */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-themeBorder">
              <ThemeToggle />

              {user && (
                <div className="flex items-center gap-2">
                  <div className="hidden md:flex flex-col text-right">
                    <span className="text-xs font-bold text-themeText truncate max-w-[120px]">
                      {user.name || user.email.split('@')[0]}
                    </span>
                    <span className="text-xxs text-themeTextSecondary truncate max-w-[120px]">
                      {user.email}
                    </span>
                  </div>
                  <button
                    onClick={openSettings}
                    className="p-2.5 rounded-theme text-themeTextSecondary hover:text-themePrimary hover:bg-themePrimary/15 transition-all duration-300 cursor-pointer"
                    title="Account Settings"
                  >
                    <Settings className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2.5 rounded-theme text-themeTextSecondary hover:text-red-500 hover:bg-red-500/10 transition-all duration-300 cursor-pointer"
                    title="Log Out"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* SETTINGS CUSTOMIZATION MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-themeCard border border-themeBorder rounded-[24px] w-full max-w-md p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 text-left">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-themeBorder pb-3">
              <div>
                <h3 className="text-base font-bold text-themeText flex items-center gap-2">
                  <Settings className="h-4.5 w-4.5 text-themePrimary" />
                  Account & Theme Settings
                </h3>
                <p className="text-xxs text-themeTextSecondary mt-0.5">Customize your profile credentials and gender theme.</p>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 rounded-full hover:bg-themeBg text-themeTextSecondary hover:text-themeText transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Error notifications */}
            {error && (
              <div className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-500 text-xxs rounded-theme text-center font-bold">
                {error}
              </div>
            )}

            {/* Success notifications */}
            {message && (
              <div className="p-2.5 bg-green-500/10 border border-green-500/20 text-themePrimary text-xxs rounded-theme text-center font-bold">
                {message}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xxs font-bold text-themeTextSecondary uppercase pl-0.5">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-2.5 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-xs text-themeText"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xxs font-bold text-themeTextSecondary uppercase pl-0.5">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-2.5 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-xs text-themeText"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xxs font-bold text-themeTextSecondary uppercase pl-0.5">Gender (Theme Selection)</label>
                <div className="grid grid-cols-2 bg-themeBg p-0.5 rounded-theme border border-themeBorder">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-2 px-3 text-xs font-bold rounded-theme transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                      gender === 'male'
                        ? 'bg-themeCard text-themePrimary shadow-sm'
                        : 'text-themeTextSecondary hover:text-themeText'
                    }`}
                  >
                    <span>👨</span>
                    LUNA (Male)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-2 px-3 text-xs font-bold rounded-theme transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                      gender === 'female'
                        ? 'bg-themeCard text-themePrimary shadow-sm'
                        : 'text-themeTextSecondary hover:text-themeText'
                    }`}
                  >
                    <span>👩</span>
                    MOON (Female)
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 border-t border-themeBorder pt-3">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="py-2 px-4 border border-themeBorder hover:bg-themeBorder rounded-theme text-xs font-bold text-themeText transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="py-2 px-4 bg-themePrimary hover:bg-themePrimaryDark text-white font-bold rounded-theme text-xs shadow hover-lift transition-all duration-300 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}

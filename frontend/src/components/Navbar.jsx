import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, History, LogOut, LayoutDashboard, User, Settings, X, Briefcase, Globe, FileText, Linkedin, ChevronDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [profiles, setProfiles] = useState([]);
  const [activeProfileId, setActiveProfileId] = useState(localStorage.getItem('pf_active_profile_id') || '');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  // Fetch list of user's profiles to populate global dropdown
  const loadProfiles = async () => {
    const token = localStorage.getItem('pf_token');
    if (!token) return;
    try {
      const res = await fetch('/api/profiles', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setProfiles(data);
          // If no active profile is stored, auto-select the first one
          if (data.length > 0 && !localStorage.getItem('pf_active_profile_id')) {
            localStorage.setItem('pf_active_profile_id', data[0].id);
            setActiveProfileId(data[0].id);
            window.dispatchEvent(new Event('pfActiveProfileChanged'));
          }
        }
      }
    } catch (err) {
      console.error('Error loading profiles in navbar:', err);
    }
  };

  useEffect(() => {
    if (user) {
      loadProfiles();
    }
    
    // Listen for events when a profile is saved/created to refresh dropdown list
    const handleRefreshList = () => {
      loadProfiles();
    };
    window.addEventListener('pfRefreshProfilesList', handleRefreshList);
    window.addEventListener('pfActiveProfileChanged', () => {
      setActiveProfileId(localStorage.getItem('pf_active_profile_id') || '');
    });

    const handleClickAway = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickAway);

    return () => {
      window.removeEventListener('pfRefreshProfilesList', handleRefreshList);
      document.removeEventListener('mousedown', handleClickAway);
    };
  }, [user]);

  const handleProfileSelect = (id) => {
    localStorage.setItem('pf_active_profile_id', id);
    setActiveProfileId(id);
    window.dispatchEvent(new Event('pfActiveProfileChanged'));
    setIsProfileDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('pf_active_profile_id');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  // Render dropdown active item text
  const activeProfile = profiles.find(p => p.id === activeProfileId);
  const activeProfileName = activeProfile ? (activeProfile.name || 'Untitled') : 'No Profiles';

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-themeBorder bg-themeCard/85 backdrop-blur-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo and Brand - Directs to Hub (Home) if logged in */}
          <Link to={user ? "/hub" : "/"} className="flex items-center gap-2 group flex-shrink-0">
            <div className="p-2 bg-themePrimary/10 rounded-theme group-hover:bg-themePrimary/20 transition-colors">
              <Sparkles className="h-5 w-5 text-themePrimary" />
            </div>
            <span className="font-black text-lg tracking-tight text-themeText flex items-center gap-1.5">
              Proforge
              <span className="text-xxs px-1.5 py-0.5 rounded-full bg-themePrimary/15 text-themePrimary font-semibold uppercase tracking-wider">
                AI
              </span>
            </span>
          </Link>

          {/* Centered Segmented Navigation Bar */}
          {user && (
            <div className="hidden lg:flex items-center bg-themeBg/80 border border-themeBorder p-1 rounded-full shadow-inner">
              <Link
                to="/dashboard"
                className={`flex items-center gap-1 py-1.5 px-3.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                  isActive('/dashboard')
                    ? 'bg-themePrimary text-white shadow-md'
                    : 'text-themeTextSecondary hover:text-themeText hover:bg-themeCard/40'
                }`}
                title="Remo AI Resume Builder"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Remo AI</span>
              </Link>

              <Link
                to="/folio"
                className={`flex items-center gap-1 py-1.5 px-3.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                  isActive('/folio')
                    ? 'bg-themePrimary text-white shadow-md'
                    : 'text-themeTextSecondary hover:text-themeText hover:bg-themeCard/40'
                }`}
                title="Folio AI Portfolio Generator"
              >
                <Globe className="h-3.5 w-3.5" />
                <span>Folio AI</span>
              </Link>

              <Link
                to="/talo"
                className={`flex items-center gap-1 py-1.5 px-3.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                  isActive('/talo')
                    ? 'bg-themePrimary text-white shadow-md'
                    : 'text-themeTextSecondary hover:text-themeText hover:bg-themeCard/40'
                }`}
                title="Talo AI ATS Matcher"
              >
                <Briefcase className="h-3.5 w-3.5" />
                <span>Talo AI</span>
              </Link>

              <Link
                to="/covo"
                className={`flex items-center gap-1 py-1.5 px-3.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                  isActive('/covo')
                    ? 'bg-themePrimary text-white shadow-md'
                    : 'text-themeTextSecondary hover:text-themeText hover:bg-themeCard/40'
                }`}
                title="Covo AI Outreach Studio"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Covo AI</span>
              </Link>

              <Link
                to="/liko"
                className={`flex items-center gap-1 py-1.5 px-3.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                  isActive('/liko')
                    ? 'bg-themePrimary text-white shadow-md'
                    : 'text-themeTextSecondary hover:text-themeText hover:bg-themeCard/40'
                }`}
                title="Liko AI LinkedIn Architect"
              >
                <Linkedin className="h-3.5 w-3.5" />
                <span>Liko AI</span>
              </Link>
            </div>
          )}

          {/* Right Controls Area */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Global Profile Switch Dropdown */}
            {user && profiles.length > 0 && (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProfileDropdownOpen(!isProfileDropdownOpen);
                  }}
                  className="flex items-center gap-1.5 py-1.5 px-3 bg-themeCard hover:bg-themeBg border border-themeBorder rounded-theme text-xs font-bold text-themeText transition-all cursor-pointer focus:outline-none"
                >
                  <span className="hidden sm:inline text-themeTextSecondary">Active:</span>
                  <span className="max-w-[100px] truncate text-themePrimary">{activeProfileName}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-themeTextSecondary transition-colors" />
                </button>
                
                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-48 bg-themeCard border border-themeBorder rounded-theme shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="px-3 py-1.5 text-xxs font-black text-themeTextSecondary uppercase border-b border-themeBorder">
                      Switch Active Profile
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {profiles.map(p => (
                        <button
                          key={p.id}
                          onClick={() => handleProfileSelect(p.id)}
                          className={`w-full text-left px-3 py-2 text-xs truncate hover:bg-themePrimary/10 transition-colors flex items-center justify-between cursor-pointer ${
                            p.id === activeProfileId ? 'text-themePrimary font-bold bg-themePrimary/5' : 'text-themeText'
                          }`}
                        >
                          <span className="truncate">{p.name || 'Untitled'}</span>
                          <span className="text-[10px] text-themeTextSecondary opacity-60 shrink-0 ml-1">
                            {p.profession ? p.profession : 'No Title'}
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-themeBorder pt-1">
                      <Link
                        to="/profiles"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs text-themeTextSecondary hover:text-themeText hover:bg-themeBg transition-colors"
                      >
                        <History className="h-3.5 w-3.5" />
                        Manage All ({profiles.length})
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            <ThemeToggle />

            {user && (
              <div className="flex items-center gap-1">
                {/* Direct link to settings screen */}
                <Link
                  to="/settings"
                  className={`p-2 rounded-theme transition-all duration-200 ${
                    isActive('/settings') ? 'text-themePrimary bg-themePrimary/10' : 'text-themeTextSecondary hover:text-themePrimary hover:bg-themePrimary/10'
                  }`}
                  title="Account Settings"
                >
                  <Settings className="h-4.5 w-4.5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-theme text-themeTextSecondary hover:text-red-500 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
                  title="Log Out"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Responsive Navigation Drawer (Segmented Links fallback) */}
      {user && (
        <div className="lg:hidden flex items-center justify-around border-t border-themeBorder bg-themeCard/90 py-1.5 px-2">
          <Link
            to="/dashboard"
            className={`flex flex-col items-center gap-0.5 text-[9px] font-bold ${
              isActive('/dashboard') ? 'text-themePrimary' : 'text-themeTextSecondary'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Remo</span>
          </Link>
          <Link
            to="/folio"
            className={`flex flex-col items-center gap-0.5 text-[9px] font-bold ${
              isActive('/folio') ? 'text-themePrimary' : 'text-themeTextSecondary'
            }`}
          >
            <Globe className="h-4 w-4" />
            <span>Folio</span>
          </Link>
          <Link
            to="/talo"
            className={`flex flex-col items-center gap-0.5 text-[9px] font-bold ${
              isActive('/talo') ? 'text-themePrimary' : 'text-themeTextSecondary'
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>Talo</span>
          </Link>
          <Link
            to="/covo"
            className={`flex flex-col items-center gap-0.5 text-[9px] font-bold ${
              isActive('/covo') ? 'text-themePrimary' : 'text-themeTextSecondary'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Covo</span>
          </Link>
          <Link
            to="/liko"
            className={`flex flex-col items-center gap-0.5 text-[9px] font-bold ${
              isActive('/liko') ? 'text-themePrimary' : 'text-themeTextSecondary'
            }`}
          >
            <Linkedin className="h-4 w-4" />
            <span>Liko</span>
          </Link>
        </div>
      )}
    </nav>
  );
}

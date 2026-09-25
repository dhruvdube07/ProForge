import React, { useState, useEffect } from 'react';
import { 
  User, 
  Key, 
  Settings as SettingsIcon, 
  Mail, 
  Check, 
  AlertTriangle,
  Moon,
  Sun,
  ShieldAlert,
  Type,
  Sparkles,
  Palette,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useDynamicUI } from '../hooks/useDynamicUI';
import { THEME_DEFAULT_FONTS } from '../lib/dynamicTypography';

export default function Settings() {
  const { user, updateUserProfile } = useAuth();
  
  // Tabs: 'profile', 'theme', 'byok', 'diagnostics'
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [prefTitle, setPrefTitle] = useState('');
  const [email, setEmail] = useState('');

  // Theme state
  const [themeMode, setThemeMode] = useState('luna'); // 'luna' (indigo/blue) or 'moon' (amethyst/slate)
  const { uiFontMode, activeFontMode, fontModes, changeUiFont } = useDynamicUI();
  const [autoHarmonizeFont, setAutoHarmonizeFont] = useState(
    localStorage.getItem('pf_auto_harmonize_font') !== 'false'
  );

  // BYOK state
  const [groqKey, setGroqKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [showGroqKey, setShowGroqKey] = useState(false);
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);

  // Diagnostic state
  const [diagEmail, setDiagEmail] = useState('');
  const [diagLoading, setDiagLoading] = useState(false);
  const [diagSuccess, setDiagSuccess] = useState(false);

  // General Notification feedback
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize fields on load
  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || user.name?.split(' ')[0] || '');
      setLastName(user.last_name || user.name?.split(' ')[1] || '');
      setEmail(user.email || '');
      setPrefTitle(user.user_metadata?.preferred_title || '');
      
      // Read current theme class from session storage or gender profile column
      const currentTheme = sessionStorage.getItem('pf_active_theme') || user.gender || 'luna'; 
      let cleanTheme = currentTheme.replace('theme-', '');
      if (cleanTheme === 'female') cleanTheme = 'moon';
      if (cleanTheme === 'male') cleanTheme = 'luna';
      setThemeMode(cleanTheme);
    }

    // Load custom keys from localStorage
    setGroqKey(localStorage.getItem('pf_custom_groq_key') || '');
    setOpenaiKey(localStorage.getItem('pf_custom_openai_key') || '');
    setGeminiKey(localStorage.getItem('pf_custom_gemini_key') || '');
  }, [user]);

  // Handle Profile Save
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedbackMsg('');
    setErrorMsg('');
    try {
      await updateUserProfile(firstName, lastName, themeMode);
      setFeedbackMsg('Profile information saved successfully!');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile settings.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Theme Change
  const handleThemeToggle = (mode) => {
    setThemeMode(mode);
    const themeClasses = [
      'theme-luna', 'theme-moon', 'theme-solara', 'theme-aurora', 
      'theme-nebula', 'theme-cyber', 'theme-glacier', 'theme-vulcan', 
      'theme-forest', 'theme-monochrome'
    ];
    document.documentElement.classList.remove(...themeClasses, 'light');
    document.documentElement.classList.add(`theme-${mode}`);

    // If auto-harmonize typography is active, match with signature font
    if (autoHarmonizeFont && THEME_DEFAULT_FONTS[mode]) {
      changeUiFont(THEME_DEFAULT_FONTS[mode]);
    }
  };

  // Save Custom BYOK API Keys
  const handleSaveBYOK = (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedbackMsg('');
    setErrorMsg('');
    try {
      localStorage.setItem('pf_custom_groq_key', groqKey.trim());
      localStorage.setItem('pf_custom_openai_key', openaiKey.trim());
      localStorage.setItem('pf_custom_gemini_key', geminiKey.trim());
      setFeedbackMsg('Advanced API keys saved successfully in secure local storage.');
    } catch (err) {
      setErrorMsg('Failed to save keys locally.');
    } finally {
      setLoading(false);
    }
  };

  // Send Test Diagnostics Email
  const handleSendTestMail = async (e) => {
    e.preventDefault();
    if (!diagEmail) return;
    setDiagLoading(true);
    setDiagSuccess(false);
    setErrorMsg('');
    setFeedbackMsg('');
    
    try {
      const token = localStorage.getItem('pf_token');
      const res = await fetch('/api/auth/send-test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: diagEmail.trim() })
      });
      
      if (res.ok) {
        setDiagSuccess(true);
        setFeedbackMsg('Diagnostic test mail dispatched successfully! Check your inbox.');
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Failed to dispatch test diagnostics email.');
      }
    } catch (err) {
      setErrorMsg('Network error connecting to diagnostic servers.');
    } finally {
      setDiagLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-left">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-themePrimary/15 rounded-theme">
          <SettingsIcon className="h-6 w-6 text-themePrimary" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-themeText tracking-tight">System Settings</h1>
          <p className="text-xs text-themeTextSecondary">Customize your identity profiles, dynamic themes, advanced API parameters, and mail utilities.</p>
        </div>
      </div>

      {/* Global Notifications */}
      {feedbackMsg && (
        <div className="mb-6 p-4 rounded-theme bg-green-500/10 border border-green-500/20 text-themePrimary text-xs font-semibold flex items-center gap-2">
          <Check className="h-4 w-4 shrink-0" />
          {feedbackMsg}
        </div>
      )}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-theme bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Settings Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Nav */}
        <div className="md:col-span-1 space-y-1 bg-themeCard/50 border border-themeBorder p-2 rounded-theme h-fit">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-theme transition-all cursor-pointer ${
              activeTab === 'profile' 
                ? 'bg-themePrimary text-white shadow-sm' 
                : 'text-themeTextSecondary hover:bg-themeCard hover:text-themeText'
            }`}
          >
            <User className="h-4 w-4" />
            Profile Info
          </button>
          <button
            onClick={() => setActiveTab('theme')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-theme transition-all cursor-pointer ${
              activeTab === 'theme' 
                ? 'bg-themePrimary text-white shadow-sm' 
                : 'text-themeTextSecondary hover:bg-themeCard hover:text-themeText'
            }`}
          >
            <Moon className="h-4 w-4" />
            Visual Themes
          </button>
          <button
            onClick={() => setActiveTab('byok')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-theme transition-all cursor-pointer ${
              activeTab === 'byok' 
                ? 'bg-themePrimary text-white shadow-sm' 
                : 'text-themeTextSecondary hover:bg-themeCard hover:text-themeText'
            }`}
          >
            <Key className="h-4 w-4" />
            BYOK API Keys
          </button>
          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-theme transition-all cursor-pointer ${
              activeTab === 'diagnostics' 
                ? 'bg-themePrimary text-white shadow-sm' 
                : 'text-themeTextSecondary hover:bg-themeCard hover:text-themeText'
            }`}
          >
            <Mail className="h-4 w-4" />
            Mailing Utilities
          </button>
        </div>

        {/* Tab Contents */}
        <div className="md:col-span-3 glass-panel premium-frame p-6 sm:p-8 rounded-[24px]">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <h2 className="text-base font-black text-themeText border-b border-themeBorder pb-2">Profile & Identity Parameters</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xxs font-bold text-themeTextSecondary uppercase pl-0.5">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-3 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-xs text-themeText"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xxs font-bold text-themeTextSecondary uppercase pl-0.5">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-3 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-xs text-themeText"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xxs font-bold text-themeTextSecondary uppercase pl-0.5">Registered Email</label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full p-3 rounded-theme border border-themeBorder bg-themeBg opacity-60 cursor-not-allowed text-xs text-themeText"
                  title="Email cannot be altered"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-themeBorder">
                <button
                  type="submit"
                  disabled={loading}
                  className="py-2.5 px-5 bg-themePrimary hover:bg-themePrimaryDark text-white font-bold rounded-theme text-xs shadow hover-lift transition-all duration-300 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Saving Parameters...' : 'Save Profile Settings'}
                </button>
              </div>
            </form>
          )}

          {/* THEME & TYPOGRAPHY TAB */}
          {activeTab === 'theme' && (
            <div className="space-y-8">
              {/* Section 1: Color Themes */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-themeBorder pb-2">
                  <h2 className="text-base font-heading font-black text-themeText flex items-center gap-2">
                    <Palette className="h-4.5 w-4.5 text-themePrimary" />
                    Visual Theme Colorway (10 Curated Palettes)
                  </h2>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-themePrimary/10 text-themePrimary font-bold">
                    Active: {themeMode}
                  </span>
                </div>
                
                <p className="text-xs text-themeTextSecondary leading-relaxed">
                  Select a bespoke color theme profile. All styling parameters, radial ambient glows, and accent tokens are optimized for high contrast and readability.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 max-h-[300px] overflow-y-auto pr-1 scroll-premium">
                  {[
                    { key: 'luna', name: 'Luna Theme', emoji: '🌌', desc: 'Obsidian and electric cyan accents. Futuristic modern styling.' },
                    { key: 'moon', name: 'Moon Theme', emoji: '🔮', desc: 'Luminous slate and deep violet amethyst accents. Calm, structured.' },
                    { key: 'solara', name: 'Solara Gold', emoji: '☀️', desc: 'Solar gold and charcoal. High-impact contrast solar palette.' },
                    { key: 'aurora', name: 'Aurora Emerald', emoji: '🌲', desc: 'Deep forest-teal background and glowing emerald-green details.' },
                    { key: 'nebula', name: 'Nebula Crimson', emoji: '🎒', desc: 'Dark cherry-black background and glowing ruby crimson details.' },
                    { key: 'cyber', name: 'Cyber Neon', emoji: '⚡', desc: 'Cyberpunk neon pink and bright electric cyan highlights.' },
                    { key: 'glacier', name: 'Glacier Blue', emoji: '❄️', desc: 'Arctic ice-blue and dark slate. Cool, clean, high-tech.' },
                    { key: 'vulcan', name: 'Vulcan Orange', emoji: '🌋', desc: 'Obsidian charcoal with volcanic flame orange highlights.' },
                    { key: 'forest', name: 'Forest Olive', emoji: '🍃', desc: 'Deep organic sage-green background and light olive details.' },
                    { key: 'monochrome', name: 'Monochrome Silver', emoji: '◽', desc: 'Pure gray-scale, silver and platinum accents. Elite minimalism.' }
                  ].map((th) => (
                    <button
                      key={th.key}
                      type="button"
                      onClick={() => handleThemeToggle(th.key)}
                      className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all duration-300 hover-lift cursor-pointer ${
                        themeMode === th.key 
                          ? 'border-themePrimary bg-themePrimary/10 shadow-md ring-1 ring-themePrimary/40' 
                          : 'border-themeBorder bg-themeCard/60 hover:border-themePrimary/40'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-lg">{th.emoji}</span>
                        {themeMode === th.key && (
                          <div className="w-5 h-5 rounded-full bg-themePrimary text-white flex items-center justify-center">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                      <div className="mt-2.5">
                        <h4 className="text-xs font-bold text-themeText font-heading">{th.name}</h4>
                        <p className="text-[10px] text-themeTextSecondary mt-0.5 leading-relaxed">
                          {th.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 2: Dynamic UI Typography Engine */}
              <div className="space-y-4 pt-4 border-t border-themeBorder">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-themeBorder pb-2">
                  <div>
                    <h2 className="text-base font-heading font-black text-themeText flex items-center gap-2">
                      <Type className="h-4.5 w-4.5 text-themePrimary" />
                      Dynamic UI Typography Engine
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-themePrimary/15 text-themePrimary font-mono uppercase font-bold">
                        CSS Token Powered
                      </span>
                    </h2>
                    <p className="text-xs text-themeTextSecondary mt-0.5">
                      Dynamically alters font families, kerning, and typographic weights across every button, card, header, and input.
                    </p>
                  </div>

                  {/* Auto-Harmonize Toggle */}
                  <label className="flex items-center gap-2 text-xs font-bold text-themeText cursor-pointer select-none bg-themeBg/80 px-3 py-1.5 rounded-full border border-themeBorder self-start sm:self-auto">
                    <input
                      type="checkbox"
                      checked={autoHarmonizeFont}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setAutoHarmonizeFont(val);
                        localStorage.setItem('pf_auto_harmonize_font', val ? 'true' : 'false');
                        if (val && THEME_DEFAULT_FONTS[themeMode]) {
                          changeUiFont(THEME_DEFAULT_FONTS[themeMode]);
                        }
                      }}
                      className="rounded text-themePrimary focus:ring-themePrimary h-3.5 w-3.5 accent-themePrimary cursor-pointer"
                    />
                    <span>Auto-Harmonize with Theme</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {fontModes.map((f) => {
                    const isSelected = uiFontMode === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => changeUiFont(f.id)}
                        className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all duration-300 hover-lift cursor-pointer relative group ${
                          isSelected
                            ? 'border-themePrimary bg-themePrimary/10 shadow-md ring-1 ring-themePrimary/50'
                            : 'border-themeBorder bg-themeCard/60 hover:border-themePrimary/40'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span
                            className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm transition-transform group-hover:scale-105 ${
                              isSelected
                                ? 'bg-themePrimary text-white shadow-sm'
                                : 'bg-themeBg text-themePrimary border border-themeBorder'
                            }`}
                            style={{ fontFamily: f.headingFont }}
                          >
                            {f.previewGlyph}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-themeBg border border-themeBorder text-themeTextSecondary">
                              {f.category}
                            </span>
                            {isSelected && (
                              <div className="w-4 h-4 rounded-full bg-themePrimary text-white flex items-center justify-center">
                                <Check className="h-2.5 w-2.5" />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-3">
                          <h4
                            className="text-xs font-bold text-themeText"
                            style={{ fontFamily: f.headingFont }}
                          >
                            {f.name}
                          </h4>
                          <p className="text-[10px] text-themeTextSecondary mt-0.5 line-clamp-2 leading-relaxed">
                            {f.desc}
                          </p>
                          <p
                            className="text-[11px] text-themeText/80 font-medium truncate mt-2 pt-2 border-t border-themeBorder/40"
                            style={{ fontFamily: f.bodyFont }}
                          >
                            "{f.sample}"
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: Live Real-Time UI Showcase */}
              <div className="pt-4 border-t border-themeBorder space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-heading font-black text-themeTextSecondary uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-themePrimary" />
                    Live UI Morphing Preview Showcase
                  </h3>
                  <span className="text-[10px] font-mono text-themeTextSecondary">
                    Theme: <strong className="text-themePrimary">{themeMode}</strong> • Font: <strong className="text-themePrimary">{activeFontMode.name}</strong>
                  </span>
                </div>

                <div className="p-5 rounded-2xl border border-themeBorder bg-themeBg/50 backdrop-blur-md space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-heading font-extrabold text-themeText tracking-tight">
                        Executive Engineering Architecture
                      </h3>
                      <p className="text-xs text-themeTextSecondary mt-0.5">
                        State-of-the-art career assets created with Proforge AI's dynamic system.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-themePrimary/15 text-themePrimary font-bold border border-themePrimary/30">
                        99.4% ATS Score
                      </span>
                      <button
                        type="button"
                        className="py-1.5 px-3.5 rounded-full bg-themePrimary hover:bg-themePrimaryDark text-white text-xs font-bold shadow-md btn-shimmer"
                      >
                        Action Demo
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-themeBorder/60">
                    <div className="p-2.5 rounded-xl bg-themeCard border border-themeBorder/60 text-center">
                      <span className="block text-[10px] text-themeTextSecondary uppercase font-mono">Headings</span>
                      <span className="text-xs font-bold text-themeText font-heading">{activeFontMode.headingFont}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-themeCard border border-themeBorder/60 text-center">
                      <span className="block text-[10px] text-themeTextSecondary uppercase font-mono">Body Interface</span>
                      <span className="text-xs font-bold text-themeText">{activeFontMode.bodyFont}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-themeCard border border-themeBorder/60 text-center">
                      <span className="block text-[10px] text-themeTextSecondary uppercase font-mono">Metrics & Code</span>
                      <span className="text-xs font-bold text-themeText font-mono">JetBrains Mono</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-themeCard border border-themeBorder/60 text-center">
                      <span className="block text-[10px] text-themeTextSecondary uppercase font-mono">Glow Physics</span>
                      <span className="text-xs font-bold text-emerald-400 font-mono">Hardware Aurora</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4 border-t border-themeBorder">
                <button
                  onClick={async () => {
                    setLoading(true);
                    setFeedbackMsg('');
                    try {
                      await updateUserProfile(firstName, lastName, themeMode);
                      setFeedbackMsg('Visual theme and dynamic typography configurations saved successfully!');
                    } catch (e) {
                      setErrorMsg('Failed to lock theme settings.');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                  className="py-2.5 px-6 bg-themePrimary hover:bg-themePrimaryDark text-white font-bold rounded-theme text-xs shadow-md hover-lift transition-all duration-300 cursor-pointer disabled:opacity-50 btn-shimmer"
                >
                  Save Theme & Typography Configurations
                </button>
              </div>
            </div>
          )}

          {/* BYOK TAB */}
          {activeTab === 'byok' && (
            <form onSubmit={handleSaveBYOK} className="space-y-5">
              <h2 className="text-base font-black text-themeText border-b border-themeBorder pb-2">Advanced API Configuration (BYOK)</h2>
              
              <p className="text-xxs text-themeTextSecondary leading-relaxed">
                Supply your own custom API keys. If keys are provided, Proforge AI will bypass default server keys and execute prompts using your credentials to bypass quota bounds.
              </p>

              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="block text-xxs font-bold text-themeTextSecondary uppercase pl-0.5 flex justify-between items-center">
                    <span>Groq API Key (Llama / Qwen)</span>
                    {groqKey && <span className="text-[10px] text-themePrimary font-bold">Custom Key Connected</span>}
                  </label>
                  <div className="relative">
                    <input
                      type={showGroqKey ? 'text' : 'password'}
                      value={groqKey}
                      onChange={(e) => setGroqKey(e.target.value)}
                      placeholder="gsk-••••••••••••••••••••••••"
                      className="w-full p-3 pr-10 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-xs text-themeText font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowGroqKey(!showGroqKey)}
                      aria-label={showGroqKey ? 'Hide key' : 'Show key'}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-themeTextSecondary hover:text-themePrimary transition-colors cursor-pointer"
                    >
                      {showGroqKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xxs font-bold text-themeTextSecondary uppercase pl-0.5 flex justify-between items-center">
                    <span>OpenAI API Key (GPT-4o)</span>
                    {openaiKey && <span className="text-[10px] text-themePrimary font-bold">Custom Key Connected</span>}
                  </label>
                  <div className="relative">
                    <input
                      type={showOpenaiKey ? 'text' : 'password'}
                      value={openaiKey}
                      onChange={(e) => setOpenaiKey(e.target.value)}
                      placeholder="sk-proj-••••••••••••••••••••••••"
                      className="w-full p-3 pr-10 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-xs text-themeText font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                      aria-label={showOpenaiKey ? 'Hide key' : 'Show key'}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-themeTextSecondary hover:text-themePrimary transition-colors cursor-pointer"
                    >
                      {showOpenaiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xxs font-bold text-themeTextSecondary uppercase pl-0.5 flex justify-between items-center">
                    <span>Gemini API Key (Gemini 1.5 Pro)</span>
                    {geminiKey && <span className="text-[10px] text-themePrimary font-bold">Custom Key Connected</span>}
                  </label>
                  <div className="relative">
                    <input
                      type={showGeminiKey ? 'text' : 'password'}
                      value={geminiKey}
                      onChange={(e) => setGeminiKey(e.target.value)}
                      placeholder="AIzaSy••••••••••••••••••••••••"
                      className="w-full p-3 pr-10 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-xs text-themeText font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowGeminiKey(!showGeminiKey)}
                      aria-label={showGeminiKey ? 'Hide key' : 'Show key'}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-themeTextSecondary hover:text-themePrimary transition-colors cursor-pointer"
                    >
                      {showGeminiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-themeBorder items-center">
                <button
                  type="button"
                  onClick={() => {
                    setGroqKey('');
                    setOpenaiKey('');
                    setGeminiKey('');
                    localStorage.removeItem('pf_custom_groq_key');
                    localStorage.removeItem('pf_custom_openai_key');
                    localStorage.removeItem('pf_custom_gemini_key');
                    setFeedbackMsg('API key credentials cleared. Default system keys restored.');
                  }}
                  className="py-2 px-4 border border-themeBorder hover:bg-themeBorder text-themeTextSecondary hover:text-themeText rounded-theme text-xs font-bold transition-all cursor-pointer"
                >
                  Clear Custom Keys
                </button>
                
                <button
                  type="submit"
                  className="py-2.5 px-5 bg-themePrimary hover:bg-themePrimaryDark text-white font-bold rounded-theme text-xs shadow hover-lift transition-all duration-300 cursor-pointer"
                >
                  Save API Keys
                </button>
              </div>
            </form>
          )}

          {/* DIAGNOSTICS TAB */}
          {activeTab === 'diagnostics' && (
            <form onSubmit={handleSendTestMail} className="space-y-5">
              <h2 className="text-base font-black text-themeText border-b border-themeBorder pb-2">SMTP Mailing Diagnostics Panel</h2>
              
              <p className="text-xxs text-themeTextSecondary leading-relaxed">
                Test and verify Nodemailer client SMTP pipelines. Dispatch a secure diagnostic HTML email to check Zoho server connections.
              </p>

              <div className="space-y-1.5 pt-2">
                <label className="block text-xxs font-bold text-themeTextSecondary uppercase pl-0.5">Test Destination Address</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={diagEmail}
                    onChange={(e) => setDiagEmail(e.target.value)}
                    placeholder="e.g. testing-smtp@gmail.com"
                    className="flex-1 p-3 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-xs text-themeText"
                  />
                  <button
                    type="submit"
                    disabled={diagLoading || !diagEmail}
                    className="py-3 px-5 bg-themePrimary hover:bg-themePrimaryDark disabled:opacity-50 text-white font-bold rounded-theme text-xs hover-lift transition-all duration-300 cursor-pointer shrink-0"
                  >
                    {diagLoading ? 'Dispatching...' : 'Send Test Mail'}
                  </button>
                </div>
              </div>

              {diagSuccess && (
                <div className="p-4 rounded-theme bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xxs leading-relaxed font-semibold">
                  <strong>Diagnostic verification connection test passed!</strong> SMTP transport connection verified successfully. Please check the spam folder of the target mailbox if it does not appear in your inbox.
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

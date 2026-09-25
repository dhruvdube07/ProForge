import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  ShieldCheck, 
  ArrowRight, 
  UserPlus, 
  LogIn, 
  ArrowLeft, 
  User, 
  Eye, 
  EyeOff, 
  KeyRound, 
  Check, 
  RefreshCw 
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import OTPInput from '../components/OTPInput';
import PasswordStrength from '../components/PasswordStrength';

export default function Auth() {
  const { signup, verifyOtp, login, resendOtp, forgotPassword, resetPassword, error: authError } = useAuth();
  const navigate = useNavigate();

  // Tab & mode state: 'login' | 'signup' | 'forgot'
  const [authMode, setAuthMode] = useState('login');
  
  // Sign up & Login inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  // Forgot password inputs
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotStep, setForgotStep] = useState(1); // 1 = Enter Email, 2 = Enter OTP + Set New Password

  // Password preview toggle states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false);

  // Theme selector state
  const themeOptions = ['luna', 'moon', 'solara', 'aurora', 'nebula', 'cyber', 'glacier', 'vulcan', 'forest', 'monochrome'];
  const [gender, setGender] = useState(() => localStorage.getItem('pf_theme') || 'luna');

  // Apply visual theme to document dynamically based on selected index
  useEffect(() => {
    const themeClasses = [
      'theme-luna', 'theme-moon', 'theme-solara', 'theme-aurora', 
      'theme-nebula', 'theme-cyber', 'theme-glacier', 'theme-vulcan', 
      'theme-forest', 'theme-monochrome'
    ];
    document.documentElement.classList.remove(...themeClasses, 'light');
    document.documentElement.classList.add(`theme-${gender}`);
    localStorage.setItem('pf_theme', gender);
  }, [gender]);
  
  // Registration steps: 1 = Email/Password inputs, 2 = OTP verification
  const [signUpStep, setSignUpStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [localError, setLocalError] = useState('');

  // Switch between tabs / modes
  const handleTabChange = (mode) => {
    setAuthMode(mode);
    setSignUpStep(1);
    setForgotStep(1);
    setOtp('');
    setForgotOtp('');
    setForgotNewPassword('');
    setForgotConfirmPassword('');
    setLocalError('');
    setMessage('');
    if (mode === 'forgot' && email && !forgotEmail) {
      setForgotEmail(email);
    }
  };

  // Switch specifically to Forgot Password
  const handleSwitchToForgot = () => {
    setAuthMode('forgot');
    setForgotStep(1);
    setForgotOtp('');
    setForgotNewPassword('');
    setForgotConfirmPassword('');
    setLocalError('');
    setMessage('');
    if (email) {
      setForgotEmail(email);
    }
  };

  // Handle Resend Signup OTP
  const handleResendOtp = async () => {
    setLoading(true);
    setLocalError('');
    setMessage('');
    try {
      const msg = await resendOtp(email);
      setMessage(msg);
    } catch (err) {
      setLocalError(err.message || 'Failed to resend verification OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend Forgot Password OTP
  const handleResendForgotOtp = async () => {
    setLoading(true);
    setLocalError('');
    setMessage('');
    try {
      const data = await forgotPassword(forgotEmail);
      setMessage(data.message || 'A fresh password reset code has been dispatched.');
    } catch (err) {
      setLocalError(err.message || 'Failed to resend reset code.');
    } finally {
      setLoading(false);
    }
  };

  // Form Submit: Sign Up (Send OTP)
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || !gender) {
      setLocalError('All fields (first name, last name, email, password, gender) are required.');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }
    setLoading(true);
    setLocalError('');
    setMessage('');
    try {
      const msg = await signup(email, password, firstName, lastName, gender);
      setMessage(msg);
      setSignUpStep(2);
    } catch (err) {
      setLocalError(err.message || 'Registration request failed.');
    } finally {
      setLoading(false);
    }
  };

  // Form Submit: Verify OTP & Log In (Sign Up Step 2)
  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.length < 6) {
      setLocalError('Please enter the complete 6-digit verification code.');
      return;
    }
    setLoading(true);
    setLocalError('');
    setMessage('');
    try {
      const success = await verifyOtp(email, password, otp, firstName, lastName, gender);
      if (success) {
        navigate('/hub', { state: { justSignedUp: true } });
      }
    } catch (err) {
      setLocalError(err.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  // Form Submit: Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setLocalError('');
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/hub');
      }
    } catch (err) {
      setLocalError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Form Submit: Forgot Password Step 1 (Send Reset OTP)
  const handleForgotEmailSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setLocalError('Please enter your email address.');
      return;
    }
    setLoading(true);
    setLocalError('');
    setMessage('');
    try {
      const data = await forgotPassword(forgotEmail);
      setMessage(data.message || 'Password reset OTP dispatched.');
      setForgotStep(2);
    } catch (err) {
      setLocalError(err.message || 'Failed to request password reset code.');
    } finally {
      setLoading(false);
    }
  };

  // Form Submit: Forgot Password Step 2 (Verify OTP & Set New Password)
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!forgotOtp || forgotOtp.length < 6) {
      setLocalError('Please enter the complete 6-digit verification code.');
      return;
    }
    if (!forgotNewPassword) {
      setLocalError('Please enter a new password.');
      return;
    }
    if (forgotNewPassword.length < 6) {
      setLocalError('New password must be at least 6 characters long.');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setLocalError('Passwords do not match. Please verify both passwords match.');
      return;
    }

    setLoading(true);
    setLocalError('');
    setMessage('');
    try {
      const data = await resetPassword(forgotEmail, forgotOtp, forgotNewPassword);
      setMessage(data.message || 'Password reset successfully! Redirecting...');
      setTimeout(() => {
        navigate('/hub');
      }, 700);
    } catch (err) {
      setLocalError(err.message || 'Failed to reset password. Please check your reset code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center px-3 sm:px-6 md:px-8 overflow-hidden py-6 sm:py-12">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-themePrimary/10 blur-[90px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-[#f97316]/10 blur-[90px] pointer-events-none"></div>

      {/* Main Split-Screen Container with Smooth Frame */}
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 rounded-3xl border border-themeBorder/80 bg-themeCard/80 backdrop-blur-xl shadow-2xl overflow-hidden min-h-[520px]">
        
        {/* LEFT COLUMN: Starry Sunset Scenic Graphics Panel (Displayed on laptops/desktops & iPad landscape) */}
        <div className="relative hidden lg:flex flex-col justify-between p-8 xl:p-10 overflow-hidden text-left bg-gradient-to-b from-[#0A0B10] via-[#131927] to-[#2E1810]">
          {/* Star elements */}
          <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_20px_30px,#fff_1px,transparent_0),radial-gradient(1px_1px_at_60px_120px,#fff_1px,transparent_0),radial-gradient(1px_1px_at_120px_80px,#fff_1px,transparent_0),radial-gradient(1.5px_1.5px_at_200px_180px,#fff_1.5px,transparent_0),radial-gradient(1.5px_1.5px_at_280px_60px,#fff_1.5px,transparent_0)] opacity-60"></div>
          
          {/* Glowing Sunset Sun */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full bg-gradient-to-t from-[#EAB308]/50 via-[#F97316]/30 to-transparent blur-3xl pointer-events-none"></div>

          {/* Mountains and Forest Silhouettes */}
          <svg className="absolute bottom-0 left-0 w-full h-48 pointer-events-none" viewBox="0 0 400 200" preserveAspectRatio="none">
            <path d="M-20 200 L50 90 L160 150 L280 60 L420 200 Z" fill="#1C182B" opacity="0.75" />
            <path d="M-20 200 L110 110 L220 170 L340 100 L420 200 Z" fill="#141120" />
            <path d="M10 200 L10 180 L13 182 L15 180 L18 183 L20 180 L23 185 L25 180 L25 200 Z" fill="#0A0B10" />
            <path d="M80 200 L80 175 L84 178 L87 175 L91 180 L95 174 L98 182 L102 175 L102 200 Z" fill="#0A0B10" />
            <path d="M220 200 L220 170 L225 174 L229 170 L234 176 L238 168 L243 178 L248 170 L248 200 Z" fill="#0A0B10" />
            <path d="M320 200 L320 180 L323 183 L327 180 L331 185 L334 179 L338 186 L342 180 L342 200 Z" fill="#0A0B10" />
          </svg>

          {/* Brand header */}
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-gradient-to-tr from-themePrimary to-themeSecondary rounded-xl shadow-sm flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center">
                <span className="text-xl font-bold text-white tracking-tight">ProForge</span>
                <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-themePrimary/20 text-themePrimary font-semibold uppercase tracking-wider">AI</span>
              </div>
            </div>
            <p className="text-xs text-themeTextSecondary font-medium pl-0.5">AI Studio (Remo Sub-Branch)</p>
          </div>

          {/* Tagline / Pitch */}
          <div className="relative z-10 space-y-3 mb-16 xl:mb-20">
            <h2 className="text-2xl xl:text-3xl font-bold text-white leading-snug tracking-normal">
              One Text Box.<br />
              AI Extracts Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-themePrimary to-themeSecondary">Personality.</span>
            </h2>
            <p className="text-xs xl:text-sm text-themeTextSecondary/90 leading-relaxed max-w-sm mt-3 font-normal">
              Describe your journey, and instantly forge professional resume assets, cover letters, and email signatures. Saving your versions forever.
            </p>
          </div>

          {/* Footer Info */}
          <div className="relative z-10 text-[11px] text-themeTextSecondary/60 font-medium">
            © ProForge AI Studio.
          </div>
        </div>

        {/* RIGHT COLUMN: Glassmorphism Auth Controller Form */}
        <div className="p-5 sm:p-8 lg:p-10 flex flex-col justify-center space-y-5 sm:space-y-6">
          
          {/* Tab Headers */}
          <div className="flex bg-themeBg p-1 rounded-theme border border-themeBorder">
            <button
              type="button"
              onClick={() => handleTabChange('login')}
              className={`flex-1 py-2 px-3 text-sm font-semibold rounded-theme transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'login'
                  ? 'bg-themeCard text-themePrimary shadow-sm'
                  : 'text-themeTextSecondary hover:text-themeText'
              }`}
            >
              <LogIn className="h-4 w-4" />
              Log In
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('signup')}
              className={`flex-1 py-2 px-3 text-sm font-semibold rounded-theme transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-themeCard text-themePrimary shadow-sm'
                  : 'text-themeTextSecondary hover:text-themeText'
              }`}
            >
              <UserPlus className="h-4 w-4" />
              Sign Up
            </button>
            {authMode === 'forgot' && (
              <button
                type="button"
                className="flex-1 py-2 px-3 text-sm font-semibold rounded-theme transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer bg-themeCard text-themePrimary shadow-sm animate-fadeIn"
              >
                <KeyRound className="h-4 w-4" />
                Reset
              </button>
            )}
          </div>

          {/* Form Header Info */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-themeText tracking-normal">
              {authMode === 'signup'
                ? 'Create Your Account'
                : authMode === 'forgot'
                ? 'Reset Your Password'
                : 'Welcome Back'}
            </h3>
            <p className="text-xs text-themeTextSecondary mt-1 leading-normal">
              {authMode === 'signup'
                ? signUpStep === 1
                  ? 'Fill details to trigger verification code'
                  : `Verification code dispatched to ${email}`
                : authMode === 'forgot'
                ? forgotStep === 1
                  ? 'Enter your registered email to receive a 6-digit reset code'
                  : `Enter the 6-digit code dispatched to ${forgotEmail} and choose your new password`
                : 'Log in using your email and password'}
            </p>
          </div>

          {/* Error notifications */}
          {(localError || authError) && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-theme text-center font-semibold">
              {localError || authError}
            </div>
          )}

          {/* Success notifications */}
          {message && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 text-themePrimary text-xs rounded-theme text-center font-semibold">
              {message}
            </div>
          )}

          {/* Auth Forms */}
          {authMode === 'login' ? (
            /* ================= LOGIN FORM ================= */
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-themeTextSecondary pl-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-themeTextSecondary">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-theme border border-themeBorder bg-themeBg focus:border-themePrimary focus:ring-1 focus:ring-themePrimary focus:outline-none text-sm text-themeText transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center pl-1 pr-0.5">
                  <label className="block text-xs font-semibold text-themeTextSecondary">Password</label>
                  <button
                    type="button"
                    onClick={handleSwitchToForgot}
                    className="text-xs font-semibold text-themePrimary hover:text-themePrimaryDark transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-themeTextSecondary">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-2.5 rounded-theme border border-themeBorder bg-themeBg focus:border-themePrimary focus:ring-1 focus:ring-themePrimary focus:outline-none text-sm text-themeText transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                    title={showLoginPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-themeTextSecondary hover:text-themePrimary transition-colors cursor-pointer"
                  >
                    {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-themePrimary hover:bg-themePrimaryDark text-white font-semibold rounded-theme shadow-md hover-lift transition-all duration-300 cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Log In Account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-xs text-themeTextSecondary">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleTabChange('signup')}
                  className="font-bold text-themePrimary hover:text-themePrimaryDark transition-colors cursor-pointer ml-1"
                >
                  Create one now
                </button>
              </div>
            </form>
          ) : authMode === 'signup' ? (
            signUpStep === 1 ? (
              /* ================= SIGN UP - STEP 1 (Email + Password) ================= */
              <form onSubmit={handleSignUpSubmit} className="space-y-4 text-left">
                {/* First Name & Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-themeTextSecondary pl-1">First Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-themeTextSecondary">
                        <User className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="w-full pl-10 pr-4 py-2.5 rounded-theme border border-themeBorder bg-themeBg focus:border-themePrimary focus:ring-1 focus:ring-themePrimary focus:outline-none text-sm text-themeText transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-themeTextSecondary pl-1">Last Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-themeTextSecondary">
                        <User className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="w-full pl-10 pr-4 py-2.5 rounded-theme border border-themeBorder bg-themeBg focus:border-themePrimary focus:ring-1 focus:ring-themePrimary focus:outline-none text-sm text-themeText transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Gender / Theme Selection inside Sign Up */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-themeTextSecondary pl-1">Visual Theme Palette</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full p-2.5 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-xs text-themeText transition-all"
                  >
                    <option value="luna">🌌 Luna Theme (Electric Blue)</option>
                    <option value="moon">🔮 Moon Theme (Amethyst Purple)</option>
                    <option value="solara">☀️ Solara Gold (Amber Yellow)</option>
                    <option value="aurora">🌲 Aurora Emerald (Forest Green)</option>
                    <option value="nebula">🎒 Nebula Crimson (Ruby Red)</option>
                    <option value="cyber">⚡ Cyber Neon (Hot Pink)</option>
                    <option value="glacier">❄️ Glacier Blue (Ice Cyan)</option>
                    <option value="vulcan">🌋 Vulcan Orange (Flame Orange)</option>
                    <option value="forest">🍃 Forest Olive (Sage Green)</option>
                    <option value="monochrome">◽ Monochrome Silver (Sterling Silver)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-themeTextSecondary pl-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-themeTextSecondary">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@email.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-theme border border-themeBorder bg-themeBg focus:border-themePrimary focus:ring-1 focus:ring-themePrimary focus:outline-none text-sm text-themeText transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-themeTextSecondary pl-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-themeTextSecondary">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showSignUpPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-11 py-2.5 rounded-theme border border-themeBorder bg-themeBg focus:border-themePrimary focus:ring-1 focus:ring-themePrimary focus:outline-none text-sm text-themeText transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      aria-label={showSignUpPassword ? 'Hide password' : 'Show password'}
                      title={showSignUpPassword ? 'Hide password' : 'Show password'}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-themeTextSecondary hover:text-themePrimary transition-colors cursor-pointer"
                    >
                      {showSignUpPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  <PasswordStrength password={password} />
                </div>

                <button
                  type="submit"
                  disabled={loading || password.length < 6 || !firstName || !lastName || !email}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-themePrimary hover:bg-themePrimaryDark text-white font-semibold rounded-theme shadow-md hover-lift transition-all duration-300 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Send OTP Verification
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <div className="pt-2 text-center text-xs text-themeTextSecondary">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleTabChange('login')}
                    className="font-bold text-themePrimary hover:text-themePrimaryDark transition-colors cursor-pointer ml-1"
                  >
                    Log In
                  </button>
                </div>
              </form>
            ) : (
              /* ================= SIGN UP - STEP 2 (OTP Entry) ================= */
              <form onSubmit={handleVerifyOtpSubmit} className="space-y-5 text-center">
                <OTPInput length={6} onChange={(val) => setOtp(val)} />

                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={loading || otp.length < 6}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-themePrimary hover:bg-themePrimaryDark text-white font-semibold rounded-theme shadow-md hover-lift transition-all duration-300 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <ShieldCheck className="h-5 w-5" />
                        Verify & Create Account
                      </>
                    )}
                  </button>

                  <div className="flex justify-between items-center px-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setSignUpStep(1)}
                      className="flex items-center gap-1 text-themeTextSecondary hover:text-themePrimary transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={loading}
                      className="text-themePrimary hover:text-themePrimaryDark font-semibold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Resend Verification OTP
                    </button>
                  </div>
                </div>
              </form>
            )
          ) : (
            /* ================= FORGOT PASSWORD FLOW ================= */
            forgotStep === 1 ? (
              /* Step 1: Enter Mail */
              <form onSubmit={handleForgotEmailSubmit} className="space-y-4 text-left">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-themeTextSecondary pl-1">Registered Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-themeTextSecondary">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="name@email.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-theme border border-themeBorder bg-themeBg focus:border-themePrimary focus:ring-1 focus:ring-themePrimary focus:outline-none text-sm text-themeText transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !forgotEmail}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-themePrimary hover:bg-themePrimaryDark text-white font-semibold rounded-theme shadow-md hover-lift transition-all duration-300 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Send Reset Code
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => handleTabChange('login')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-themeTextSecondary hover:text-themePrimary transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Return to Log In
                  </button>
                </div>
              </form>
            ) : (
              /* Step 2: Enter OTP & Set New Password */
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4 text-left">
                {/* OTP Input Section */}
                <div className="space-y-1 text-center">
                  <label className="block text-xs font-semibold text-themeTextSecondary mb-1.5">
                    6-Digit Verification Code
                  </label>
                  <div className="flex justify-center">
                    <OTPInput length={6} onChange={(val) => setForgotOtp(val)} />
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-themeTextSecondary pl-1">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-themeTextSecondary">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showResetPassword ? 'text' : 'password'}
                      required
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      placeholder="New password (min 6 characters)"
                      className="w-full pl-10 pr-11 py-2.5 rounded-theme border border-themeBorder bg-themeBg focus:border-themePrimary focus:ring-1 focus:ring-themePrimary focus:outline-none text-sm text-themeText transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(!showResetPassword)}
                      aria-label={showResetPassword ? 'Hide password' : 'Show password'}
                      title={showResetPassword ? 'Hide password' : 'Show password'}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-themeTextSecondary hover:text-themePrimary transition-colors cursor-pointer"
                    >
                      {showResetPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <PasswordStrength password={forgotNewPassword} />
                </div>

                {/* Confirm New Password */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center pl-1 pr-1">
                    <label className="block text-xs font-semibold text-themeTextSecondary">Confirm New Password</label>
                    {forgotConfirmPassword && forgotNewPassword && (
                      <span className={`text-[11px] font-semibold flex items-center gap-1 ${
                        forgotNewPassword === forgotConfirmPassword ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {forgotNewPassword === forgotConfirmPassword ? (
                          <>
                            <Check className="h-3 w-3" /> Passwords match
                          </>
                        ) : (
                          'Does not match'
                        )}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-themeTextSecondary">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showResetConfirmPassword ? 'text' : 'password'}
                      required
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className={`w-full pl-10 pr-11 py-2.5 rounded-theme border bg-themeBg focus:ring-1 focus:outline-none text-sm text-themeText transition-all ${
                        forgotConfirmPassword && forgotNewPassword !== forgotConfirmPassword
                          ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500'
                          : 'border-themeBorder focus:border-themePrimary focus:ring-themePrimary'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetConfirmPassword(!showResetConfirmPassword)}
                      aria-label={showResetConfirmPassword ? 'Hide password' : 'Show password'}
                      title={showResetConfirmPassword ? 'Hide password' : 'Show password'}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-themeTextSecondary hover:text-themePrimary transition-colors cursor-pointer"
                    >
                      {showResetConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Reset Button */}
                <button
                  type="submit"
                  disabled={loading || forgotOtp.length < 6 || forgotNewPassword.length < 6 || forgotNewPassword !== forgotConfirmPassword}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-themePrimary hover:bg-themePrimaryDark text-white font-semibold rounded-theme shadow-md hover-lift transition-all duration-300 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <KeyRound className="h-4 w-4" />
                      Reset Password & Log In
                    </>
                  )}
                </button>

                {/* Sub-actions */}
                <div className="flex justify-between items-center px-1 text-xs pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="flex items-center gap-1 text-themeTextSecondary hover:text-themePrimary transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Change Email
                  </button>
                  <button
                    type="button"
                    onClick={handleResendForgotOtp}
                    disabled={loading}
                    className="text-themePrimary hover:text-themePrimaryDark font-semibold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Resend Reset Code
                  </button>
                </div>
              </form>
            )
          )}

        </div>

      </div>
    </div>
  );
}

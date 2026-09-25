import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Save, RefreshCw, FileText, Eye, Edit3, AlertTriangle, FileCode, RefreshCcw, LayoutGrid, X, Check, Sliders, ArrowRight, Plus, Trash2, Mail, Phone, MapPin, Linkedin, Globe, Github, Users, Award, BookOpen, Briefcase } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../hooks/useAuth';
import TextBox from '../components/TextBox';
import BadgeGrid from '../components/BadgeGrid';
import TemplateSelector from '../components/TemplateSelector';
import FontSelector from '../components/FontSelector';
import DownloadButtons from '../components/DownloadButtons';

const emptyProfile = {
  name: '',
  profession: '',
  tagline: '',
  bio: '',
  goal: '',
  contact_email: '',
  contact_phone: '',
  contact_location: '',
  linkedin_url: '',
  portfolio_url: '',
  github_url: '',
  skills: [],
  soft_skills: [],
  strengths: [],
  achievements: [],
  hobbies: [],
  interests: [],
  personality_traits: [],
  values: [],
  experience: [],
  education: [],
  projects: [],
  languages: [],
  certifications: [],
  internships: [],
  courses: [],
  references_list: [],
  extra_curricular: [],
  template_preference: 'modern-teal-forest',
  font_preference: 'inter'
};

const layoutBases = ['modern', 'classic', 'creative', 'executive', 'minimalist', 'vibrant gradient', 'bordered slate'];

const colorSchemes = [
  { name: 'Teal Forest', primary: '#0D9488', secondary: '#14B8A6', accent: '#F59E0B', bg: '#F0FDF4', text: '#1F2937', border: '#E5E7EB' },
  { name: 'Royal Navy', primary: '#1E3A8A', secondary: '#3B82F6', accent: '#93C5FD', bg: '#EFF6FF', text: '#1E293B', border: '#DBEAFE' },
  { name: 'Charcoal Minimal', primary: '#1E293B', secondary: '#64748B', accent: '#0F172A', bg: '#FFFFFF', text: '#334155', border: '#F1F5F9' },
  { name: 'Sunset Gradient', primary: '#EA580C', secondary: '#F97316', accent: '#EAB308', bg: '#FFF7ED', text: '#1E293B', border: '#FFEDD5' },
  { name: 'Slate Bordered', primary: '#475569', secondary: '#64748B', accent: '#3B82F6', bg: '#F8FAFC', text: '#0F172A', border: '#CBD5E1' },
  { name: 'Creative Amethyst', primary: '#6D28D9', secondary: '#8B5CF6', accent: '#10B981', bg: '#F5F3FF', text: '#1F2937', border: '#EDE9FE' },
  { name: 'Plum Gold', primary: '#581C87', secondary: '#7E22CE', accent: '#EAB308', bg: '#FAF5FF', text: '#1F2937', border: '#F3E8FF' },
  { name: 'Vintage Sepia', primary: '#451A03', secondary: '#78350F', accent: '#B45309', bg: '#FFFBEB', text: '#1C1917', border: '#FEF3C7' },
  { name: 'Emerald Premium', primary: '#064E3B', secondary: '#059669', accent: '#F59E0B', bg: '#ECFDF5', text: '#0F2922', border: '#D1FAE5' },
  { name: 'Nordic Frost', primary: '#0369A1', secondary: '#0284C7', accent: '#0D9488', bg: '#F0F9FF', text: '#1F2937', border: '#E0F2FE' },
  { name: 'Cyberpunk Pink', primary: '#DB2777', secondary: '#2563EB', accent: '#06B6D4', bg: '#FDF2F8', text: '#0F172A', border: '#FCE7F3' },
  { name: 'Earthy Olive', primary: '#3F6212', secondary: '#4D7C0F', accent: '#854D0E', bg: '#F7FEE7', text: '#1F2937', border: '#ECFDF5' },
  { name: 'Crimson Bold', primary: '#991B1B', secondary: '#B91C1C', accent: '#D97706', bg: '#FFF7ED', text: '#1F2937', border: '#FFEDD5' },
  { name: 'Rose Grace', primary: '#9D174D', secondary: '#C2185B', accent: '#CA8A04', bg: '#FFF1F2', text: '#1F2937', border: '#FFE4E6' },
  { name: 'Steel Tech', primary: '#0F172A', secondary: '#1E293B', accent: '#3B82F6', bg: '#F8FAFC', text: '#0F172A', border: '#CBD5E1' }
];

const generateTemplatesList = () => {
  const lib = [];
  layoutBases.forEach((layout) => {
    colorSchemes.forEach((scheme) => {
      const id = `${layout}-${scheme.name.toLowerCase().replace(/ /g, '-')}`;
      const name = `${scheme.name} ${layout.charAt(0).toUpperCase() + layout.slice(1)}`;
      const icon = layout === 'modern' ? '⚡' : layout === 'classic' ? '📄' : layout === 'creative' ? '🎨' : layout === 'executive' ? '💼' : layout === 'minimalist' ? '◽' : layout === 'vibrant gradient' ? '🌅' : '🗂️';
      
      lib.push({
        id,
        name,
        desc: `Bespoke ${scheme.name} styling with a ${layout} structure layout.`,
        icon,
        category: layout === 'executive' || layout === 'modern' ? 'Corporate & Executive' : layout === 'creative' || layout === 'vibrant gradient' ? 'Creative & Startup' : layout === 'classic' || layout === 'bordered slate' ? 'Luxury & Vintage' : 'Minimalist & Nordic',
        layout,
        colors: {
          primary: scheme.primary,
          secondary: scheme.secondary,
          accent: scheme.accent,
          bg: scheme.bg,
          text: scheme.text,
          border: scheme.border
        }
      });
    });
  });
  return lib;
};

const templatesList = generateTemplatesList();

export default function Dashboard() {
  const { analyzeText, refineText, createProfile, updateProfile, loading: profileLoading, error: profileError, dbTablesError, getResumePreviewUrl } = useProfile();
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (location.state?.justSignedUp && user) {
      setShowWelcome(true);
      const timer = setTimeout(() => setShowWelcome(false), 8000); // 8 seconds autohide
      window.history.replaceState({}, document.title);
      return () => clearTimeout(timer);
    }
  }, [location.state, user]);

  const [activeProfile, setActiveProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  
  // Tab control: 'edit' or 'preview'
  const [activeTab, setActiveTab] = useState('edit');
  
  // Preview mode control: 'html' (instant) or 'pdf' (exact print representation)
  const [previewMode, setPreviewMode] = useState('html');
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  
  // Shared state to control the template catalog drawer from recommendations
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  // Two-Step AI flow control: 0 = textbox input, 1 = sliders custom config, 2 = dashboard editing
  const [analysisStep, setAnalysisStep] = useState(0);
  const [baseExtractedProfile, setBaseExtractedProfile] = useState(null);
  const [companyContext, setCompanyContext] = useState('');
  const [sliders, setSliders] = useState({
    grammar: 3,
    depth: 3,
    realism: 3,
    creativity: 3,
    actionVerbs: 3,
    industryFocus: 3
  });

  // Dynamic add list states
  const [tempExp, setTempExp] = useState({ company: '', role: '', duration: '', description: '' });
  const [tempEdu, setTempEdu] = useState({ school: '', degree: '', duration: '', description: '' });
  const [tempProj, setTempProj] = useState({ title: '', technologies: '', duration: '', description: '' });
  
  // Dynamic resume.io templates scope fields states
  const [tempIntern, setTempIntern] = useState({ job_title: '', employer: '', duration: '', description: '' });
  const [tempCourse, setTempCourse] = useState({ course_name: '', institution: '', duration: '' });
  const [tempRef, setTempRef] = useState({ name: '', company: '', contact: '', description: '' });
  const [tempExtra, setTempExtra] = useState({ role: '', employer: '', duration: '', description: '' });

  // Slider descriptors for dynamic feedback
  const sliderDescriptions = {
    grammar: {
      1: '👶 Simple (Kid Vocabulary)',
      2: '💬 Conversational (Everyday English)',
      3: '📈 Professional (Standard Corporate)',
      4: '🏛️ Academic (Sophisticated Phrasing)',
      5: '🎓 Scholar (English Professor Vocabulary)'
    },
    depth: {
      1: '⏱️ Ultra-Brief (Summary)',
      2: '📝 Concise (Quick Summary)',
      3: '📊 Balanced (Standard Length)',
      4: '📈 Comprehensive (Detailed Bullets)',
      5: '📚 Exhaustive (Deep Narrative)'
    },
    realism: {
      1: '🌱 Decent & Honest (Direct & Realistic)',
      2: '🚀 Solid Professional (Competency Phrased)',
      3: '🏆 Advanced Expert (High Impact Accomplishments)',
      4: '👑 Senior Executive (Phrased for Leadership)',
      5: '⚡ God Professional (Elite Phrasing, Optimized Metrics)'
    },
    creativity: {
      1: '◽ Plain & Direct (Literal statements)',
      2: '🔷 Moderate (Standard Buzzwords)',
      3: '🔶 Modern Brand (Engaging Phrasing)',
      4: '✨ High Impact (Industry Trendsetter)',
      5: '🌠 Futuristic (Cutting-Edge Branding Language)'
    },
    actionVerbs: {
      1: '◽ Standard (Normal descriptions)',
      2: '🔸 Active (Action-oriented)',
      3: '🔹 Performance (Results-driven verbs)',
      4: '💥 Executive Action (Led, Engineered, Optimized)',
      5: '🔥 Ultra Action (Strong, assertive power verbs)'
    },
    industryFocus: {
      1: '🌐 Generalist (Broad focus)',
      2: '👥 Multi-Disciplinary (Standard Field)',
      3: '🛠️ Technical Focus (Domain terminology)',
      4: '⚙️ Specialized Expert (Niche methodologies)',
      5: '🔬 Deep Technical (Jargon-dense specialization)'
    }
  };

  useEffect(() => {
    if (location.state?.profile) {
      setActiveProfile({
        ...emptyProfile,
        ...location.state.profile
      });
      setIsEditing(true);
      setAnalysisStep(2); // Bypass steps if editing saved profile
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Dynamically load Google Web Fonts to display in HTML simulated preview on-demand
  useEffect(() => {
    if (activeProfile?.font_preference) {
      const font = activeProfile.font_preference;
      const id = `gfont-${font.toLowerCase().replace(/ /g, '-')}`;
      if (!document.getElementById(id)) {
        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:ital,wght@0,300;0,400;0,700;1,400&display=swap`;
        document.head.appendChild(link);
      }
    }
  }, [activeProfile?.font_preference]);

  // Step 1: Raw AI Extraction
  const handleAnalyze = async (text) => {
    setLocalLoading(true);
    setSuccessMessage('');
    try {
      const extracted = await analyzeText(text);
      setBaseExtractedProfile({
        ...emptyProfile,
        ...extracted
      });
      setAnalysisStep(1); // Advance to Step 2
    } catch (err) {
      console.error(err);
    } finally {
      setLocalLoading(false);
    }
  };

  // Step 2: Refined AI Tailoring using Sliders & Company Context
  const handleRefine = async () => {
    setLocalLoading(true);
    setSuccessMessage('');
    try {
      const refined = await refineText(baseExtractedProfile, companyContext, sliders);
      const completeProfile = {
        ...emptyProfile,
        ...refined,
        template_preference: 'modern-teal-forest',
        font_preference: 'inter'
      };
      setActiveProfile(completeProfile);
      setIsEditing(true);
      setAnalysisStep(2); // Open Main Dashboard workspace
    } catch (err) {
      console.error(err);
    } finally {
      setLocalLoading(false);
    }
  };

  // Fetch compiled PDF representation from backend
  const loadPdfPreview = async () => {
    if (!activeProfile) return;
    setPdfLoading(true);
    try {
      if (pdfBlobUrl) {
        window.URL.revokeObjectURL(pdfBlobUrl);
      }
      const url = await getResumePreviewUrl(activeProfile);
      setPdfBlobUrl(url);
    } catch (err) {
      console.error('Failed to load PDF preview:', err);
    } finally {
      setPdfLoading(false);
    }
  };

  // Trigger PDF render when switching to preview tab or changing mode
  useEffect(() => {
    if (activeTab === 'preview' && previewMode === 'pdf' && activeProfile) {
      loadPdfPreview();
    }
  }, [activeTab, previewMode, activeProfile?.template_preference, activeProfile?.font_preference]);

  // Clean up blob URL on unmount
  useEffect(() => {
    return () => {
      if (pdfBlobUrl) {
        window.URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [pdfBlobUrl]);

  // Safe JSON array parser helper
  const parseArray = (arr) => {
    if (Array.isArray(arr)) return arr;
    try { return JSON.parse(arr); } catch (e) { return []; }
  };

  // Field updates
  const updateField = (field, value) => {
    setActiveProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // List Items Editors Helpers
  const addExperienceItem = () => {
    if (!tempExp.role || !tempExp.company) {
      alert('Role and Company are required to add Work Experience.');
      return;
    }
    const currentList = parseArray(activeProfile.experience);
    updateField('experience', [...currentList, tempExp]);
    setTempExp({ company: '', role: '', duration: '', description: '' });
  };
  const removeExperienceItem = (index) => {
    const currentList = parseArray(activeProfile.experience);
    updateField('experience', currentList.filter((_, idx) => idx !== index));
  };

  const addEducationItem = () => {
    if (!tempEdu.degree || !tempEdu.school) {
      alert('Degree and School are required to add Education.');
      return;
    }
    const currentList = parseArray(activeProfile.education);
    updateField('education', [...currentList, tempEdu]);
    setTempEdu({ school: '', degree: '', duration: '', description: '' });
  };
  const removeEducationItem = (index) => {
    const currentList = parseArray(activeProfile.education);
    updateField('education', currentList.filter((_, idx) => idx !== index));
  };

  const addProjectItem = () => {
    if (!tempProj.title) {
      alert('Project Title is required.');
      return;
    }
    const currentList = parseArray(activeProfile.projects);
    updateField('projects', [...currentList, tempProj]);
    setTempProj({ title: '', technologies: '', duration: '', description: '' });
  };
  const removeProjectItem = (index) => {
    const currentList = parseArray(activeProfile.projects);
    updateField('projects', currentList.filter((_, idx) => idx !== index));
  };

  // Resume.io lists functions
  const addInternshipItem = () => {
    if (!tempIntern.job_title || !tempIntern.employer) {
      alert('Job Title and Employer are required.');
      return;
    }
    const currentList = parseArray(activeProfile.internships);
    updateField('internships', [...currentList, tempIntern]);
    setTempIntern({ job_title: '', employer: '', duration: '', description: '' });
  };
  const removeInternshipItem = (index) => {
    const currentList = parseArray(activeProfile.internships);
    updateField('internships', currentList.filter((_, idx) => idx !== index));
  };

  const addCourseItem = () => {
    if (!tempCourse.course_name || !tempCourse.institution) {
      alert('Course Name and Institution are required.');
      return;
    }
    const currentList = parseArray(activeProfile.courses);
    updateField('courses', [...currentList, tempCourse]);
    setTempCourse({ course_name: '', institution: '', duration: '' });
  };
  const removeCourseItem = (index) => {
    const currentList = parseArray(activeProfile.courses);
    updateField('courses', currentList.filter((_, idx) => idx !== index));
  };

  const addReferenceItem = () => {
    if (!tempRef.name) {
      alert('Referent Name is required.');
      return;
    }
    const currentList = parseArray(activeProfile.references_list);
    updateField('references_list', [...currentList, tempRef]);
    setTempRef({ name: '', company: '', contact: '', description: '' });
  };
  const removeReferenceItem = (index) => {
    const currentList = parseArray(activeProfile.references_list);
    updateField('references_list', currentList.filter((_, idx) => idx !== index));
  };

  const addExtraCurricularItem = () => {
    if (!tempExtra.role || !tempExtra.employer) {
      alert('Role and Organization are required.');
      return;
    }
    const currentList = parseArray(activeProfile.extra_curricular);
    updateField('extra_curricular', [...currentList, tempExtra]);
    setTempExtra({ role: '', employer: '', duration: '', description: '' });
  };
  const removeExtraCurricularItem = (index) => {
    const currentList = parseArray(activeProfile.extra_curricular);
    updateField('extra_curricular', currentList.filter((_, idx) => idx !== index));
  };

  // Save profile to DB
  const handleSaveProfile = async () => {
    if (!activeProfile.name.trim()) {
      alert('Profile name is required to save.');
      return;
    }
    setLocalLoading(true);
    setSuccessMessage('');
    try {
      let saved;
      if (activeProfile.id) {
        saved = await updateProfile(activeProfile.id, activeProfile);
        setSuccessMessage('Profile updated successfully!');
      } else {
        saved = await createProfile(activeProfile);
        setSuccessMessage('Profile saved successfully in your history!');
      }
      setActiveProfile({
        ...emptyProfile,
        ...saved
      });
      setTimeout(() => {
        navigate('/profiles');
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Clear progress and start from scratch?')) {
      setActiveProfile(null);
      setIsEditing(false);
      setAnalysisStep(0);
      setBaseExtractedProfile(null);
      setCompanyContext('');
      setPdfBlobUrl(null);
    }
  };

  const handleSliderChange = (field, val) => {
    setSliders(prev => ({
      ...prev,
      [field]: parseInt(val)
    }));
  };

  // Dynamic AI Template recommendations based on profession
  const getAiRecommendations = (profession) => {
    const prof = (profession || '').toLowerCase();
    if (prof.includes('engineer') || prof.includes('developer') || prof.includes('tech') || prof.includes('data') || prof.includes('coder') || prof.includes('programmer')) {
      return [
        { id: 'modern-teal-forest', name: 'Teal Forest', icon: '⚡' },
        { id: 'steel-minimalist-steel-tech', name: 'Steel Tech', icon: '🛠️' },
        { id: 'nordic-ice-nordic-frost', name: 'Nordic Frost', icon: '❄' }
      ];
    }
    if (prof.includes('manager') || prof.includes('executive') || prof.includes('director') || prof.includes('vp') || prof.includes('lead') || prof.includes('president') || prof.includes('officer')) {
      return [
        { id: 'executive-royal-navy', name: 'Royal Navy', icon: '💼' },
        { id: 'bordered-slate-charcoal-minimal', name: 'Charcoal', icon: '⚓' },
        { id: 'classic-emerald-premium', name: 'Emerald', icon: '❇️' }
      ];
    }
    // General recommendations
    return [
      { id: 'classic-vintage-sepia', name: 'Sepia Classic', icon: '📄' },
      { id: 'minimalist-charcoal-minimal', name: 'Charcoal Minimal', icon: '◽' },
      { id: 'creative-creative-amethyst', name: 'Amethyst', icon: '🎨' }
    ];
  };

  // Helper mapping template ID to core layout structure for HTML preview
  const getLayoutStructure = (template) => {
    const match = templatesList.find(t => t.id === template?.toLowerCase());
    if (match) return match.layout;
    
    const t = template?.toLowerCase() || 'modern';
    if (t === 'modern' || t === 'corporate navy' || t === 'clean teal') return 'modern';
    if (t === 'classic' || t === 'golden royal' || t === 'royal gold' || t === 'vintage editorial') return 'classic';
    if (t === 'creative' || t === 'cyberpunk neon' || t === 'startup neon' || t === 'midnight cosmic' || t === 'plum royale' || t === 'amethyst') return 'creative';
    if (t === 'executive' || t === 'emerald premium') return 'executive';
    if (t === 'minimalist' || t === 'nordic ice' || t === 'steel minimalist' || t === 'minimal sans') return 'minimalist';
    if (t === 'vibrant gradient') return 'vibrant gradient';
    return 'bordered slate';
  };

  // Helper mapping template to color schemes for HTML preview
  const getPreviewColors = (template) => {
    const match = templatesList.find(t => t.id === template?.toLowerCase());
    if (match) return match.colors;

    switch (template?.toLowerCase()) {
      case 'classic': return { primary: '#1F2937', secondary: '#4B5563', accent: '#9CA3AF', bg: '#F9FAFB', text: '#111827', border: '#E5E7EB' };
      case 'creative': return { primary: '#6C5CE7', secondary: '#A29BFE', accent: '#F59E0B', bg: '#FAF5FF', text: '#2D3748', border: '#E2E8F0' };
      case 'executive': return { primary: '#0F766E', secondary: '#0D9488', accent: '#B45309', bg: '#F4FBF9', text: '#1F2937', border: '#E5E7EB' };
      case 'minimalist': return { primary: '#1E293B', secondary: '#64748B', accent: '#0F172A', bg: '#FFFFFF', text: '#334155', border: '#F1F5F9' };
      case 'vibrant gradient': return { primary: '#EA580C', secondary: '#F97316', accent: '#EAB308', bg: '#FFF7ED', text: '#1E293B', border: '#FFEDD5' };
      case 'bordered slate': return { primary: '#475569', secondary: '#64748B', accent: '#3B82F6', bg: '#F8FAFC', text: '#0F172A', border: '#CBD5E1' };
      
      case 'modern':
      default:
        return { primary: '#0D9488', secondary: '#14B8A6', accent: '#F59E0B', bg: '#F0FDF4', text: '#1F2937', border: '#E5E7EB' };
    }
  };

  const layout = getLayoutStructure(activeProfile?.template_preference);
  const colors = getPreviewColors(activeProfile?.template_preference);
  
  // Calculate recommended templates
  const recommendedTemplates = activeProfile ? getAiRecommendations(activeProfile.profession) : [];
  const categories = [...new Set(templatesList.map(t => t.category))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 🎉 Celebratory Welcome Banner */}
      {showWelcome && user && (
        <div className="relative p-6 overflow-hidden rounded-[24px] border border-themePrimary/30 bg-themePrimary/10 backdrop-blur-md text-left flex items-center justify-between gap-4 animate-fade-in shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-themePrimary/5 to-themeSecondary/5 pointer-events-none"></div>
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-themePrimary to-themeSecondary rounded-xl text-white shadow-md">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-themeText tracking-wide">
                Welcome, {user.first_name || user.name || 'User'}! 🎉
              </h2>
              <p className="text-xs text-themeTextSecondary mt-1">
                Your ProfileForge AI Studio account is verified and ready. Start crafting your personal brand!
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowWelcome(false)}
            className="relative z-10 p-2 text-themeTextSecondary hover:text-themeText hover:bg-themeBorder rounded-full transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* ⚠️ Supabase Schema Warning Banner */}
      {dbTablesError && (
        <div className="p-4 bg-orange-600/15 border-2 border-orange-500/30 rounded-[20px] text-left space-y-3 animate-pulse animate-duration-1000">
          <div className="flex items-center gap-2 text-orange-500 font-extrabold text-sm">
            <AlertTriangle className="h-5 w-5" />
            Supabase Database Table/Columns Missing!
          </div>
          <p className="text-xs text-themeTextSecondary leading-relaxed">
            The Remo application cannot save profiles because the database tables or some new columns are missing in your Supabase schema yet. 
            Please open the **SQL Editor** on your Supabase dashboard (`https://akmxwwxdxgrymbwrhwec.supabase.co`) and copy-paste the SQL script below to restore history saves:
          </p>
          <pre className="p-2.5 bg-black/60 rounded-theme text-[9px] text-themePrimary overflow-x-auto select-all font-mono leading-normal">
{`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS contact_location TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS portfolio_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS github_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS experience JSONB DEFAULT '[]'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS education JSONB DEFAULT '[]'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS projects JSONB DEFAULT '[]'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS languages JSONB DEFAULT '[]'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS certifications JSONB DEFAULT '[]'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS internships JSONB DEFAULT '[]'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS courses JSONB DEFAULT '[]'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS references_list JSONB DEFAULT '[]'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS extra_curricular JSONB DEFAULT '[]'::jsonb;`}
          </pre>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-themeBorder/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-themePrimary/15 text-themePrimary font-bold border border-themePrimary/30">
              Resume Studio
            </span>
            <span className="text-[10px] font-mono text-themeTextSecondary">
              105+ Bespoke Schemes Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-themeText flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-themePrimary/10 border border-themePrimary/20 text-themePrimary shadow-sm">
              <Sparkles className="h-6 w-6" />
            </div>
            <span>Remo AI Resume Intelligence</span>
          </h1>
          <p className="text-xs text-themeTextSecondary mt-1 font-medium">
            Synthesize ATS-optimized resumes and executive personal branding with state-of-the-art AI parsing
          </p>
        </div>

        {isEditing && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 py-2 px-3.5 border border-themeBorder hover:bg-themeCard rounded-xl text-xs font-semibold text-themeText transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={localLoading}
              className="flex items-center gap-1.5 py-2 px-4.5 bg-themePrimary hover:bg-themePrimaryDark text-white rounded-xl text-xs font-bold shadow-md hover-lift transition-all duration-300 cursor-pointer disabled:opacity-50 btn-shimmer"
            >
              {localLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Profile
            </button>
          </div>
        )}
      </div>

      {(profileError || successMessage) && (
        <div
          className={`p-4 rounded-theme border text-xs text-center font-bold ${
            successMessage
              ? 'bg-green-500/10 border-green-500/20 text-themePrimary'
              : 'bg-red-500/10 border-red-500/20 text-red-500'
          }`}
        >
          {successMessage || profileError}
        </div>
      )}

      {/* TWO-STEP AI ANALYSIS LAYOUT */}
      {analysisStep === 0 && (
        /* STEP 1 OF 2: Text input career story */
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-themePrimary/15 border border-themePrimary/30 text-[10px] font-bold text-themePrimary uppercase tracking-widest">
              Step 1 of 2: Core Journey
            </div>
            <h2 className="text-xl font-bold text-themeText">Describe your career path</h2>
            <p className="text-xs text-themeTextSecondary">
              Remo extracts your personality parameters, skills, and goals. Select from the scenarios above or type your own.
            </p>
          </div>
          <TextBox onAnalyze={handleAnalyze} loading={localLoading} />
        </div>
      )}

      {analysisStep === 1 && baseExtractedProfile && (
        /* STEP 2 OF 2: Customization Context & Sliders */
        <div className="max-w-3xl mx-auto space-y-6 text-left animate-in zoom-in-95 duration-200">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-themeSecondary/15 border border-themeSecondary/30 text-[10px] font-bold text-themeSecondary uppercase tracking-widest">
              Step 2 of 2: Tailor & Customise Details
            </div>
            <h2 className="text-xl font-bold text-themeText">Refine Your Professional Voice</h2>
            <p className="text-xs text-themeTextSecondary">
              Tell the AI where you are applying, then adjust the sliders below to create custom assets.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-[24px] space-y-6 border border-themeBorder">
            
            {/* Target context textbox */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-themeTextSecondary uppercase tracking-wider">
                What is this profile for? (Target Company / Role / Custom Pitch)
              </label>
              <input
                type="text"
                value={companyContext}
                onChange={(e) => setCompanyContext(e.target.value)}
                placeholder="e.g. Applying for a Senior Engineer role at Google, pitching for a startup co-founder, or standard resume..."
                className="w-full p-3 rounded-theme border border-themeBorder bg-themeCard focus:outline-none focus:border-themePrimary text-sm text-themeText"
              />
            </div>

            {/* Sliders Grid */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-themePrimary uppercase tracking-widest pb-1.5 border-b border-themeBorder flex items-center gap-1.5">
                <Sliders className="h-4 w-4" />
                Tailoring Control Metrics
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Slider 1: Grammar */}
                <div className="space-y-1.5 p-3.5 bg-themeBg border border-themeBorder rounded-theme">
                  <div className="flex justify-between items-center text-xs font-bold text-themeText">
                    <span>Grammar Complexity</span>
                    <span className="text-themePrimary">Lvl {sliders.grammar}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={sliders.grammar}
                    onChange={(e) => handleSliderChange('grammar', e.target.value)}
                    className="w-full accent-themePrimary cursor-pointer h-1.5 bg-themeBorder rounded-lg"
                  />
                  <div className="text-[10px] text-themeTextSecondary font-medium">
                    {sliderDescriptions.grammar[sliders.grammar]}
                  </div>
                </div>

                {/* Slider 2: Depth */}
                <div className="space-y-1.5 p-3.5 bg-themeBg border border-themeBorder rounded-theme">
                  <div className="flex justify-between items-center text-xs font-bold text-themeText">
                    <span>Detail Depth / Word Count</span>
                    <span className="text-themePrimary">Lvl {sliders.depth}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={sliders.depth}
                    onChange={(e) => handleSliderChange('depth', e.target.value)}
                    className="w-full accent-themePrimary cursor-pointer h-1.5 bg-themeBorder rounded-lg"
                  />
                  <div className="text-[10px] text-themeTextSecondary font-medium">
                    {sliderDescriptions.depth[sliders.depth]}
                  </div>
                </div>

                {/* Slider 3: Realism */}
                <div className="space-y-1.5 p-3.5 bg-themeBg border border-themeBorder rounded-theme">
                  <div className="flex justify-between items-center text-xs font-bold text-themeText">
                    <span>Realism & Experience Boost</span>
                    <span className="text-themePrimary">Lvl {sliders.realism}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={sliders.realism}
                    onChange={(e) => handleSliderChange('realism', e.target.value)}
                    className="w-full accent-themePrimary cursor-pointer h-1.5 bg-themeBorder rounded-lg"
                  />
                  <div className="text-[10px] text-themeTextSecondary font-medium">
                    {sliderDescriptions.realism[sliders.realism]}
                  </div>
                </div>

                {/* Slider 4: Creativity */}
                <div className="space-y-1.5 p-3.5 bg-themeBg border border-themeBorder rounded-theme">
                  <div className="flex justify-between items-center text-xs font-bold text-themeText">
                    <span>Creativity & Buzzwords</span>
                    <span className="text-themePrimary">Lvl {sliders.creativity}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={sliders.creativity}
                    onChange={(e) => handleSliderChange('creativity', e.target.value)}
                    className="w-full accent-themePrimary cursor-pointer h-1.5 bg-themeBorder rounded-lg"
                  />
                  <div className="text-[10px] text-themeTextSecondary font-medium">
                    {sliderDescriptions.creativity[sliders.creativity]}
                  </div>
                </div>

                {/* Slider 5: Action Verbs */}
                <div className="space-y-1.5 p-3.5 bg-themeBg border border-themeBorder rounded-theme">
                  <div className="flex justify-between items-center text-xs font-bold text-themeText">
                    <span>Action Verbs Density</span>
                    <span className="text-themePrimary">Lvl {sliders.actionVerbs}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={sliders.actionVerbs}
                    onChange={(e) => handleSliderChange('actionVerbs', e.target.value)}
                    className="w-full accent-themePrimary cursor-pointer h-1.5 bg-themeBorder rounded-lg"
                  />
                  <div className="text-[10px] text-themeTextSecondary font-medium">
                    {sliderDescriptions.actionVerbs[sliders.actionVerbs]}
                  </div>
                </div>

                {/* Slider 6: Industry Focus */}
                <div className="space-y-1.5 p-3.5 bg-themeBg border border-themeBorder rounded-theme">
                  <div className="flex justify-between items-center text-xs font-bold text-themeText">
                    <span>Industry Focus Alignment</span>
                    <span className="text-themePrimary">Lvl {sliders.industryFocus}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={sliders.industryFocus}
                    onChange={(e) => handleSliderChange('industryFocus', e.target.value)}
                    className="w-full accent-themePrimary cursor-pointer h-1.5 bg-themeBorder rounded-lg"
                  />
                  <div className="text-[10px] text-themeTextSecondary font-medium">
                    {sliderDescriptions.industryFocus[sliders.industryFocus]}
                  </div>
                </div>

              </div>
            </div>

            {/* Submit refinement */}
            <button
              onClick={handleRefine}
              disabled={localLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-themeSecondary hover:bg-orange-600 text-white font-bold rounded-theme shadow-md hover:shadow-lg disabled:opacity-50 transition-all duration-300 hover-lift cursor-pointer text-sm"
            >
              {localLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Refining with Custom Sliders & Context...
                </>
              ) : (
                <>
                  <Sparkles className="h-4.5 w-4.5" />
                  Generate Custom Branding & Assets
                  <ArrowRight className="h-4 w-4 ml-1" />
                </>
              )}
            </button>

          </div>
        </div>
      )}

      {analysisStep === 2 && isEditing && (
        /* STEP 3: Main Dashboard Workspace */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          
          {/* Left Column: Selectors, Basic Info */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Template Selector block */}
            <div className="glass-panel p-5 rounded-theme space-y-4">
              <h3 className="text-xs font-bold text-themePrimary uppercase tracking-wider pb-2 border-b border-themeBorder">
                Design Palette
              </h3>
              <TemplateSelector
                value={activeProfile.template_preference}
                onChange={(val) => updateField('template_preference', val)}
              />
              <FontSelector
                value={activeProfile.font_preference}
                onChange={(val) => updateField('font_preference', val)}
              />
            </div>

            {/* Basic Info Block */}
            <div className="glass-panel p-5 rounded-theme space-y-4">
              <h3 className="text-xs font-bold text-themePrimary uppercase tracking-wider pb-2 border-b border-themeBorder">
                Basic Credentials
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-semibold text-themeTextSecondary mb-1 uppercase">Full Name</label>
                  <input
                    type="text"
                    value={activeProfile.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="w-full p-2 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-xs text-themeText font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-themeTextSecondary mb-1 uppercase">Profession</label>
                  <input
                    type="text"
                    value={activeProfile.profession}
                    onChange={(e) => updateField('profession', e.target.value)}
                    className="w-full p-2 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-xs text-themeText"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-themeTextSecondary mb-1 uppercase">Tagline Summary</label>
                  <input
                    type="text"
                    value={activeProfile.tagline}
                    onChange={(e) => updateField('tagline', e.target.value)}
                    className="w-full p-2 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-xs text-themeText italic font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Download Assets panel */}
            <div className="glass-panel p-5 rounded-theme">
              <DownloadButtons profile={activeProfile} />
            </div>

          </div>

          {/* Right Columns: Tab Selector (Edit vs Live Preview) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tab switch buttons */}
            <div className="flex bg-themeBg/80 p-1.5 rounded-2xl border border-themeBorder/80 max-w-md backdrop-blur-md shadow-inner">
              <button
                onClick={() => setActiveTab('edit')}
                className={`flex-1 py-2 px-3.5 text-xs font-heading font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'edit'
                    ? 'bg-themePrimary text-white shadow-md shadow-themePrimary/25 ring-1 ring-white/20'
                    : 'text-themeTextSecondary hover:text-themeText hover:bg-themeCard/50'
                }`}
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile Details
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex-1 py-2 px-3.5 text-xs font-heading font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'preview'
                    ? 'bg-themePrimary text-white shadow-md shadow-themePrimary/25 ring-1 ring-white/20'
                    : 'text-themeTextSecondary hover:text-themeText hover:bg-themeCard/50'
                }`}
              >
                <Eye className="h-4 w-4" />
                Live Resume Preview
              </button>
            </div>

            {/* TAB CONTENT: Edit Content Tab */}
            {activeTab === 'edit' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                
                {/* Contact details cards */}
                <div className="glass-panel p-6 rounded-theme space-y-4">
                  <h3 className="text-xs font-bold text-themePrimary uppercase tracking-wider pb-2 border-b border-themeBorder flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-themePrimary" />
                    Contact & Social Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                    <div>
                      <label className="block text-[10px] font-semibold text-themeTextSecondary mb-1 uppercase">Email Address</label>
                      <input
                        type="text"
                        value={activeProfile.contact_email}
                        onChange={(e) => updateField('contact_email', e.target.value)}
                        className="w-full p-2 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-xs text-themeText"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-themeTextSecondary mb-1 uppercase">Phone Number</label>
                      <input
                        type="text"
                        value={activeProfile.contact_phone}
                        onChange={(e) => updateField('contact_phone', e.target.value)}
                        className="w-full p-2 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-xs text-themeText"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-themeTextSecondary mb-1 uppercase">Location (City, Country)</label>
                      <input
                        type="text"
                        value={activeProfile.contact_location}
                        onChange={(e) => updateField('contact_location', e.target.value)}
                        className="w-full p-2 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-xs text-themeText"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-themeTextSecondary mb-1 uppercase">LinkedIn Profile Link</label>
                      <input
                        type="text"
                        value={activeProfile.linkedin_url}
                        onChange={(e) => updateField('linkedin_url', e.target.value)}
                        className="w-full p-2 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-xs text-themeText"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-themeTextSecondary mb-1 uppercase">Portfolio Website</label>
                      <input
                        type="text"
                        value={activeProfile.portfolio_url}
                        onChange={(e) => updateField('portfolio_url', e.target.value)}
                        className="w-full p-2 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-xs text-themeText"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-themeTextSecondary mb-1 uppercase">GitHub Profile URL</label>
                      <input
                        type="text"
                        value={activeProfile.github_url}
                        onChange={(e) => updateField('github_url', e.target.value)}
                        className="w-full p-2 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-xs text-themeText"
                      />
                    </div>
                  </div>
                </div>

                {/* Narratives card */}
                <div className="glass-panel p-6 rounded-theme space-y-4">
                  <h3 className="text-xs font-bold text-themePrimary uppercase tracking-wider pb-2 border-b border-themeBorder">
                    Narrative Summary
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-themeTextSecondary mb-1 uppercase">Bio Summary (About me)</label>
                      <textarea
                        value={activeProfile.bio}
                        onChange={(e) => updateField('bio', e.target.value)}
                        rows={4}
                        className="w-full p-2.5 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-xs text-themeText leading-relaxed"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-themeTextSecondary mb-1 uppercase">Professional Goals</label>
                      <textarea
                        value={activeProfile.goal}
                        onChange={(e) => updateField('goal', e.target.value)}
                        rows={3}
                        className="w-full p-2.5 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-xs text-themeText leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                {/* Work Experience nested list editor */}
                <div className="glass-panel p-6 rounded-theme space-y-4 text-left">
                  <h3 className="text-xs font-bold text-themePrimary uppercase tracking-wider pb-2 border-b border-themeBorder flex justify-between items-center">
                    <span>Work Experience History</span>
                    <span className="text-[10px] text-themeTextSecondary font-bold">({parseArray(activeProfile.experience).length} added)</span>
                  </h3>
                  
                  {/* Experience cards list */}
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scroll-premium">
                    {parseArray(activeProfile.experience).map((exp, idx) => (
                      <div key={idx} className="p-3 bg-themeBg border border-themeBorder rounded-theme flex justify-between items-start gap-4">
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="text-xs font-bold text-themeText">{exp.role}</div>
                          <div className="text-[10px] font-semibold text-themePrimary">{exp.company} | {exp.duration}</div>
                          {exp.description && <p className="text-[10px] text-themeTextSecondary mt-1 leading-relaxed truncate">{exp.description}</p>}
                        </div>
                        <button
                          onClick={() => removeExperienceItem(idx)}
                          className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-500 cursor-pointer"
                          title="Remove experience item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Experience mini-form */}
                  <div className="p-4 bg-themeBg border border-themeBorder rounded-theme space-y-3">
                    <h4 className="text-[10px] font-bold text-themeText uppercase">Add Work History</h4>
                    <div className="grid grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        placeholder="Role / Title"
                        value={tempExp.role}
                        onChange={(e) => setTempExp(prev => ({ ...prev, role: e.target.value }))}
                        className="p-2 border border-themeBorder rounded-theme bg-themeCard focus:outline-none focus:border-themePrimary text-xs text-themeText"
                      />
                      <input
                        type="text"
                        placeholder="Company"
                        value={tempExp.company}
                        onChange={(e) => setTempExp(prev => ({ ...prev, company: e.target.value }))}
                        className="p-2 border border-themeBorder rounded-theme bg-themeCard focus:outline-none focus:border-themePrimary text-xs text-themeText"
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g. 2024 - Present)"
                        value={tempExp.duration}
                        onChange={(e) => setTempExp(prev => ({ ...prev, duration: e.target.value }))}
                        className="p-2 border border-themeBorder rounded-theme bg-themeCard focus:outline-none focus:border-themePrimary text-xs text-themeText col-span-2"
                      />
                      <textarea
                        placeholder="Key responsibilities & metrics accomplishments..."
                        value={tempExp.description}
                        onChange={(e) => setTempExp(prev => ({ ...prev, description: e.target.value }))}
                        rows={2}
                        className="p-2 border border-themeBorder rounded-theme bg-themeCard focus:outline-none focus:border-themePrimary text-xs text-themeText col-span-2 leading-relaxed"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addExperienceItem}
                      className="flex items-center gap-1.5 py-1.5 px-4 bg-themePrimary hover:bg-themePrimaryDark text-white font-bold rounded-theme text-[10px] cursor-pointer shadow hover-lift transition-all duration-300 ml-auto"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add to Experience
                    </button>
                  </div>
                </div>

                {/* Internships nested list editor (resume.io scope) */}
                <div className="glass-panel p-6 rounded-theme space-y-4 text-left">
                  <h3 className="text-xs font-bold text-themePrimary uppercase tracking-wider pb-2 border-b border-themeBorder flex justify-between items-center">
                    <span>Internships History</span>
                    <span className="text-[10px] text-themeTextSecondary font-bold">({parseArray(activeProfile.internships).length} added)</span>
                  </h3>
                  
                  {/* Internships cards list */}
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scroll-premium">
                    {parseArray(activeProfile.internships).map((item, idx) => (
                      <div key={idx} className="p-3 bg-themeBg border border-themeBorder rounded-theme flex justify-between items-start gap-4">
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="text-xs font-bold text-themeText">{item.job_title}</div>
                          <div className="text-[10px] font-semibold text-themePrimary">{item.employer} | {item.duration}</div>
                          {item.description && <p className="text-[10px] text-themeTextSecondary mt-1 leading-relaxed truncate">{item.description}</p>}
                        </div>
                        <button
                          onClick={() => removeInternshipItem(idx)}
                          className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-500 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Internship form */}
                  <div className="p-4 bg-themeBg border border-themeBorder rounded-theme space-y-3">
                    <h4 className="text-[10px] font-bold text-themeText uppercase">Add Internship record</h4>
                    <div className="grid grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        placeholder="Job Title"
                        value={tempIntern.job_title}
                        onChange={(e) => setTempIntern(prev => ({ ...prev, job_title: e.target.value }))}
                        className="p-2 border border-themeBorder rounded-theme bg-themeCard focus:outline-none focus:border-themePrimary text-xs text-themeText"
                      />
                      <input
                        type="text"
                        placeholder="Employer"
                        value={tempIntern.employer}
                        onChange={(e) => setTempIntern(prev => ({ ...prev, employer: e.target.value }))}
                        className="p-2 border border-themeBorder rounded-theme bg-themeCard focus:outline-none focus:border-themePrimary text-xs text-themeText"
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g. Summer 2023)"
                        value={tempIntern.duration}
                        onChange={(e) => setTempIntern(prev => ({ ...prev, duration: e.target.value }))}
                        className="p-2 border border-themeBorder rounded-theme bg-themeCard focus:outline-none focus:border-themePrimary text-xs text-themeText col-span-2"
                      />
                      <textarea
                        placeholder="Describe your internship tasks..."
                        value={tempIntern.description}
                        onChange={(e) => setTempIntern(prev => ({ ...prev, description: e.target.value }))}
                        rows={2}
                        className="p-2 border border-themeBorder rounded-theme bg-themeCard focus:outline-none focus:border-themePrimary text-xs text-themeText col-span-2 leading-relaxed"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addInternshipItem}
                      className="flex items-center gap-1.5 py-1.5 px-4 bg-themePrimary hover:bg-themePrimaryDark text-white font-bold rounded-theme text-[10px] cursor-pointer shadow hover-lift transition-all duration-300 ml-auto"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Internship
                    </button>
                  </div>
                </div>

                {/* Projects nested list editor */}
                <div className="glass-panel p-6 rounded-theme space-y-4 text-left">
                  <h3 className="text-xs font-bold text-themePrimary uppercase tracking-wider pb-2 border-b border-themeBorder flex justify-between items-center">
                    <span>Significant Projects</span>
                    <span className="text-[10px] text-themeTextSecondary font-bold">({parseArray(activeProfile.projects).length} added)</span>
                  </h3>
                  
                  {/* Projects cards list */}
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scroll-premium">
                    {parseArray(activeProfile.projects).map((proj, idx) => (
                      <div key={idx} className="p-3 bg-themeBg border border-themeBorder rounded-theme flex justify-between items-start gap-4">
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="text-xs font-bold text-themeText">{proj.title}</div>
                          <div className="text-[10px] font-semibold text-themePrimary">{proj.technologies} | {proj.duration}</div>
                          {proj.description && <p className="text-[10px] text-themeTextSecondary mt-1 leading-relaxed truncate">{proj.description}</p>}
                        </div>
                        <button
                          onClick={() => removeProjectItem(idx)}
                          className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-500 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Project form */}
                  <div className="p-4 bg-themeBg border border-themeBorder rounded-theme space-y-3">
                    <h4 className="text-[10px] font-bold text-themeText uppercase">Add Project Item</h4>
                    <div className="grid grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        placeholder="Project Title"
                        value={tempProj.title}
                        onChange={(e) => setTempProj(prev => ({ ...prev, title: e.target.value }))}
                        className="p-2 border border-themeBorder rounded-theme bg-themeCard focus:outline-none focus:border-themePrimary text-xs text-themeText"
                      />
                      <input
                        type="text"
                        placeholder="Technologies (e.g. Python, SQL)"
                        value={tempProj.technologies}
                        onChange={(e) => setTempProj(prev => ({ ...prev, technologies: e.target.value }))}
                        className="p-2 border border-themeBorder rounded-theme bg-themeCard focus:outline-none focus:border-themePrimary text-xs text-themeText"
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g. Jan 2024)"
                        value={tempProj.duration}
                        onChange={(e) => setTempProj(prev => ({ ...prev, duration: e.target.value }))}
                        className="p-2 border border-themeBorder rounded-theme bg-themeCard focus:outline-none focus:border-themePrimary text-xs text-themeText col-span-2"
                      />
                      <textarea
                        placeholder="Project outcomes and details..."
                        value={tempProj.description}
                        onChange={(e) => setTempProj(prev => ({ ...prev, description: e.target.value }))}
                        rows={2}
                        className="p-2 border border-themeBorder rounded-theme bg-themeCard focus:outline-none focus:border-themePrimary text-xs text-themeText col-span-2 leading-relaxed"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addProjectItem}
                      className="flex items-center gap-1.5 py-1.5 px-4 bg-themePrimary hover:bg-themePrimaryDark text-white font-bold rounded-theme text-[10px] cursor-pointer shadow hover-lift transition-all duration-300 ml-auto"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add to Projects
                    </button>
                  </div>
                </div>

                {/* Education nested list editor */}
                <div className="glass-panel p-6 rounded-theme space-y-4 text-left">
                  <h3 className="text-xs font-bold text-themePrimary uppercase tracking-wider pb-2 border-b border-themeBorder flex justify-between items-center">
                    <span>Education Background</span>
                    <span className="text-[10px] text-themeTextSecondary font-bold">({parseArray(activeProfile.education).length} added)</span>
                  </h3>
                  
                  {/* Education cards list */}
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scroll-premium">
                    {parseArray(activeProfile.education).map((edu, idx) => (
                      <div key={idx} className="p-3 bg-themeBg border border-themeBorder rounded-theme flex justify-between items-start gap-4">
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="text-xs font-bold text-themeText">{edu.degree}</div>
                          <div className="text-[10px] font-semibold text-themePrimary">{edu.school} | {edu.duration}</div>
                          {edu.description && <p className="text-[10px] text-themeTextSecondary mt-1 leading-relaxed truncate">{edu.description}</p>}
                        </div>
                        <button
                          onClick={() => removeEducationItem(idx)}
                          className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-500 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Education form */}
                  <div className="p-4 bg-themeBg border border-themeBorder rounded-theme space-y-3">
                    <h4 className="text-[10px] font-bold text-themeText uppercase">Add Academic Record</h4>
                    <div className="grid grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        placeholder="Degree / Program (e.g. Master of Science)"
                        value={tempEdu.degree}
                        onChange={(e) => setTempEdu(prev => ({ ...prev, degree: e.target.value }))}
                        className="p-2 border border-themeBorder rounded-theme bg-themeCard focus:outline-none focus:border-themePrimary text-xs text-themeText"
                      />
                      <input
                        type="text"
                        placeholder="School / University"
                        value={tempEdu.school}
                        onChange={(e) => setTempEdu(prev => ({ ...prev, school: e.target.value }))}
                        className="p-2 border border-themeBorder rounded-theme bg-themeCard focus:outline-none focus:border-themePrimary text-xs text-themeText"
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g. 2020 - 2023)"
                        value={tempEdu.duration}
                        onChange={(e) => setTempEdu(prev => ({ ...prev, duration: e.target.value }))}
                        className="p-2 border border-themeBorder rounded-theme bg-themeCard focus:outline-none focus:border-themePrimary text-xs text-themeText col-span-2"
                      />
                      <textarea
                        placeholder="GPA, Honors, or notable Coursework..."
                        value={tempEdu.description}
                        onChange={(e) => setTempEdu(prev => ({ ...prev, description: e.target.value }))}
                        rows={2}
                        className="p-2 border border-themeBorder rounded-theme bg-themeCard focus:outline-none focus:border-themePrimary text-xs text-themeText col-span-2 leading-relaxed"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addEducationItem}
                      className="flex items-center gap-1.5 py-1.5 px-4 bg-themePrimary hover:bg-themePrimaryDark text-white font-bold rounded-theme text-[10px] cursor-pointer shadow hover-lift transition-all duration-300 ml-auto"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add to Education
                    </button>
                  </div>
                </div>

                {/* Courses nested list editor (resume.io scope) */}
                <div className="glass-panel p-6 rounded-theme space-y-4 text-left">
                  <h3 className="text-xs font-bold text-themePrimary uppercase tracking-wider pb-2 border-b border-themeBorder flex justify-between items-center">
                    <span>Courses & Training</span>
                    <span className="text-[10px] text-themeTextSecondary font-bold">({parseArray(activeProfile.courses).length} added)</span>
                  </h3>
                  
                  {/* Courses cards list */}
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scroll-premium">
                    {parseArray(activeProfile.courses).map((item, idx) => (
                      <div key={idx} className="p-3 bg-themeBg border border-themeBorder rounded-theme flex justify-between items-start gap-4">
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="text-xs font-bold text-themeText">{item.course_name}</div>
                          <div className="text-[10px] font-semibold text-themePrimary">{item.institution} | {item.duration}</div>
                        </div>
                        <button
                          onClick={() => removeCourseItem(idx)}
                          className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-500 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Course form */}
                  <div className="p-4 bg-themeBg border border-themeBorder rounded-theme space-y-3">
                    <h4 className="text-[10px] font-bold text-themeText uppercase">Add Course</h4>
                    <div className="grid grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        placeholder="Course Name"
                        value={tempCourse.course_name}
                        onChange={(e) => setTempCourse(prev => ({ ...prev, course_name: e.target.value }))}
                        className="p-2 border border-themeBorder rounded-theme bg-themeCard focus:outline-none focus:border-themePrimary text-xs text-themeText col-span-2"
                      />
                      <input
                        type="text"
                        placeholder="Institution / Academy"
                        value={tempCourse.institution}
                        onChange={(e) => setTempCourse(prev => ({ ...prev, institution: e.target.value }))}
                        className="p-2 border border-themeBorder rounded-theme bg-themeCard focus:outline-none focus:border-themePrimary text-xs text-themeText"
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g. 2023)"
                        value={tempCourse.duration}
                        onChange={(e) => setTempCourse(prev => ({ ...prev, duration: e.target.value }))}
                        className="p-2 border border-themeBorder rounded-theme bg-themeCard focus:outline-none focus:border-themePrimary text-xs text-themeText"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addCourseItem}
                      className="flex items-center gap-1.5 py-1.5 px-4 bg-themePrimary hover:bg-themePrimaryDark text-white font-bold rounded-theme text-[10px] cursor-pointer shadow hover-lift transition-all duration-300 ml-auto"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Course
                    </button>
                  </div>
                </div>

                {/* Extra-Curricular nested list editor (resume.io scope) */}
                <div className="glass-panel p-6 rounded-theme space-y-4 text-left">
                  <h3 className="text-xs font-bold text-themePrimary uppercase tracking-wider pb-2 border-b border-themeBorder flex justify-between items-center">
                    <span>Extra-Curricular Activities</span>
                    <span className="text-[10px] text-themeTextSecondary font-bold">({parseArray(activeProfile.extra_curricular).length} added)</span>
                  </h3>
                  
                  {/* Extra-Curricular cards list */}
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scroll-premium">
                    {parseArray(activeProfile.extra_curricular).map((item, idx) => (
                      <div key={idx} className="p-3 bg-themeBg border border-themeBorder rounded-theme flex justify-between items-start gap-4">
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="text-xs font-bold text-themeText">{item.role}</div>
                          <div className="text-[10px] font-semibold text-themePrimary">{item.employer} | {item.duration}</div>
                          {item.description && <p className="text-[10px] text-themeTextSecondary mt-1 leading-relaxed truncate">{item.description}</p>}
                        </div>
                        <button
                          onClick={() => removeExtraCurricularItem(idx)}
                          className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-500 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Extra-Curricular form */}
                  <div className="p-4 bg-themeBg border border-themeBorder rounded-theme space-y-3">
                    <h4 className="text-[10px] font-bold text-themeText uppercase">Add Extra-Curricular Activity</h4>
                    <div className="grid grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        placeholder="Role / Function"
                        value={tempExtra.role}
                        onChange={(e) => setTempExtra(prev => ({ ...prev, role: e.target.value }))}
                        className="p-2 border border-themeBorder rounded-theme bg-themeCard focus:outline-none focus:border-themePrimary text-xs text-themeText"
                      />
                      <input
                        type="text"
                        placeholder="Organization / Employer"
                        value={tempExtra.employer}
                        onChange={(e) => setTempExtra(prev => ({ ...prev, employer: e.target.value }))}
                        className="p-2 border border-themeBorder rounded-theme bg-themeCard focus:outline-none focus:border-themePrimary text-xs text-themeText"
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g. 2021 - 2022)"
                        value={tempExtra.duration}
                        onChange={(e) => setTempExtra(prev => ({ ...prev, duration: e.target.value }))}
                        className="p-2 border border-themeBorder rounded-theme bg-themeCard focus:outline-none focus:border-themePrimary text-xs text-themeText col-span-2"
                      />
                      <textarea
                        placeholder="Describe your role outcomes..."
                        value={tempExtra.description}
                        onChange={(e) => setTempExtra(prev => ({ ...prev, description: e.target.value }))}
                        rows={2}
                        className="p-2 border border-themeBorder rounded-theme bg-themeCard focus:outline-none focus:border-themePrimary text-xs text-themeText col-span-2 leading-relaxed"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addExtraCurricularItem}
                      className="flex items-center gap-1.5 py-1.5 px-4 bg-themePrimary hover:bg-themePrimaryDark text-white font-bold rounded-theme text-[10px] cursor-pointer shadow hover-lift transition-all duration-300 ml-auto"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Activity
                    </button>
                  </div>
                </div>

                {/* References nested list editor (resume.io scope) */}
                <div className="glass-panel p-6 rounded-theme space-y-4 text-left">
                  <h3 className="text-xs font-bold text-themePrimary uppercase tracking-wider pb-2 border-b border-themeBorder flex justify-between items-center">
                    <span>Professional References</span>
                    <span className="text-[10px] text-themeTextSecondary font-bold">({parseArray(activeProfile.references_list).length} added)</span>
                  </h3>
                  
                  {/* References cards list */}
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scroll-premium">
                    {parseArray(activeProfile.references_list).map((item, idx) => (
                      <div key={idx} className="p-3 bg-themeBg border border-themeBorder rounded-theme flex justify-between items-start gap-4">
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="text-xs font-bold text-themeText">{item.name}</div>
                          <div className="text-[10px] font-semibold text-themePrimary">{item.company} | {item.contact}</div>
                          {item.description && <p className="text-[10px] text-themeTextSecondary mt-1 leading-relaxed truncate">{item.description}</p>}
                        </div>
                        <button
                          onClick={() => removeReferenceItem(idx)}
                          className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-500 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Reference form */}
                  <div className="p-4 bg-themeBg border border-themeBorder rounded-theme space-y-3">
                    <h4 className="text-[10px] font-bold text-themeText uppercase">Add Referent</h4>
                    <div className="grid grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        placeholder="Referent Name"
                        value={tempRef.name}
                        onChange={(e) => setTempRef(prev => ({ ...prev, name: e.target.value }))}
                        className="p-2 border border-themeBorder rounded-theme bg-themeCard focus:outline-none focus:border-themePrimary text-xs text-themeText"
                      />
                      <input
                        type="text"
                        placeholder="Company / Title"
                        value={tempRef.company}
                        onChange={(e) => setTempRef(prev => ({ ...prev, company: e.target.value }))}
                        className="p-2 border border-themeBorder rounded-theme bg-themeCard focus:outline-none focus:border-themePrimary text-xs text-themeText"
                      />
                      <input
                        type="text"
                        placeholder="Contact Info (Email/Phone)"
                        value={tempRef.contact}
                        onChange={(e) => setTempRef(prev => ({ ...prev, contact: e.target.value }))}
                        className="p-2 border border-themeBorder rounded-theme bg-themeCard focus:outline-none focus:border-themePrimary text-xs text-themeText col-span-2"
                      />
                      <textarea
                        placeholder="Brief reference comment or write 'Available upon request'..."
                        value={tempRef.description}
                        onChange={(e) => setTempRef(prev => ({ ...prev, description: e.target.value }))}
                        rows={2}
                        className="p-2 border border-themeBorder rounded-theme bg-themeCard focus:outline-none focus:border-themePrimary text-xs text-themeText col-span-2 leading-relaxed"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addReferenceItem}
                      className="flex items-center gap-1.5 py-1.5 px-4 bg-themePrimary hover:bg-themePrimaryDark text-white font-bold rounded-theme text-[10px] cursor-pointer shadow hover-lift transition-all duration-300 ml-auto"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Reference
                    </button>
                  </div>
                </div>

                {/* Badge Grid sections */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <BadgeGrid
                    title="Technical Skills"
                    items={parseArray(activeProfile.skills)}
                    onChange={(val) => updateField('skills', val)}
                  />
                  <BadgeGrid
                    title="Soft Skills"
                    items={parseArray(activeProfile.soft_skills)}
                    onChange={(val) => updateField('soft_skills', val)}
                  />
                  <BadgeGrid
                    title="Languages"
                    items={parseArray(activeProfile.languages)}
                    onChange={(val) => updateField('languages', val)}
                  />
                  <BadgeGrid
                    title="Certifications & Licences"
                    items={parseArray(activeProfile.certifications)}
                    onChange={(val) => updateField('certifications', val)}
                  />
                  <BadgeGrid
                    title="Core Strengths"
                    items={parseArray(activeProfile.strengths)}
                    onChange={(val) => updateField('strengths', val)}
                  />
                  <BadgeGrid
                    title="Achievements"
                    items={parseArray(activeProfile.achievements)}
                    onChange={(val) => updateField('achievements', val)}
                  />
                  <BadgeGrid
                    title="Hobbies"
                    items={parseArray(activeProfile.hobbies)}
                    onChange={(val) => updateField('hobbies', val)}
                  />
                  <BadgeGrid
                    title="Interests"
                    items={parseArray(activeProfile.interests)}
                    onChange={(val) => updateField('interests', val)}
                  />
                </div>
              </div>
            )}

            {/* TAB CONTENT: Live Resume Preview Tab (Interactive Preview) */}
            {activeTab === 'preview' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-3 border-b border-themeBorder pb-3">
                  
                  {/* Left: Sub-tabs control */}
                  <div className="flex bg-themeBg p-0.5 rounded-theme border border-themeBorder max-w-xs flex-shrink-0">
                    <button
                      onClick={() => setPreviewMode('html')}
                      className={`flex-1 py-1.5 px-3.5 text-[10px] font-bold rounded-theme transition-all duration-300 cursor-pointer ${
                        previewMode === 'html'
                          ? 'bg-themeCard text-themePrimary shadow-sm'
                          : 'text-themeTextSecondary hover:text-themeText'
                      }`}
                    >
                      Simulated Layout
                    </button>
                    <button
                      onClick={() => setPreviewMode('pdf')}
                      className={`flex-1 py-1.5 px-3.5 text-[10px] font-bold rounded-theme transition-all duration-300 cursor-pointer ${
                        previewMode === 'pdf'
                          ? 'bg-themeCard text-themePrimary shadow-sm'
                          : 'text-themeTextSecondary hover:text-themeText'
                      }`}
                    >
                      Actual PDF Doc (100% Real)
                    </button>
                  </div>

                  {/* Empty space filled with: ✨ AI Recommended Templates row */}
                  <div className="flex items-center gap-1.5 flex-wrap flex-1 xl:justify-end">
                    <span className="text-[10px] font-bold text-themeTextSecondary flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-themePrimary animate-pulse" />
                      AI Match:
                    </span>
                    
                    {recommendedTemplates.map((tpl) => (
                      <button
                        key={tpl.id}
                        onClick={() => updateField('template_preference', tpl.id)}
                        className={`py-1 px-2.5 rounded-full text-[9px] font-bold transition-all duration-300 border cursor-pointer ${
                          activeProfile.template_preference === tpl.id
                            ? 'bg-themePrimary/25 text-themePrimary border-themePrimary font-extrabold shadow-xs'
                            : 'bg-themeCard text-themeTextSecondary border-themeBorder hover:border-themePrimary hover:text-themeText'
                        }`}
                      >
                        <span className="mr-1">{tpl.icon}</span>
                        {tpl.name.split(' ')[0]}
                      </button>
                    ))}
                    
                    {/* "+" button next to recommended to preview more */}
                    <button
                      onClick={() => setIsCatalogOpen(true)}
                      className="py-1 px-2 rounded-full bg-themeCard border border-dashed border-themeBorder text-themePrimary hover:bg-themePrimary hover:text-white hover:border-themePrimary transition-all duration-300 font-extrabold text-[9px] flex items-center justify-center gap-1 cursor-pointer"
                      title="Preview all 100+ templates"
                    >
                      <LayoutGrid className="h-3 w-3" />
                      <span>+ More</span>
                    </button>
                  </div>

                  {previewMode === 'pdf' && (
                    <button
                      onClick={loadPdfPreview}
                      disabled={pdfLoading}
                      className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-themeBg border border-themeBorder hover:bg-themeBorder rounded-theme text-[10px] font-bold text-themeText transition-colors cursor-pointer flex-shrink-0"
                    >
                      <RefreshCcw className={`h-3 w-3 ${pdfLoading ? 'animate-spin' : ''}`} />
                      Refresh PDF
                    </button>
                  )}
                </div>

                {previewMode === 'html' ? (
                  /* SIMULATED HTML LAYOUT PREVIEW */
                  <div
                    style={{ backgroundColor: colors.bg, color: colors.text, fontFamily: activeProfile.font_preference }}
                    className="w-full p-8 rounded-theme shadow-lg min-h-[700px] border transition-all duration-300 text-left"
                  >
                    {/* MODERN TEMPLATE PREVIEW */}
                    {layout === 'modern' && (
                      <div className="space-y-6">
                        <div style={{ borderColor: colors.primary }} className="border-b-2 pb-4 text-left">
                          <h2 style={{ color: colors.primary }} className="text-3xl font-extrabold">{activeProfile.name || 'Your Name'}</h2>
                          <p className="text-sm font-semibold mt-1 uppercase tracking-wide opacity-80">{activeProfile.profession || 'Profession'}</p>
                          {activeProfile.tagline && <p style={{ color: colors.secondary }} className="text-xs italic mt-1">"{activeProfile.tagline}"</p>}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-6 text-left">
                          <div className="col-span-2 space-y-5">
                            {activeProfile.bio && (
                              <div>
                                <h4 style={{ color: colors.primary }} className="text-xs font-bold uppercase tracking-wide border-b pb-0.5 mb-1.5">About Me</h4>
                                <p className="text-xs leading-relaxed opacity-95">{activeProfile.bio}</p>
                              </div>
                            )}
                            {activeProfile.goal && (
                              <div>
                                <h4 style={{ color: colors.primary }} className="text-xs font-bold uppercase tracking-wide border-b pb-0.5 mb-1.5">Career Goal</h4>
                                <p className="text-xs leading-relaxed opacity-95">{activeProfile.goal}</p>
                              </div>
                            )}
                            
                            {/* Experience list */}
                            {parseArray(activeProfile.experience).length > 0 && (
                              <div className="space-y-2">
                                <h4 style={{ color: colors.primary }} className="text-xs font-bold uppercase tracking-wide border-b pb-0.5">Experience</h4>
                                {parseArray(activeProfile.experience).map((exp, i) => (
                                  <div key={i} className="text-xs space-y-0.5 animate-in fade-in duration-300">
                                    <div className="font-bold text-slate-800">{exp.role}</div>
                                    <div className="text-slate-500 font-semibold text-[10px]">{exp.company} | {exp.duration}</div>
                                    {exp.description && <p className="opacity-90 leading-relaxed mt-1">{exp.description}</p>}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Internships list */}
                            {parseArray(activeProfile.internships)?.length > 0 && (
                              <div className="space-y-2">
                                <h4 style={{ color: colors.primary }} className="text-xs font-bold uppercase tracking-wide border-b pb-0.5">Internships</h4>
                                {parseArray(activeProfile.internships).map((item, i) => (
                                  <div key={i} className="text-xs space-y-0.5">
                                    <div className="font-bold text-slate-800">{item.job_title}</div>
                                    <div className="text-slate-500 font-semibold text-[10px]">{item.employer} | {item.duration}</div>
                                    {item.description && <p className="opacity-90 leading-relaxed mt-1">{item.description}</p>}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Projects list */}
                            {parseArray(activeProfile.projects).length > 0 && (
                              <div className="space-y-2">
                                <h4 style={{ color: colors.primary }} className="text-xs font-bold uppercase tracking-wide border-b pb-0.5">Projects</h4>
                                {parseArray(activeProfile.projects).map((proj, i) => (
                                  <div key={i} className="text-xs space-y-0.5">
                                    <div className="font-bold text-slate-800">{proj.title}</div>
                                    <div className="text-slate-500 font-semibold text-[10px]">{proj.technologies} | {proj.duration}</div>
                                    {proj.description && <p className="opacity-90 leading-relaxed mt-1">{proj.description}</p>}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Education list */}
                            {parseArray(activeProfile.education).length > 0 && (
                              <div className="space-y-2">
                                <h4 style={{ color: colors.primary }} className="text-xs font-bold uppercase tracking-wide border-b pb-0.5">Education</h4>
                                {parseArray(activeProfile.education).map((edu, i) => (
                                  <div key={i} className="text-xs space-y-0.5">
                                    <div className="font-bold text-slate-800">{edu.degree}</div>
                                    <div className="text-slate-500 font-semibold text-[10px]">{edu.school} | {edu.duration}</div>
                                    {edu.description && <p className="opacity-90 leading-relaxed mt-1">{edu.description}</p>}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Courses list */}
                            {parseArray(activeProfile.courses)?.length > 0 && (
                              <div className="space-y-2">
                                <h4 style={{ color: colors.primary }} className="text-xs font-bold uppercase tracking-wide border-b pb-0.5">Courses</h4>
                                {parseArray(activeProfile.courses).map((item, i) => (
                                  <div key={i} className="text-xs space-y-0.5">
                                    <div className="font-bold text-slate-800">{item.course_name}</div>
                                    <div className="text-slate-500 font-semibold text-[10px]">{item.institution} | {item.duration}</div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Extra-Curricular list */}
                            {parseArray(activeProfile.extra_curricular)?.length > 0 && (
                              <div className="space-y-2">
                                <h4 style={{ color: colors.primary }} className="text-xs font-bold uppercase tracking-wide border-b pb-0.5">Extra-Curricular</h4>
                                {parseArray(activeProfile.extra_curricular).map((item, i) => (
                                  <div key={i} className="text-xs space-y-0.5">
                                    <div className="font-bold text-slate-800">{item.role}</div>
                                    <div className="text-slate-500 font-semibold text-[10px]">{item.employer} | {item.duration}</div>
                                    {item.description && <p className="opacity-90 leading-relaxed mt-1">{item.description}</p>}
                                  </div>
                                ))}
                              </div>
                            )}

                            {parseArray(activeProfile.achievements).length > 0 && (
                              <div>
                                <h4 style={{ color: colors.primary }} className="text-xs font-bold uppercase tracking-wide border-b pb-0.5 mb-1.5">Key Achievements</h4>
                                <ul className="list-disc pl-4 text-xs space-y-1 opacity-95">
                                  {parseArray(activeProfile.achievements).map((ach, i) => <li key={i}>{ach}</li>)}
                                </ul>
                              </div>
                            )}
                          </div>

                          <div style={{ borderColor: colors.border }} className="col-span-1 p-3.5 rounded-lg border space-y-4">
                            {/* Contact info list */}
                            {(activeProfile.contact_email || activeProfile.contact_phone || activeProfile.contact_location || activeProfile.linkedin_url) && (
                              <div className="space-y-1.5 text-xxs opacity-95 border-b pb-3">
                                <h4 style={{ color: colors.primary }} className="font-bold uppercase tracking-wider mb-2">Contact Info</h4>
                                {activeProfile.contact_email && <div className="truncate">✉ {activeProfile.contact_email}</div>}
                                {activeProfile.contact_phone && <div>📞 {activeProfile.contact_phone}</div>}
                                {activeProfile.contact_location && <div>📍 {activeProfile.contact_location}</div>}
                                {activeProfile.linkedin_url && <div className="truncate">🔗 {activeProfile.linkedin_url}</div>}
                                {activeProfile.portfolio_url && <div className="truncate">🌐 {activeProfile.portfolio_url}</div>}
                                {activeProfile.github_url && <div className="truncate">💻 {activeProfile.github_url}</div>}
                              </div>
                            )}

                            {parseArray(activeProfile.skills).length > 0 && (
                              <div>
                                <h4 style={{ color: colors.primary }} className="text-xxs font-bold uppercase tracking-wider mb-2">Technical Skills</h4>
                                <div className="flex flex-wrap gap-1">
                                  {parseArray(activeProfile.skills).map((s, i) => (
                                    <span key={i} style={{ backgroundColor: colors.border, color: colors.primary }} className="text-[9px] py-0.5 px-2 rounded-full font-medium">{s}</span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {parseArray(activeProfile.languages).length > 0 && (
                              <div>
                                <h4 style={{ color: colors.primary }} className="text-xxs font-bold uppercase tracking-wider mb-2">Languages</h4>
                                <div className="flex flex-wrap gap-1">
                                  {parseArray(activeProfile.languages).map((s, i) => (
                                    <span key={i} style={{ backgroundColor: colors.border }} className="text-[9px] py-0.5 px-2 rounded-full font-medium">{s}</span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {parseArray(activeProfile.certifications).length > 0 && (
                              <div>
                                <h4 style={{ color: colors.primary }} className="text-xxs font-bold uppercase tracking-wider mb-2">Certifications</h4>
                                <div className="flex flex-wrap gap-1">
                                  {parseArray(activeProfile.certifications).map((s, i) => (
                                    <span key={i} style={{ backgroundColor: colors.border }} className="text-[9px] py-0.5 px-2 rounded-full font-medium">{s}</span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* References in Modern sidebar */}
                            {parseArray(activeProfile.references_list)?.length > 0 && (
                              <div className="border-t pt-3">
                                <h4 style={{ color: colors.primary }} className="text-xxs font-bold uppercase tracking-wider mb-2">References</h4>
                                {parseArray(activeProfile.references_list).map((item, i) => (
                                  <div key={i} className="text-[9px] mb-2 leading-relaxed">
                                    <div className="font-bold text-slate-800">{item.name}</div>
                                    <div className="text-slate-500 font-semibold text-[8px]">{item.company} | {item.contact}</div>
                                    {item.description && <p className="opacity-80 italic mt-0.5">"{item.description}"</p>}
                                  </div>
                                ))}
                              </div>
                            )}

                            {parseArray(activeProfile.soft_skills).length > 0 && (
                              <div>
                                <h4 style={{ color: colors.primary }} className="text-xxs font-bold uppercase tracking-wider mb-2">Soft Skills</h4>
                                <div className="flex flex-wrap gap-1">
                                  {parseArray(activeProfile.soft_skills).map((s, i) => (
                                    <span key={i} style={{ backgroundColor: colors.border }} className="text-[9px] py-0.5 px-2 rounded-full font-medium">{s}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {parseArray(activeProfile.strengths).length > 0 && (
                              <div>
                                <h4 style={{ color: colors.primary }} className="text-xxs font-bold uppercase tracking-wider mb-2">Core Strengths</h4>
                                <div className="flex flex-wrap gap-1">
                                  {parseArray(activeProfile.strengths).map((s, i) => (
                                    <span key={i} style={{ backgroundColor: colors.border }} className="text-[9px] py-0.5 px-2 rounded-full font-medium">{s}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* GENERAL SINGLE COLUMN TEMPLATE PREVIEW */}
                    {layout !== 'modern' && (
                      <div className="space-y-6 text-left max-w-2xl mx-auto">
                        <div className="text-center space-y-1.5 border-b pb-4">
                          <h2 style={{ color: colors.primary }} className="text-3xl font-extrabold tracking-tight">{activeProfile.name || 'Your Name'}</h2>
                          <p style={{ color: colors.secondary }} className="text-sm font-semibold uppercase tracking-widest">{activeProfile.profession || 'Profession'}</p>
                          {activeProfile.tagline && <p className="text-xs italic opacity-75">"{activeProfile.tagline}"</p>}
                          
                          {/* Centered contact bar */}
                          <div className="text-[10px] text-slate-500 flex flex-wrap justify-center gap-x-3 gap-y-1 pt-1 opacity-90 font-medium">
                            {activeProfile.contact_email && <span>✉ {activeProfile.contact_email}</span>}
                            {activeProfile.contact_phone && <span>📞 {activeProfile.contact_phone}</span>}
                            {activeProfile.contact_location && <span>📍 {activeProfile.contact_location}</span>}
                            {activeProfile.linkedin_url && <span>🔗 {activeProfile.linkedin_url}</span>}
                          </div>
                        </div>

                        {activeProfile.bio && (
                          <div className="space-y-1">
                            <h4 style={{ color: colors.primary }} className="text-xs font-bold uppercase tracking-wider">Professional Summary</h4>
                            <p className="text-xs leading-relaxed opacity-95">{activeProfile.bio}</p>
                          </div>
                        )}

                        {/* Experience block */}
                        {parseArray(activeProfile.experience).length > 0 && (
                          <div className="space-y-3">
                            <h4 style={{ color: colors.primary }} className="text-xs font-bold uppercase tracking-wider border-b pb-0.5">Work History</h4>
                            {parseArray(activeProfile.experience).map((exp, i) => (
                              <div key={i} className="text-xs text-left">
                                <div className="font-bold text-slate-800">{exp.role}</div>
                                <div className="text-slate-500 font-semibold text-[10px]">{exp.company} | {exp.duration}</div>
                                {exp.description && <p className="opacity-90 leading-relaxed mt-1">{exp.description}</p>}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Internships block */}
                        {parseArray(activeProfile.internships)?.length > 0 && (
                          <div className="space-y-3">
                            <h4 style={{ color: colors.primary }} className="text-xs font-bold uppercase tracking-wider border-b pb-0.5">Internships</h4>
                            {parseArray(activeProfile.internships).map((item, i) => (
                              <div key={i} className="text-xs text-left">
                                <div className="font-bold text-slate-800">{item.job_title}</div>
                                <div className="text-slate-500 font-semibold text-[10px]">{item.employer} | {item.duration}</div>
                                {item.description && <p className="opacity-90 leading-relaxed mt-1">{item.description}</p>}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Projects block */}
                        {parseArray(activeProfile.projects).length > 0 && (
                          <div className="space-y-3">
                            <h4 style={{ color: colors.primary }} className="text-xs font-bold uppercase tracking-wider border-b pb-0.5">Projects</h4>
                            {parseArray(activeProfile.projects).map((proj, i) => (
                              <div key={i} className="text-xs text-left">
                                <div className="font-bold text-slate-800">{proj.title}</div>
                                <div className="text-slate-500 font-semibold text-[10px]">{proj.technologies} | {proj.duration}</div>
                                {proj.description && <p className="opacity-90 leading-relaxed mt-1">{proj.description}</p>}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Education block */}
                        {parseArray(activeProfile.education).length > 0 && (
                          <div className="space-y-3">
                            <h4 style={{ color: colors.primary }} className="text-xs font-bold uppercase tracking-wider border-b pb-0.5">Education</h4>
                            {parseArray(activeProfile.education).map((edu, i) => (
                              <div key={i} className="text-xs text-left">
                                <div className="font-bold text-slate-800">{edu.degree}</div>
                                <div className="text-slate-500 font-semibold text-[10px]">{edu.school} | {edu.duration}</div>
                                {edu.description && <p className="opacity-90 leading-relaxed mt-1">{edu.description}</p>}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Courses block */}
                        {parseArray(activeProfile.courses)?.length > 0 && (
                          <div className="space-y-3">
                            <h4 style={{ color: colors.primary }} className="text-xs font-bold uppercase tracking-wider border-b pb-0.5">Courses</h4>
                            {parseArray(activeProfile.courses).map((item, i) => (
                              <div key={i} className="text-xs text-left">
                                <div className="font-bold text-slate-800">{item.course_name}</div>
                                <div className="text-slate-500 font-semibold text-[10px]">{item.institution} | {item.duration}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Extra-Curricular block */}
                        {parseArray(activeProfile.extra_curricular)?.length > 0 && (
                          <div className="space-y-3">
                            <h4 style={{ color: colors.primary }} className="text-xs font-bold uppercase tracking-wider border-b pb-0.5">Extra-Curricular Activities</h4>
                            {parseArray(activeProfile.extra_curricular).map((item, i) => (
                              <div key={i} className="text-xs text-left">
                                <div className="font-bold text-slate-800">{item.role}</div>
                                <div className="text-slate-500 font-semibold text-[10px]">{item.employer} | {item.duration}</div>
                                {item.description && <p className="opacity-90 leading-relaxed mt-1">{item.description}</p>}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Skills badges */}
                        {(parseArray(activeProfile.skills).length > 0 || parseArray(activeProfile.languages).length > 0) && (
                          <div className="space-y-1.5">
                            <h4 style={{ color: colors.primary }} className="text-xs font-bold uppercase tracking-wider">Skills & Languages</h4>
                            <div className="flex flex-wrap gap-1">
                              {[...parseArray(activeProfile.skills), ...parseArray(activeProfile.languages)].map((s, i) => (
                                <span key={i} style={{ backgroundColor: colors.border }} className="text-[9px] py-0.5 px-2 rounded-full font-medium">{s}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* References block */}
                        {parseArray(activeProfile.references_list)?.length > 0 && (
                          <div className="space-y-3">
                            <h4 style={{ color: colors.primary }} className="text-xs font-bold uppercase tracking-wider border-b pb-0.5">References</h4>
                            {parseArray(activeProfile.references_list).map((item, i) => (
                              <div key={i} className="text-xs text-left">
                                <div className="font-bold text-slate-800">{item.name}</div>
                                <div className="text-slate-500 font-semibold text-[10px]">{item.company} | {item.contact}</div>
                                {item.description && <p className="opacity-90 leading-relaxed mt-1">{item.description}</p>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                ) : (
                  /* 100% REAL PDF DOCUMENT IFRAME PREVIEW */
                  <div className="w-full bg-themeCard border border-themeBorder rounded-theme min-h-[600px] flex items-center justify-center relative overflow-hidden">
                    {pdfLoading && (
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-themeCard/80 backdrop-blur-xs space-y-3 text-themeText font-bold text-xs">
                        <div className="w-8 h-8 border-4 border-themePrimary border-t-transparent rounded-full animate-spin"></div>
                        <span>Compiling PDF Document with PDFKit...</span>
                      </div>
                    )}
                    
                    {pdfBlobUrl ? (
                      <iframe
                        src={`${pdfBlobUrl}#toolbar=0&navpanes=0`}
                        className="w-full h-[650px] border-0 bg-white"
                        title="Real PDF Print Preview"
                      />
                    ) : (
                      !pdfLoading && (
                        <div className="text-center p-8 space-y-3 text-themeTextSecondary">
                          <FileText className="h-10 w-10 text-themePrimary mx-auto opacity-50" />
                          <div className="text-xs font-semibold">No PDF representation compiled yet.</div>
                          <button
                            onClick={loadPdfPreview}
                            className="py-1.5 px-4 bg-themePrimary text-white font-bold rounded-theme text-xs shadow hover-lift cursor-pointer"
                          >
                            Generate Real PDF Preview
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      )}

      {/* CATALOG POPUP MODAL (Shared trigger from AI Recommendations bar) */}
      {isCatalogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-themeCard border border-themeBorder rounded-[24px] w-full max-w-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 text-left flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-themeBorder pb-3 flex-shrink-0">
              <div>
                <h3 className="text-base font-bold text-themeText flex items-center gap-2">
                  <LayoutGrid className="h-4.5 w-4.5 text-themePrimary" />
                  Select Resume Style (105 Available Templates)
                </h3>
                <p className="text-xxs text-themeTextSecondary mt-0.5">Choose a bespoke color palette and layout to stand out.</p>
              </div>
              <button
                onClick={() => setIsCatalogOpen(false)}
                className="p-1 rounded-full hover:bg-themeBg text-themeTextSecondary hover:text-themeText transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body - Scrollable Categories */}
            <div className="overflow-y-auto pr-1 space-y-6 flex-1 py-2 scroll-premium">
              {categories.map((category) => (
                <div key={category} className="space-y-2">
                  <h4 className="text-xxs font-bold text-themePrimary uppercase tracking-widest pl-1">
                    {category}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {templatesList
                      .filter((t) => t.category === category)
                      .map((tpl) => (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => {
                            updateField('template_preference', tpl.id);
                            setIsCatalogOpen(false);
                          }}
                          className={`p-3 text-left rounded-theme border transition-all duration-300 flex items-center gap-3 cursor-pointer w-full relative group ${
                            activeProfile.template_preference === tpl.id
                              ? 'border-themePrimary bg-themePrimary/10 text-themeText ring-1 ring-themePrimary'
                              : 'border-themeBorder bg-themeCard text-themeTextSecondary hover:border-themePrimary'
                          }`}
                        >
                          <span className="text-xl p-1.5 bg-themeBg border border-themeBorder rounded-theme flex items-center justify-center w-10 h-10 flex-shrink-0">
                            {tpl.icon}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="font-extrabold text-xs text-themeText flex items-center gap-1">
                              {tpl.name}
                              {activeProfile.template_preference === tpl.id && <Check className="h-3 w-3 text-themePrimary flex-shrink-0" />}
                            </div>
                            <div className="text-[10px] text-themeTextSecondary mt-0.5 leading-normal truncate group-hover:text-clip group-hover:whitespace-normal">
                              {tpl.desc}
                            </div>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

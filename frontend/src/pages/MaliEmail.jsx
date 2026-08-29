import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Mail, Send, Calendar, Clock, Edit3, Trash2, 
  AlertCircle, CheckCircle, Palette, Link2, Bold, Italic, 
  Underline, AlignLeft, AlignCenter, AlignRight, List, 
  Trash, ChevronRight, HelpCircle, Eye, X, ArrowLeft
} from 'lucide-react';

export default function MaliEmail() {
  const [activeProfileId, setActiveProfileId] = useState(localStorage.getItem('pf_active_profile_id') || '');
  const [profile, setProfile] = useState(null);
  
  // AI generation inputs
  const [targetRole, setTargetRole] = useState('');
  const [companyContext, setCompanyContext] = useState('');
  const [tone, setTone] = useState('Professional');
  const [promptInstruction, setPromptInstruction] = useState('');
  const [generatingAI, setGeneratingAI] = useState(false);

  // Email composer inputs
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  
  // Editor state & references
  const editorRef = useRef(null);
  const previewEditorRef = useRef(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Preview & Custom Styling Console States
  const [showPreviewConsole, setShowPreviewConsole] = useState(false);
  const [senderName, setSenderName] = useState('ProForge AI Mali Studio');
  const [selectedFont, setSelectedFont] = useState('Arial, Helvetica, sans-serif');
  const [selectedBgTheme, setSelectedBgTheme] = useState('#ffffff');
  const [isImmediate, setIsImmediate] = useState(true);
  
  // Custom Date state
  const todayStr = new Date().toISOString().split('T')[0];
  const [scheduleDate, setScheduleDate] = useState(todayStr);
  
  // Clock state (12-Hour vs 24-Hour toggle)
  const [use12Hour, setUse12Hour] = useState(true);

  // 24-Hour Time states
  const currentHourStr = String(new Date().getHours()).padStart(2, '0');
  const currentMinuteStr = String(Math.floor(new Date().getMinutes() / 5) * 5).padStart(2, '0');
  const [scheduleHour, setScheduleHour] = useState(currentHourStr);
  const [scheduleMinute, setScheduleMinute] = useState(currentMinuteStr);

  // 12-Hour Time states
  const initHour = new Date().getHours();
  const initAmpm = initHour >= 12 ? 'PM' : 'AM';
  const rawH12 = initHour % 12;
  const initHour12 = String(rawH12 === 0 ? 12 : rawH12).padStart(2, '0');
  const [scheduleHour12, setScheduleHour12] = useState(initHour12);
  const [ampm, setAmpm] = useState(initAmpm);

  // Custom Calendar navigation state
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());

  // Queue state
  const [schedules, setSchedules] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [schedulingEmail, setSchedulingEmail] = useState(false);
  const [editingEmailId, setEditingEmailId] = useState(null); // id if we are editing an existing pending email

  // Notifications
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  // Visual text highlight choices
  const textColors = [
    { name: 'Default', value: '#1f2937' },
    { name: 'Electric Cyan', value: '#06b6d4' },
    { name: 'Amethyst Violet', value: '#8b5cf6' },
    { name: 'Solar Gold', value: '#eab308' },
    { name: 'Emerald Green', value: '#10b981' },
    { name: 'Ruby Crimson', value: '#ef4444' },
    { name: 'Glacier Blue', value: '#3b82f6' },
    { name: 'Vulcan Orange', value: '#f97316' },
    { name: 'Rose Pink', value: '#ec4899' },
    { name: 'Slate Gray', value: '#64748b' }
  ];

  // Expanded list of 12 premium fonts (fully loaded from Google Fonts in index.css)
  const fonts = [
    { name: 'Modern Sans (Arial)', value: 'Arial, Helvetica, sans-serif' },
    { name: 'Inter (Sleek Sans)', value: '"Inter", sans-serif' },
    { name: 'Montserrat (Bold UI)', value: '"Montserrat", sans-serif' },
    { name: 'Poppins (Soft & Friendly)', value: '"Poppins", sans-serif' },
    { name: 'Outfit (Premium Thin)', value: '"Outfit", sans-serif' },
    { name: 'Roboto (Clean Tech)', value: '"Roboto", sans-serif' },
    { name: 'Open Sans (Neutral)', value: '"Open Sans", sans-serif' },
    { name: 'Georgia (Classic Book)', value: 'Georgia, Cambria, serif' },
    { name: 'Lora (Editorial Serif)', value: '"Lora", Garamond, serif' },
    { name: 'Playfair Display (Luxury)', value: '"Playfair Display", serif' },
    { name: 'Courier New (Strict Code)', value: '"Courier New", Courier, monospace' },
    { name: 'Garamond (Vintage Serif)', value: 'Garamond, serif' }
  ];

  // Background themes list for the email container
  const bgThemes = [
    { name: 'Clean White', value: '#ffffff', desc: 'Standard business aesthetic' },
    { name: 'Linen Sand', value: '#f5e6d3', desc: 'Noticeable warm sand paper' },
    { name: 'Glacier Blue', value: '#c0e0ff', desc: 'Noticeable cool blue paper' },
    { name: 'Warm Amber', value: '#ffe8b0', desc: 'Noticeable warm amber paper' },
    { name: 'Soft Emerald', value: '#c2f0d0', desc: 'Noticeable mint green paper' },
    { name: 'Midnight Slate', value: '#1e293b', desc: 'Premium dark mode slate' },
    { name: 'Charcoal Onyx', value: '#0f172a', desc: 'Elite deep space dark' }
  ];

  // Helper to load active profile
  const loadActiveProfile = async (id) => {
    if (!id) return;
    try {
      const token = localStorage.getItem('pf_token');
      const res = await fetch(`/api/profiles/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        if (data.profession && !targetRole) {
          setTargetRole(data.profession);
        }
        if (data.name) {
          setSenderName(`${data.name} (Mali AI)`);
        }
      }
    } catch (err) {
      console.error('Error loading active profile in Mali:', err);
    }
  };

  // Helper to load schedules queue from backend
  const loadSchedules = async () => {
    setLoadingSchedules(true);
    try {
      const token = localStorage.getItem('pf_token');
      const res = await fetch('/api/mali/schedules', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSchedules(data);
      }
    } catch (err) {
      console.error('Error fetching schedules in Mali:', err);
    } finally {
      setLoadingSchedules(false);
    }
  };

  useEffect(() => {
    loadActiveProfile(activeProfileId);
    loadSchedules();

    const handleProfileChanged = () => {
      const newId = localStorage.getItem('pf_active_profile_id') || '';
      setActiveProfileId(newId);
      loadActiveProfile(newId);
    };

    window.addEventListener('pfActiveProfileChanged', handleProfileChanged);
    return () => window.removeEventListener('pfActiveProfileChanged', handleProfileChanged);
  }, [activeProfileId]);

  // Toast helper
  const showToast = (success, message) => {
    if (success) {
      setSuccessMsg(message);
      setErrorMsg('');
      setTimeout(() => setSuccessMsg(''), 5000);
    } else {
      setErrorMsg(message);
      setSuccessMsg('');
      setTimeout(() => setErrorMsg(''), 5000);
    }
  };

  // Visual Editor Toolbar Handlers
  const execEditorCommand = (command, value = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
    }
  };

  const handleApplyColor = (colorHex) => {
    execEditorCommand('foreColor', colorHex);
    setShowColorPicker(false);
  };

  const handleOpenLinkModal = () => {
    const selection = window.getSelection().toString();
    setLinkText(selection);
    setLinkUrl('');
    setShowLinkModal(true);
  };

  const handleInsertLink = (e) => {
    e.preventDefault();
    if (!linkUrl) return;

    if (editorRef.current) {
      editorRef.current.focus();
      if (linkText) {
        const anchorHtml = `<a href="${linkUrl}" target="_blank" style="color: #3b82f6; text-decoration: underline; font-weight: bold;">${linkText}</a>`;
        document.execCommand('insertHTML', false, anchorHtml);
      } else {
        document.execCommand('createLink', false, linkUrl);
      }
    }
    setShowLinkModal(false);
  };

  // Open Live Preview Console Overlay
  const handleOpenPreviewConsole = () => {
    const emailBody = editorRef.current ? editorRef.current.innerHTML : '';
    if (!recipient) {
      showToast(false, 'Please specify a recipient email address.');
      return;
    }
    if (!subject) {
      showToast(false, 'Please write a subject line.');
      return;
    }
    if (!emailBody || emailBody.trim() === '' || emailBody === '<br>') {
      showToast(false, 'Email body content cannot be empty.');
      return;
    }

    setShowPreviewConsole(true);
  };

  // Close Live Preview Console Overlay & Sync
  const handleClosePreviewConsole = () => {
    if (previewEditorRef.current && editorRef.current) {
      editorRef.current.innerHTML = previewEditorRef.current.innerHTML;
    }
    setShowPreviewConsole(false);
  };

  // AI assistant generation trigger
  const handleGenerateAI = async () => {
    if (!profile) {
      showToast(false, 'Please create or select an active candidate profile first.');
      return;
    }
    setGeneratingAI(true);
    try {
      const token = localStorage.getItem('pf_token');
      const customKey = localStorage.getItem('pf_custom_groq_key') || '';

      const response = await fetch('/api/mali/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-custom-groq-key': customKey
        },
        body: JSON.stringify({
          profile,
          targetRole,
          companyContext,
          tone,
          promptInstruction
        })
      });

      if (!response.ok) {
        throw new Error('AI generation failed. Check Groq API parameters.');
      }

      const data = await response.json();
      setSubject(data.subject || '');
      if (editorRef.current) {
        editorRef.current.innerHTML = data.body || '';
      }
      showToast(true, 'AI draft generated successfully and placed in the composer!');
    } catch (err) {
      showToast(false, err.message || 'Error occurred during generation.');
    } finally {
      setGeneratingAI(false);
    }
  };

  // Loads example templates
  const handleLoadExampleTemplate = (type) => {
    let exampleSubject = '';
    let exampleBody = '';

    const name = profile?.name || '[Your Name]';
    const profession = profile?.profession || '[Your Profession]';
    
    if (type === 'thankyou') {
      exampleSubject = `Thank you - ${profession} Interview`;
      exampleBody = `<p>Hi [Interviewer Name],</p>
<p>Thank you so much for your time today. I really enjoyed learning more about the engineering team and the <strong>${profession}</strong> position at [Company].</p>
<p>Our conversation regarding your scaling goals and cloud-native services reinforced my excitement for this opportunity. I am confident my experience in building robust React dashboards and optimized Node services aligns perfectly with your immediate needs.</p>
<p>Please let me know if you require any additional references. I look forward to hearing from you.</p>
<p>Best regards,<br><strong>${name}</strong></p>`;
    } else if (type === 'outreach') {
      exampleSubject = `Inquiry: ${profession} Opportunities at [Company]`;
      exampleBody = `<p>Hello [Recruiter Name],</p>
<p>I hope you are doing well. I’ve been following [Company]’s recent expansions in automation workflows and was highly impressed by your new developer frameworks.</p>
<p>I am a <strong>${profession}</strong> specializing in modern JavaScript applications. I noticed you are currently looking for a key engineering resource. In my past roles, I focused heavily on building interactive client interfaces, reducing page loads, and driving efficient API bindings.</p>
<p>You can <a href="http://localhost:5173/" target="_blank" style="color: #3b82f6; text-decoration: underline; font-weight: bold;">view my digital portfolio here</a> to check some of my work.</p>
<p>Would you be open to a quick 10-minute introduction call next Tuesday at 10 AM?</p>
<p>Thank you for your consideration,<br><strong>${name}</strong></p>`;
    }

    setSubject(exampleSubject);
    if (editorRef.current) {
      editorRef.current.innerHTML = exampleBody;
    }
    showToast(true, 'Example template loaded into the composer!');
  };

  // Clear composer fields
  const handleClearComposer = () => {
    setSubject('');
    setRecipient('');
    setEditingEmailId(null);
    setIsImmediate(true);
    setScheduleDate(todayStr);
    setScheduleHour(currentHourStr);
    setScheduleMinute(currentMinuteStr);
    setSenderName(profile?.name ? `${profile.name} (Mali AI)` : 'ProForge AI Mali Studio');
    setSelectedFont('Arial, Helvetica, sans-serif');
    setSelectedBgTheme('#ffffff');
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
    }
  };

  // Load an existing pending email back into the composer to edit/reschedule
  const handleEditPending = (email) => {
    if (email.status !== 'pending') {
      showToast(false, 'Only pending scheduled emails can be modified.');
      return;
    }
    setEditingEmailId(email.id);
    setRecipient(email.toEmail);
    setSubject(email.subject);
    setSenderName(email.senderName || 'ProForge AI Mali Studio');
    setSelectedFont(email.fontFamily || 'Arial, Helvetica, sans-serif');
    setSelectedBgTheme(email.bgTheme || '#ffffff');
    
    if (editorRef.current) {
      editorRef.current.innerHTML = email.body;
    }

    const scheduledDate = new Date(email.scheduledAt);
    const yyyy = scheduledDate.getFullYear();
    const mm = String(scheduledDate.getMonth() + 1).padStart(2, '0');
    const dd = String(scheduledDate.getDate()).padStart(2, '0');
    const hh = String(scheduledDate.getHours()).padStart(2, '0');
    const min = String(Math.floor(scheduledDate.getMinutes() / 5) * 5).padStart(2, '0');

    setScheduleDate(`${yyyy}-${mm}-${dd}`);
    setScheduleHour(hh);
    setScheduleMinute(min);

    // Populate 12-hour equivalents
    const hourVal = parseInt(hh, 10);
    const pmVal = hourVal >= 12;
    setAmpm(pmVal ? 'PM' : 'AM');
    const h12Val = hourVal % 12;
    setScheduleHour12(String(h12Val === 0 ? 12 : h12Val).padStart(2, '0'));
    setCalMonth(scheduledDate.getMonth());
    setCalYear(yyyy);
    setIsImmediate(false);
    
    showToast(true, 'Email loaded in editor. Configure settings and preview before final scheduling.');
  };

  // Submit handler called from the Live Preview page
  const handleFinalSubmit = async (e) => {
    if (e) e.preventDefault();
    
    const finalBody = previewEditorRef.current ? previewEditorRef.current.innerHTML : '';

    if (!recipient) {
      showToast(false, 'Please specify a recipient email address.');
      return;
    }
    if (!subject) {
      showToast(false, 'Please write a subject line.');
      return;
    }
    if (!finalBody || finalBody.trim() === '' || finalBody === '<br>') {
      showToast(false, 'Email body content cannot be empty.');
      return;
    }

    let finalScheduledAt = new Date().toISOString();
    if (!isImmediate) {
      let finalHour = scheduleHour;
      if (use12Hour) {
        const hourNum = parseInt(scheduleHour12, 10);
        if (ampm === 'AM') {
          finalHour = String(hourNum === 12 ? 0 : hourNum).padStart(2, '0');
        } else {
          finalHour = String(hourNum === 12 ? 12 : hourNum + 12).padStart(2, '0');
        }
      }

      if (!scheduleDate || !finalHour || !scheduleMinute) {
        showToast(false, 'Please select both date and time for scheduled delivery.');
        return;
      }
      
      const combinedDateTime = new Date(`${scheduleDate}T${finalHour}:${scheduleMinute}:00`);
      if (isNaN(combinedDateTime.getTime())) {
        showToast(false, 'Invalid schedule date/time format.');
        return;
      }
      if (combinedDateTime < new Date()) {
        showToast(false, 'Scheduled time must be in the future.');
        return;
      }
      finalScheduledAt = combinedDateTime.toISOString();
    }

    setSchedulingEmail(true);
    try {
      const token = localStorage.getItem('pf_token');
      const payload = {
        toEmail: recipient,
        subject,
        body: finalBody,
        scheduledAt: finalScheduledAt,
        isImmediate,
        senderName,
        fontFamily: selectedFont,
        bgTheme: selectedBgTheme
      };

      let response;
      if (editingEmailId) {
        response = await fetch(`/api/mali/schedules/${editingEmailId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch('/api/mali/schedules', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to submit email schedule.');
      }

      showToast(
        true, 
        isImmediate 
          ? 'Email dispatched immediately! Check logs for transmission status.' 
          : 'Email scheduled successfully in the queue!'
      );
      
      setShowPreviewConsole(false);
      handleClearComposer();
      loadSchedules();
    } catch (err) {
      showToast(false, err.message);
    } finally {
      setSchedulingEmail(false);
    }
  };

  // Delete/Cancel an email schedule
  const handleDeleteSchedule = async (id) => {
    if (!window.confirm('Are you sure you want to cancel and remove this scheduled email?')) return;
    try {
      const token = localStorage.getItem('pf_token');
      const response = await fetch(`/api/mali/schedules/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        showToast(true, 'Email schedule deleted and canceled.');
        loadSchedules();
      } else {
        throw new Error('Failed to delete schedule.');
      }
    } catch (err) {
      showToast(false, err.message);
    }
  };

  // CUSTOM REACT CALENDAR HELPERS
  const handlePrevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(calYear - 1);
    } else {
      setCalMonth(calMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(calYear + 1);
    } else {
      setCalMonth(calMonth + 1);
    }
  };

  const formatDateString = (year, month, day) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  const isDatePast = (year, month, day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cellDate = new Date(year, month, day);
    return cellDate < today;
  };

  const firstDayIdx = new Date(calYear, calMonth, 1).getDay();
  const numDays = new Date(calYear, calMonth + 1, 0).getDate();
  const daysArray = Array.from({ length: numDays }, (_, i) => i + 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      
      {/* Toast notifications */}
      {successMsg && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 px-4 py-3 rounded-theme shadow-xl backdrop-blur-md animate-in fade-in duration-300">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span className="text-xs font-bold">{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-theme shadow-xl backdrop-blur-md animate-in fade-in duration-300">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="text-xs font-bold">{errorMsg}</span>
        </div>
      )}

      {/* Header Description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-themeBorder pb-6">
        <div>
          <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-themePrimary bg-themePrimary/10 px-2 py-0.5 rounded-full mb-1 border border-themePrimary/20">
            <Sparkles className="h-3.5 w-3.5" />
            Mali AI Workspace
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-themeText">
            Email scheduling & campaign studio
          </h1>
          <p className="text-xs text-themeTextSecondary mt-1 leading-relaxed max-w-xl">
            Draft customizable rich-text outreaches, utilize Groq Llama/Qwen templates matching your active profile, and coordinate automated, timed email dispatches.
          </p>
        </div>
        {profile && (
          <div className="shrink-0 flex items-center gap-2.5 p-3 rounded-theme bg-themeCard border border-themeBorder">
            <div className="p-2 rounded bg-themePrimary/10 text-themePrimary">
              <Mail className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="text-xxs font-black text-themeTextSecondary uppercase">Active profile</div>
              <div className="text-xs font-bold text-themeText">{profile.name}</div>
            </div>
          </div>
        )}
      </div>

      {/* Grid workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: AI Assistant & Built-in Templates (Span 3/12) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* AI generator form */}
          <div className="glass-panel p-5 border border-themeBorder bg-themeCard rounded-theme space-y-4">
            <h2 className="text-xs font-black text-themeText uppercase tracking-wider flex items-center gap-1.5 border-b border-themeBorder pb-2">
              <Sparkles className="h-4 w-4 text-themePrimary" />
              AI Assistant Draft
            </h2>
            
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-black text-themeTextSecondary uppercase block mb-1">Target Role</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Frontend Developer"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full bg-themeBg border border-themeBorder rounded px-3 py-2 text-xs text-themeText focus:border-themePrimary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-themeTextSecondary uppercase block mb-1">Company / Context</label>
                <input
                  type="text"
                  placeholder="e.g. Google Cloud systems"
                  value={companyContext}
                  onChange={(e) => setCompanyContext(e.target.value)}
                  className="w-full bg-themeBg border border-themeBorder rounded px-3 py-2 text-xs text-themeText focus:border-themePrimary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-themeTextSecondary uppercase block mb-1">Outreach Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-themeBg border border-themeBorder rounded px-3 py-2 text-xs text-themeText focus:border-themePrimary focus:outline-none cursor-pointer"
                >
                  <option value="Professional">👔 Professional</option>
                  <option value="Casual">☕ Friendly & Casual</option>
                  <option value="Persuasive">🎯 Convincing & Sales</option>
                  <option value="Bold">🔥 Bold & Direct</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-themeTextSecondary uppercase block mb-1">Custom Prompt</label>
                <textarea
                  rows="3"
                  placeholder="e.g. Ask for a brief introduction call next Tuesday morning..."
                  value={promptInstruction}
                  onChange={(e) => setPromptInstruction(e.target.value)}
                  className="w-full bg-themeBg border border-themeBorder rounded px-3 py-2 text-xs text-themeText focus:border-themePrimary focus:outline-none resize-none"
                ></textarea>
              </div>

              <button
                onClick={handleGenerateAI}
                disabled={generatingAI}
                className="w-full bg-themePrimary hover:bg-themePrimary/95 disabled:bg-themePrimary/50 text-white font-bold py-2.5 px-4 rounded text-xs flex items-center justify-center gap-1.5 shadow transition-all active:scale-[0.98] cursor-pointer"
              >
                {generatingAI ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Drafting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate AI Draft</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Built-in templates list */}
          <div className="glass-panel p-5 border border-themeBorder bg-themeCard rounded-theme space-y-4">
            <h2 className="text-xs font-black text-themeText uppercase tracking-wider flex items-center gap-1.5 border-b border-themeBorder pb-2">
              <HelpCircle className="h-4 w-4 text-themePrimary" />
              Built-in templates
            </h2>
            <p className="text-[10px] text-themeTextSecondary leading-relaxed">
              Load and modify ready-to-use visual campaigns built specifically for engineering and professional follow-ups:
            </p>
            <div className="space-y-2">
              <button
                onClick={() => handleLoadExampleTemplate('thankyou')}
                className="w-full text-left p-2.5 rounded border border-themeBorder bg-themeBg/40 hover:bg-themePrimary/5 hover:border-themePrimary/30 transition-all flex items-center justify-between text-xs font-bold text-themeText cursor-pointer group"
              >
                <span>☕ Interview Thank-You</span>
                <ChevronRight className="h-4 w-4 text-themeTextSecondary group-hover:text-themePrimary transition-colors" />
              </button>
              <button
                onClick={() => handleLoadExampleTemplate('outreach')}
                className="w-full text-left p-2.5 rounded border border-themeBorder bg-themeBg/40 hover:bg-themePrimary/5 hover:border-themePrimary/30 transition-all flex items-center justify-between text-xs font-bold text-themeText cursor-pointer group"
              >
                <span>✉️ Cold Recruiter Pitch</span>
                <ChevronRight className="h-4 w-4 text-themeTextSecondary group-hover:text-themePrimary transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: Custom Visual Editor (Span 5/12) */}
        <div className="lg:col-span-5">
          <div className="glass-panel p-6 border border-themeBorder bg-themeCard rounded-theme space-y-5">
            <div className="flex justify-between items-center border-b border-themeBorder pb-3">
              <h2 className="text-xs font-black text-themeText uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="h-4.5 w-4.5 text-themePrimary" />
                {editingEmailId ? 'Edit Draft Campaign' : 'Compose campaign outreach'}
              </h2>
              {(subject || recipient || (editorRef.current && editorRef.current.innerHTML !== '')) && (
                <button
                  type="button"
                  onClick={handleClearComposer}
                  className="text-xxs font-black text-themeTextSecondary hover:text-red-500 uppercase transition-colors"
                >
                  Clear Fields
                </button>
              )}
            </div>

            {/* Recipient Input */}
            <div>
              <label className="text-[10px] font-black text-themeTextSecondary uppercase block mb-1">To (Recipient Email)</label>
              <input
                type="email"
                placeholder="recruiter@targetcompany.com"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full bg-themeBg border border-themeBorder rounded px-3 py-2 text-xs text-themeText focus:border-themePrimary focus:outline-none"
                required
              />
            </div>

            {/* Subject Input */}
            <div>
              <label className="text-[10px] font-black text-themeTextSecondary uppercase block mb-1">Subject Line</label>
              <input
                type="text"
                placeholder="Inquiry: [Profession] Opportunities at [Company]"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-themeBg border border-themeBorder rounded px-3 py-2 text-xs text-themeText font-semibold focus:border-themePrimary focus:outline-none"
                required
              />
            </div>

            {/* Visual HTML Editor Workspace */}
            <div>
              <label className="text-[10px] font-black text-themeTextSecondary uppercase block mb-1.5">Message (Rich Text HTML)</label>
              
              <div className="border border-themeBorder rounded bg-themeBg/50 overflow-hidden">
                {/* Editor Toolbar */}
                <div className="flex flex-wrap items-center gap-0.5 p-1.5 bg-themeBg border-b border-themeBorder">
                  
                  {/* Styling Buttons */}
                  <button
                    type="button"
                    onClick={() => execEditorCommand('bold')}
                    className="p-1.5 rounded hover:bg-themeCard text-themeTextSecondary hover:text-themeText transition-colors"
                    title="Bold"
                  >
                    <Bold className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => execEditorCommand('italic')}
                    className="p-1.5 rounded hover:bg-themeCard text-themeTextSecondary hover:text-themeText transition-colors"
                    title="Italic"
                  >
                    <Italic className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => execEditorCommand('underline')}
                    className="p-1.5 rounded hover:bg-themeCard text-themeTextSecondary hover:text-themeText transition-colors"
                    title="Underline"
                  >
                    <Underline className="h-3.5 w-3.5" />
                  </button>

                  <div className="h-4 w-px bg-themeBorder mx-1"></div>

                  {/* Alignment buttons */}
                  <button
                    type="button"
                    onClick={() => execEditorCommand('justifyLeft')}
                    className="p-1.5 rounded hover:bg-themeCard text-themeTextSecondary hover:text-themeText transition-colors"
                    title="Align Left"
                  >
                    <AlignLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => execEditorCommand('justifyCenter')}
                    className="p-1.5 rounded hover:bg-themeCard text-themeTextSecondary hover:text-themeText transition-colors"
                    title="Align Center"
                  >
                    <AlignCenter className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => execEditorCommand('justifyRight')}
                    className="p-1.5 rounded hover:bg-themeCard text-themeTextSecondary hover:text-themeText transition-colors"
                    title="Align Right"
                  >
                    <AlignRight className="h-3.5 w-3.5" />
                  </button>

                  <div className="h-4 w-px bg-themeBorder mx-1"></div>

                  {/* Bullets List */}
                  <button
                    type="button"
                    onClick={() => execEditorCommand('insertUnorderedList')}
                    className="p-1.5 rounded hover:bg-themeCard text-themeTextSecondary hover:text-themeText transition-colors"
                    title="Bullet List"
                  >
                    <List className="h-3.5 w-3.5" />
                  </button>

                  {/* Hyperlink Tool */}
                  <button
                    type="button"
                    onClick={handleOpenLinkModal}
                    className="p-1.5 rounded hover:bg-themeCard text-themeTextSecondary hover:text-themeText transition-colors"
                    title="Insert Link"
                  >
                    <Link2 className="h-3.5 w-3.5" />
                  </button>

                  {/* Font Color dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      className="p-1.5 rounded hover:bg-themeCard text-themeTextSecondary hover:text-themeText transition-colors flex items-center"
                      title="Font Color"
                    >
                      <Palette className="h-3.5 w-3.5" />
                    </button>
                    {showColorPicker && (
                      <div className="absolute left-0 mt-1.5 p-2 bg-themeCard border border-themeBorder rounded-theme shadow-xl grid grid-cols-5 gap-1.5 z-30 w-40">
                        {textColors.map((color) => (
                          <button
                            key={color.name}
                            type="button"
                            onClick={() => handleApplyColor(color.value)}
                            className="w-5 h-5 rounded border border-themeBorder hover:scale-110 transition-transform cursor-pointer"
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          ></button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Font Size select */}
                  <select
                    onChange={(e) => execEditorCommand('fontSize', e.target.value)}
                    className="bg-themeBg text-themeTextSecondary text-[10px] font-bold rounded border border-themeBorder px-1.5 py-1 focus:outline-none cursor-pointer"
                    defaultValue="3"
                  >
                    <option value="2">Small</option>
                    <option value="3">Normal</option>
                    <option value="4">Large</option>
                    <option value="5">XL</option>
                    <option value="6">XXL</option>
                  </select>

                  {/* Clear formatting */}
                  <button
                    type="button"
                    onClick={() => execEditorCommand('removeFormat')}
                    className="p-1.5 rounded hover:bg-themeCard text-themeTextSecondary hover:text-themeText transition-colors text-[10px] font-black uppercase"
                    title="Clear Formatting"
                  >
                    <Trash className="h-3 w-3 inline mr-0.5" /> Clear
                  </button>
                </div>

                {/* Editor Content Area */}
                <div
                  ref={editorRef}
                  contentEditable
                  className="min-h-[250px] max-h-[350px] overflow-y-auto p-4 text-xs text-themeText focus:outline-none bg-themeCard leading-relaxed cursor-text"
                  placeholder="Write your email here..."
                  style={{ minHeight: '250px' }}
                ></div>
              </div>
            </div>

            {/* Action Preview */}
            <button
              type="button"
              onClick={handleOpenPreviewConsole}
              className="w-full bg-themePrimary hover:bg-themePrimary/95 text-white font-bold py-3 px-4 rounded text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              <Eye className="h-4.5 w-4.5" />
              <span>Configure & Preview Outreach</span>
            </button>

          </div>
        </div>

        {/* RIGHT COLUMN: Scheduled Outreach Queue (Span 4/12) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 border border-themeBorder bg-themeCard rounded-theme flex flex-col min-h-[500px]">
            <h2 className="text-xs font-black text-themeText uppercase tracking-wider flex items-center gap-1.5 border-b border-themeBorder pb-3">
              <Clock className="h-4.5 w-4.5 text-themePrimary" />
              Outreach Queue ({schedules.length})
            </h2>

            {loadingSchedules ? (
              <div className="flex-grow flex flex-col items-center justify-center py-12 space-y-2 text-themeTextSecondary">
                <div className="w-6 h-6 border-2 border-themePrimary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xxs">Loading schedules queue...</span>
              </div>
            ) : schedules.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center py-12 text-center text-themeTextSecondary">
                <Mail className="h-8 w-8 opacity-25 mb-2" />
                <span className="text-xs font-bold">Queue is currently empty</span>
                <p className="text-[10px] leading-relaxed max-w-[200px] mt-1">
                  Draft an outreach message or load one of the built-in examples to verify scheduling dispatches.
                </p>
              </div>
            ) : (
              <div className="flex-grow space-y-3.5 overflow-y-auto max-h-[500px] pt-3 pr-1">
                {schedules.map((email) => {
                  const dateStr = new Date(email.scheduledAt).toLocaleString();
                  const isMock = email.id.startsWith('mock-');
                  
                  return (
                    <div 
                      key={email.id} 
                      className={`p-3.5 rounded border bg-themeBg/40 hover:bg-themeBg/70 transition-all flex flex-col justify-between space-y-3 relative group/card ${
                        email.id === editingEmailId ? 'border-themePrimary shadow-md ring-1 ring-themePrimary' : 'border-themeBorder'
                      }`}
                    >
                      {/* Status Badges */}
                      <div className="flex justify-between items-start gap-2">
                        <div className="max-w-[70%]">
                          <div className="text-[10px] font-bold text-themeTextSecondary truncate">To: {email.toEmail}</div>
                          <h4 className="text-xs font-bold text-themeText truncate mt-0.5" title={email.subject}>
                            {email.subject}
                          </h4>
                        </div>
                        
                        <div className="shrink-0 flex items-center">
                          {email.status === 'pending' && (
                            <span className="text-[9px] font-black tracking-wide uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse">
                              Pending
                            </span>
                          )}
                          {email.status === 'sent' && (
                            <span className="text-[9px] font-black tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                              Sent
                            </span>
                          )}
                          {email.status === 'failed' && (
                            <span className="text-[9px] font-black tracking-wide uppercase px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20" title={email.error}>
                              Failed
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Display warning details for failed dispatches */}
                      {email.status === 'failed' && email.error && (
                        <div className="p-2 rounded bg-red-500/5 border border-red-500/15 text-[10px] text-red-400 font-bold leading-relaxed break-words">
                          Error: {email.error}
                        </div>
                      )}

                      {/* Footer timing & actions */}
                      <div className="flex items-center justify-between border-t border-themeBorder/40 pt-2.5 text-[10px] text-themeTextSecondary font-bold">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          <span>{dateStr}</span>
                          {isMock && (
                            <span className="text-[9px] px-1 bg-themePrimary/15 text-themePrimary rounded-sm shrink-0 ml-1">
                              Example
                            </span>
                          )}
                        </div>

                        {/* Edit / Delete actions */}
                        <div className="flex items-center gap-1">
                          {email.status === 'pending' && (
                            <button
                              onClick={() => handleEditPending(email)}
                              className="p-1 rounded text-themeTextSecondary hover:text-themePrimary hover:bg-themeBg transition-all cursor-pointer"
                              title="Edit schedule details"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteSchedule(email.id)}
                            className="p-1 rounded text-themeTextSecondary hover:text-red-500 hover:bg-red-500/5 transition-all cursor-pointer"
                            title="Cancel outreach"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Insert Hyperlink Modal overlay */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-sm p-6 bg-themeCard border border-themeBorder rounded-theme shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 border-b border-themeBorder pb-3">
              <Link2 className="h-5 w-5 text-themePrimary" />
              <h3 className="text-sm font-black text-themeText uppercase">Insert Hyperlink</h3>
            </div>
            
            <form onSubmit={handleInsertLink} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-themeTextSecondary uppercase block mb-1">URL Address</label>
                <input
                  type="url"
                  placeholder="https://myportfolio.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full bg-themeBg border border-themeBorder rounded px-3 py-2 text-xs text-themeText focus:border-themePrimary focus:outline-none"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-themeTextSecondary uppercase block mb-1">Display Text (Optional)</label>
                <input
                  type="text"
                  placeholder="Link label (defaults to selection)"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full bg-themeBg border border-themeBorder rounded px-3 py-2 text-xs text-themeText focus:border-themePrimary focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-themeBorder">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="px-4 py-2 bg-themeBg hover:bg-themeBg/85 border border-themeBorder text-themeTextSecondary rounded text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-themePrimary hover:bg-themePrimary/95 text-white rounded text-xs font-bold transition-all cursor-pointer"
                >
                  Insert Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW STYLING & PREVIEW CONSOLE OVERLAY */}
      {showPreviewConsole && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-themeBg/95 backdrop-blur-md flex flex-col animate-in fade-in duration-300">
          
          {/* Header Controls Bar */}
          <div className="sticky top-0 z-10 w-full border-b border-themeBorder bg-themeCard/90 backdrop-blur-md py-4 px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleClosePreviewConsole}
                className="p-1.5 rounded hover:bg-themeBg text-themeTextSecondary hover:text-themeText transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-xs font-bold hidden sm:inline">Back to draft</span>
              </button>
              <div className="h-4 w-px bg-themeBorder"></div>
              <div>
                <h3 className="text-sm font-black text-themeText uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="h-4 w-4 text-themePrimary" />
                  Live Preview & Custom Styling Console
                </h3>
              </div>
            </div>

            <button
              onClick={handleClosePreviewConsole}
              className="p-1.5 rounded hover:bg-themeBg text-themeTextSecondary hover:text-red-500 transition-colors cursor-pointer"
              title="Close Preview Console"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Main Console Body Workspace */}
          <div className="max-w-7xl mx-auto w-full px-6 py-8 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT OPTIONS PANEL: Styling adjustments, sender overrides, timing (Span 4/12) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Sender branding options card */}
              <div className="glass-panel p-5 border border-themeBorder bg-themeCard rounded-theme space-y-5">
                <h3 className="text-xs font-black text-themeText uppercase tracking-wider flex items-center gap-1.5 border-b border-themeBorder pb-2.5">
                  <Palette className="h-4 w-4 text-themePrimary" />
                  Visual Style Customizer
                </h3>

                {/* Sender Name override */}
                <div>
                  <label className="text-[10px] font-black text-themeTextSecondary uppercase block mb-1">
                    Sender Display Name
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Jay Dhave (Mali AI)"
                    className="w-full bg-themeBg border border-themeBorder rounded px-3 py-2.5 text-xs text-themeText font-semibold focus:border-themePrimary focus:outline-none"
                  />
                  <p className="text-[9px] text-themeTextSecondary mt-1 leading-relaxed">
                    Customizes the display header seen by the receiver (e.g. <strong>"{senderName}"</strong>) instead of default.
                  </p>
                </div>

                {/* Font Selector */}
                <div>
                  <label className="text-[10px] font-black text-themeTextSecondary uppercase block mb-1">
                    Email Typography Font (12 Choices)
                  </label>
                  <select
                    value={selectedFont}
                    onChange={(e) => setSelectedFont(e.target.value)}
                    className="w-full bg-themeBg border border-themeBorder rounded px-3 py-2.5 text-xs text-themeText font-bold focus:border-themePrimary focus:outline-none cursor-pointer"
                  >
                    {fonts.map(f => (
                      <option key={f.name} value={f.value}>{f.name}</option>
                    ))}
                  </select>
                </div>

                {/* Background Wrap Color Selector */}
                <div>
                  <label className="text-[10px] font-black text-themeTextSecondary uppercase block mb-2">
                    Email Background Wrapper Theme
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {bgThemes.map(theme => (
                      <button
                        key={theme.name}
                        type="button"
                        onClick={() => setSelectedBgTheme(theme.value)}
                        className={`w-full text-left p-2.5 rounded border transition-all flex items-center justify-between cursor-pointer ${
                          selectedBgTheme === theme.value 
                            ? 'border-themePrimary bg-themePrimary/5 ring-1 ring-themePrimary' 
                            : 'border-themeBorder bg-themeBg/40 hover:bg-themeBg/80'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-5.5 h-5.5 rounded border border-themeBorder shadow-inner shrink-0" 
                            style={{ backgroundColor: theme.value }}
                          ></div>
                          <div>
                            <div className="text-xs font-bold text-themeText">{theme.name}</div>
                            <div className="text-[9px] text-themeTextSecondary opacity-80">{theme.desc}</div>
                          </div>
                        </div>
                        {selectedBgTheme === theme.value && (
                          <div className="w-1.5 h-1.5 rounded-full bg-themePrimary"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Deliverytiming options (With custom React Calendar and Time selecting UI) */}
              <div className="glass-panel p-5 border border-themeBorder bg-themeCard rounded-theme space-y-4">
                <h3 className="text-xs font-black text-themeText uppercase tracking-wider flex items-center gap-1.5 border-b border-themeBorder pb-2.5">
                  <Clock className="h-4 w-4 text-themePrimary" />
                  Outreach Dispatch Timing
                </h3>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-themeTextSecondary uppercase">Timing</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-xs text-themeText cursor-pointer">
                      <input
                        type="radio"
                        checked={isImmediate}
                        onChange={() => setIsImmediate(true)}
                        className="cursor-pointer text-themePrimary focus:ring-0"
                      />
                      Send Instantly
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-themeText cursor-pointer">
                      <input
                        type="radio"
                        checked={!isImmediate}
                        onChange={() => setIsImmediate(false)}
                        className="cursor-pointer text-themePrimary focus:ring-0"
                      />
                      Schedule Later
                    </label>
                  </div>
                </div>

                {!isImmediate && (
                  <div className="space-y-4 animate-in slide-in-from-top-1 duration-200">
                    
                    {/* CUSTOM INLINE CALENDAR PICKER */}
                    <div>
                      <label className="text-[10px] font-black text-themeTextSecondary uppercase block mb-1.5">
                        Select Delivery Date
                      </label>
                      <div className="border border-themeBorder rounded bg-themeBg/40 overflow-hidden p-3 space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold text-themeText">
                          <button
                            type="button"
                            onClick={handlePrevMonth}
                            className="p-1 hover:bg-themeCard rounded text-themeTextSecondary hover:text-themeText transition-colors cursor-pointer"
                          >
                            &lt;
                          </button>
                          <span>{monthNames[calMonth]} {calYear}</span>
                          <button
                            type="button"
                            onClick={handleNextMonth}
                            className="p-1 hover:bg-themeCard rounded text-themeTextSecondary hover:text-themeText transition-colors cursor-pointer"
                          >
                            &gt;
                          </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold">
                          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                            <span key={d} className="text-themeTextSecondary opacity-65 py-1">{d}</span>
                          ))}
                          
                          {Array(firstDayIdx).fill(null).map((_, idx) => (
                            <span key={`empty-${idx}`} className="py-1"></span>
                          ))}

                          {daysArray.map(day => {
                            const dateStr = formatDateString(calYear, calMonth, day);
                            const isSelected = scheduleDate === dateStr;
                            const isPast = isDatePast(calYear, calMonth, day);

                            return (
                              <button
                                key={`day-${day}`}
                                type="button"
                                disabled={isPast}
                                onClick={() => setScheduleDate(dateStr)}
                                className={`py-1 rounded text-center text-xs transition-all focus:outline-none cursor-pointer ${
                                  isSelected 
                                    ? 'bg-themePrimary text-white font-black'
                                    : isPast
                                      ? 'text-themeTextSecondary/30 cursor-not-allowed'
                                      : 'text-themeText hover:bg-themePrimary/20 hover:text-themePrimary'
                                }`}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      {scheduleDate && (
                        <div className="text-[10px] text-themePrimary font-bold mt-1">
                          Date: {new Date(scheduleDate + 'T00:00:00').toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </div>
                      )}
                    </div>

                    {/* CUSTOM TIME PICKER WITH 12H / 24H CLOCK MODE TOGGLE */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[10px] font-black text-themeTextSecondary uppercase">
                          Select Delivery Time
                        </label>
                        {/* Toggle button */}
                        <div className="flex items-center bg-themeBg border border-themeBorder p-0.5 rounded text-[9px] font-black">
                          <button
                            type="button"
                            onClick={() => setUse12Hour(true)}
                            className={`px-1.5 py-0.5 rounded-sm transition-colors cursor-pointer ${
                              use12Hour ? 'bg-themePrimary text-white shadow-sm' : 'text-themeTextSecondary'
                            }`}
                          >
                            12H
                          </button>
                          <button
                            type="button"
                            onClick={() => setUse12Hour(false)}
                            className={`px-1.5 py-0.5 rounded-sm transition-colors cursor-pointer ${
                              !use12Hour ? 'bg-themePrimary text-white shadow-sm' : 'text-themeTextSecondary'
                            }`}
                          >
                            24H
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-12 gap-2">
                        {use12Hour ? (
                          <>
                            <div className="col-span-5">
                              <label className="text-[9px] font-bold text-themeTextSecondary block mb-1">Hour</label>
                              <select
                                value={scheduleHour12}
                                onChange={(e) => setScheduleHour12(e.target.value)}
                                className="w-full bg-themeBg border border-themeBorder rounded px-2 py-1.5 text-xs text-themeText font-bold focus:border-themePrimary focus:outline-none cursor-pointer"
                              >
                                {Array.from({ length: 12 }).map((_, h) => {
                                  const hStr = String(h + 1).padStart(2, '0');
                                  return <option key={hStr} value={hStr}>{hStr}</option>;
                                })}
                              </select>
                            </div>
                            <div className="col-span-4">
                              <label className="text-[9px] font-bold text-themeTextSecondary block mb-1">Min</label>
                              <select
                                value={scheduleMinute}
                                onChange={(e) => setScheduleMinute(e.target.value)}
                                className="w-full bg-themeBg border border-themeBorder rounded px-2 py-1.5 text-xs text-themeText font-bold focus:border-themePrimary focus:outline-none cursor-pointer"
                              >
                                {Array.from({ length: 12 }).map((_, m) => {
                                  const mStr = String(m * 5).padStart(2, '0');
                                  return <option key={mStr} value={mStr}>{mStr}</option>;
                                })}
                              </select>
                            </div>
                            <div className="col-span-3">
                              <label className="text-[9px] font-bold text-themeTextSecondary block mb-1">Period</label>
                              <select
                                value={ampm}
                                onChange={(e) => setAmpm(e.target.value)}
                                className="w-full bg-themeBg border border-themeBorder rounded px-1.5 py-1.5 text-xs text-themeText font-bold focus:border-themePrimary focus:outline-none cursor-pointer"
                              >
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                              </select>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="col-span-6">
                              <label className="text-[9px] font-bold text-themeTextSecondary block mb-1">Hour (24h)</label>
                              <select
                                value={scheduleHour}
                                onChange={(e) => setScheduleHour(e.target.value)}
                                className="w-full bg-themeBg border border-themeBorder rounded px-2.5 py-1.5 text-xs text-themeText font-bold focus:border-themePrimary focus:outline-none cursor-pointer"
                              >
                                {Array.from({ length: 24 }).map((_, h) => {
                                  const hStr = String(h).padStart(2, '0');
                                  return <option key={hStr} value={hStr}>{hStr}</option>;
                                })}
                              </select>
                            </div>
                            <div className="col-span-6">
                              <label className="text-[9px] font-bold text-themeTextSecondary block mb-1">Minute</label>
                              <select
                                value={scheduleMinute}
                                onChange={(e) => setScheduleMinute(e.target.value)}
                                className="w-full bg-themeBg border border-themeBorder rounded px-2.5 py-1.5 text-xs text-themeText font-bold focus:border-themePrimary focus:outline-none cursor-pointer"
                              >
                                {Array.from({ length: 12 }).map((_, m) => {
                                  const mStr = String(m * 5).padStart(2, '0');
                                  return <option key={mStr} value={mStr}>{mStr}</option>;
                                })}
                              </select>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleClosePreviewConsole}
                  type="button"
                  className="flex-1 bg-themeCard hover:bg-themeBg border border-themeBorder text-themeTextSecondary font-bold py-3.5 px-4 rounded text-xs text-center transition-all cursor-pointer"
                >
                  Adjust Draft
                </button>
                <button
                  onClick={handleFinalSubmit}
                  disabled={schedulingEmail}
                  className="flex-1 bg-themePrimary hover:bg-themePrimary/95 disabled:bg-themePrimary/50 text-white font-bold py-3.5 px-4 rounded text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-themePrimary/20 transition-all active:scale-[0.98] cursor-pointer"
                >
                  {schedulingEmail ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : isImmediate ? (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Confirm & Send Now</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="h-4 w-4" />
                      <span>Confirm & Queue</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* RIGHT PREVIEW PANEL: Live simulated sandbox client (Span 8/12) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="text-[10px] font-bold text-themeTextSecondary uppercase pl-1 flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                Interactive Sandbox Client Preview (Editable)
              </div>

              <div className="border border-themeBorder rounded-theme shadow-2xl bg-themeCard overflow-hidden">
                
                {/* Mock Browser Header */}
                <div className="bg-themeBg/80 border-b border-themeBorder px-5 py-4 space-y-2.5 text-xs">
                  
                  {/* From info */}
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-themeTextSecondary w-16 shrink-0">From:</span>
                    <span className="text-themeText font-semibold flex items-center gap-1.5">
                      <span className="text-themePrimary bg-themePrimary/15 px-2 py-0.5 rounded font-black text-xxs tracking-wide">
                        {senderName || 'ProForge AI Mali Studio'}
                      </span>
                      &lt;playnest@zohomail.in&gt;
                    </span>
                  </div>

                  {/* To info */}
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-themeTextSecondary w-16 shrink-0">To:</span>
                    <span className="text-themeText font-bold">{recipient}</span>
                  </div>

                  {/* Reply-To info */}
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-themeTextSecondary w-16 shrink-0">Reply-To:</span>
                    <span className="text-themeText font-medium opacity-85 underline decoration-dotted">
                      {profile?.contact_email || 'your-account-email@domain.com'}
                    </span>
                  </div>

                  {/* Subject */}
                  <div className="flex items-center gap-1.5 border-t border-themeBorder/40 pt-2.5">
                    <span className="font-bold text-themeTextSecondary w-16 shrink-0">Subject:</span>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="bg-transparent border-0 focus:outline-none focus:ring-0 p-0 text-xs font-black text-themeText flex-grow"
                    />
                  </div>
                </div>

                {/* Email Body Simulation Sandbox Frame */}
                <div 
                  className="p-8 overflow-y-auto max-h-[500px]"
                  style={{ backgroundColor: selectedBgTheme, minHeight: '350px' }}
                >
                  <div 
                    ref={previewEditorRef}
                    contentEditable
                    className="focus:outline-none text-sm select-text cursor-text leading-relaxed"
                    style={{ 
                      fontFamily: selectedFont, 
                      color: selectedBgTheme === '#1e293b' || selectedBgTheme === '#0f172a' ? '#ffffff' : '#1f2937', 
                      backgroundColor: 'transparent'
                    }}
                    dangerouslySetInnerHTML={{ __html: editorRef.current ? editorRef.current.innerHTML : '' }}
                  ></div>
                </div>

                {/* Bottom Footer Notice */}
                <div className="bg-themeBg/50 border-t border-themeBorder px-5 py-3 text-[10px] text-themeTextSecondary text-center leading-relaxed">
                  💡 **In-Place Sandbox Editor:** You can click and edit the email body directly in the preview frame above to apply final adjustments before dispatching.
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

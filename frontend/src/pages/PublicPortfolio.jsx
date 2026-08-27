import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Briefcase, BookOpen, Award, CheckCircle, Terminal, Sparkles, Send, ArrowRight } from 'lucide-react';

export default function PublicPortfolio() {
  const { slugOrId } = useParams();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [sentMessage, setSentMessage] = useState(false);

  useEffect(() => {
    const fetchPublicData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/profiles/public/${slugOrId}`);
        if (!res.ok) {
          throw new Error('Portfolio profile not found');
        }
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicData();
  }, [slugOrId]);

  const handleSubmitContact = (e) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) {
      alert('All contact fields are required.');
      return;
    }
    // Simulate contact submission
    setSentMessage(true);
    setTimeout(() => {
      setSentMessage(false);
      setContactName('');
      setContactEmail('');
      setContactMsg('');
    }, 4000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0B10] space-y-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-slate-400">Loading public portfolio...</span>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0B10] space-y-4 text-center px-4">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <h1 className="text-xl font-bold text-white">404 - Portfolio Not Found</h1>
        <p className="text-sm text-slate-400 max-w-sm">
          The public profile URL you requested does not exist or has been removed. Check the link spelling.
        </p>
        <a href="/" className="text-xs text-blue-500 font-bold hover:underline">Return to homepage</a>
      </div>
    );
  }

  // Extract variables
  const theme = profile.folioTheme || 'bento';
  const showSocials = profile.showSocials !== undefined ? profile.showSocials : true;
  const showProjects = profile.showProjects !== undefined ? profile.showProjects : true;
  const showContactForm = profile.showContactForm !== undefined ? profile.showContactForm : true;
  const accentColor = profile.accentColor || '#3B82F6';

  // Override content fields dynamically
  profile.profession = profile.customTitle || profile.profession;
  profile.tagline = profile.customTagline || profile.tagline;
  profile.bio = profile.customBio || profile.bio;

  // Apply colors dynamically helper
  const accentStyle = { color: accentColor };
  const accentBgStyle = { backgroundColor: accentColor };
  const accentBorderStyle = { borderColor: accentColor };

  // Parse arrays safely
  const parseArray = (arr) => {
    if (Array.isArray(arr)) return arr;
    try { return JSON.parse(arr); } catch (e) { return []; }
  };

  const skills = parseArray(profile.skills);
  const softSkills = parseArray(profile.soft_skills);
  const experience = parseArray(profile.experience);
  const education = parseArray(profile.education);
  
  const baseProjects = parseArray(profile.projects);
  const projects = Array.isArray(profile.customProjects) && profile.customProjects.length === baseProjects.length
    ? profile.customProjects
    : baseProjects;

  const achievements = parseArray(profile.achievements);
  const strengths = parseArray(profile.strengths);

  // Render Theme 1: Bento Grid
  if (theme === 'bento') {
    return (
      <div className="min-h-screen bg-[#06070B] text-slate-200 font-sans p-4 md:p-8 selection:bg-blue-500 selection:text-white pb-16">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#0E1017] border border-slate-800 rounded-[28px] p-6 items-center">
            <div className="md:col-span-2 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
              <div className="w-20 h-20 rounded-full flex items-center justify-center font-black text-white text-2xl select-none" style={accentBgStyle}>
                {profile.name?.slice(0, 2).toUpperCase() || 'PF'}
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-black text-white tracking-tight">{profile.name}</h1>
                <p className="text-xs font-bold uppercase tracking-wider" style={accentStyle}>{profile.profession || 'Professional'}</p>
                {profile.tagline && <p className="text-xs text-slate-400 italic">"{profile.tagline}"</p>}
                
                {/* Social icons */}
                {showSocials && (
                  <div className="flex gap-3 justify-center sm:justify-start pt-2">
                    {profile.contact_email && <a href={`mailto:${profile.contact_email}`} className="text-slate-400 hover:text-white transition-colors" title="Email"><Mail className="h-4 w-4" /></a>}
                    {profile.contact_phone && <span className="text-slate-400 text-xxs flex items-center gap-1"><Phone className="h-3 w-3" />{profile.contact_phone}</span>}
                    {profile.linkedin_url && <a href={profile.linkedin_url.startsWith('http') ? profile.linkedin_url : `https://${profile.linkedin_url}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors"><Linkedin className="h-4 w-4" /></a>}
                    {profile.github_url && <a href={profile.github_url.startsWith('http') ? profile.github_url : `https://${profile.github_url}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors"><Github className="h-4 w-4" /></a>}
                    {profile.portfolio_url && <a href={profile.portfolio_url.startsWith('http') ? profile.portfolio_url : `https://${profile.portfolio_url}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors"><Globe className="h-4 w-4" /></a>}
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-xs text-slate-400 text-center md:text-right border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 space-y-1">
              <div className="flex justify-center md:justify-end items-center gap-1.5"><MapPin className="h-3.5 w-3.5" style={accentStyle} /> {profile.contact_location || 'Remote'}</div>
              <div>Available for opportunities</div>
            </div>
          </div>

          {/* Grid Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Bio Card */}
            <div className="md:col-span-8 bg-[#0E1017] border border-slate-800 rounded-[28px] p-6 space-y-3 flex flex-col justify-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Biographical Summary</span>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">{profile.bio || 'No biography details provided yet.'}</p>
            </div>

            {/* Career Goals Card */}
            <div className="md:col-span-4 bg-[#0E1017] border border-slate-800 rounded-[28px] p-6 space-y-3 flex flex-col justify-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Core Mission</span>
              <p className="text-xs text-slate-300 leading-relaxed italic">"{profile.goal || 'To create professional experiences and contribute core capabilities to team success.'}"</p>
            </div>

            {/* Skills Card */}
            <div className="md:col-span-4 bg-[#0E1017] border border-slate-800 rounded-[28px] p-6 space-y-4">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Skills & Tech</h2>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold text-white">Technical Skills</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((s, idx) => (
                      <span key={idx} className="text-[10px] font-semibold py-1 px-2.5 rounded-full bg-[#181B26] text-white border border-slate-800">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {softSkills.length > 0 && (
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-bold text-white">Soft Skills</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {softSkills.map((s, idx) => (
                        <span key={idx} className="text-[10px] font-semibold py-1 px-2.5 rounded-full bg-[#181B26]/50 text-slate-300 border border-slate-800/40">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Experience Card */}
            <div className="md:col-span-8 bg-[#0E1017] border border-slate-800 rounded-[28px] p-6 space-y-4">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" style={accentStyle} /> Work History
              </h2>

              <div className="space-y-4">
                {experience.map((exp, idx) => (
                  <div key={idx} className="border-l-2 pl-4 space-y-1 relative" style={accentBorderStyle}>
                    <div className="flex justify-between items-start flex-col sm:flex-row">
                      <h3 className="text-xs font-extrabold text-white">{exp.role} @ {exp.company}</h3>
                      <span className="text-[10px] text-slate-400 font-semibold">{exp.duration}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-normal">{exp.description}</p>
                  </div>
                ))}
                {experience.length === 0 && <p className="text-xxs text-slate-400">No experiences listed.</p>}
              </div>
            </div>

            {/* Projects Card */}
            {showProjects && projects.length > 0 && (
              <div className="md:col-span-12 bg-[#0E1017] border border-slate-800 rounded-[28px] p-6 space-y-4">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Projects Showcase</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {projects.map((proj, idx) => (
                    <div key={idx} className="bg-[#141620] border border-slate-800/60 p-5 rounded-[20px] flex flex-col justify-between hover-lift">
                      <div className="space-y-2">
                        <h3 className="text-xs font-black text-white">{proj.title}</h3>
                        {proj.technologies && (
                          <div className="flex flex-wrap gap-1">
                            {proj.technologies.split(',').map((tech, tIdx) => (
                              <span key={tIdx} className="text-[9px] font-bold text-slate-400 px-1.5 py-0.5 rounded bg-[#181B26] border border-slate-800/40">
                                {tech.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{proj.description}</p>
                      </div>
                      {proj.duration && <span className="text-[9px] text-slate-400 font-bold block pt-3">{proj.duration}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education & Strengths Column */}
            <div className="md:col-span-6 bg-[#0E1017] border border-slate-800 rounded-[28px] p-6 space-y-4">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" style={accentStyle} /> Education
              </h2>
              <div className="space-y-4">
                {education.map((edu, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between flex-col sm:flex-row">
                      <h3 className="text-xs font-extrabold text-white">{edu.degree}</h3>
                      <span className="text-[10px] text-slate-400 font-semibold">{edu.duration}</span>
                    </div>
                    <p className="text-[11px] text-slate-300">{edu.school}</p>
                    {edu.description && <p className="text-xxs text-slate-400 leading-normal">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form Block */}
            {showContactForm && (
              <div className="md:col-span-6 bg-[#0E1017] border border-slate-800 rounded-[28px] p-6 space-y-4">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Get In Touch</h2>
                
                {sentMessage ? (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-theme text-center font-bold flex items-center justify-center gap-1.5 h-48 animate-in zoom-in-95">
                    <CheckCircle className="h-4 w-4" />
                    Thank you! Your message was delivered.
                  </div>
                ) : (
                  <form onSubmit={handleSubmitContact} className="space-y-3.5">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="Your Name"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full p-2.5 rounded-theme border border-slate-800 bg-[#141620] focus:outline-none focus:border-slate-600 text-xs text-white"
                      />
                      <input
                        type="email"
                        required
                        placeholder="Your Email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full p-2.5 rounded-theme border border-slate-800 bg-[#141620] focus:outline-none focus:border-slate-600 text-xs text-white"
                      />
                    </div>
                    <textarea
                      required
                      placeholder="Type your message..."
                      rows={3}
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      className="w-full p-2.5 rounded-theme border border-slate-800 bg-[#141620] focus:outline-none focus:border-slate-600 text-xs text-white resize-none"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 bg-blue-500 text-white font-bold rounded-theme text-xs shadow transition-all flex items-center justify-center gap-1.5 hover:brightness-110"
                      style={accentBgStyle}
                    >
                      <Send className="h-3.5 w-3.5" />
                      Send Outreach Email
                    </button>
                  </form>
                )}
              </div>
            )}

          </div>

          {/* Footer branding */}
          <div className="text-center text-[10px] text-slate-500 pt-8 border-t border-slate-800/40">
            Powered by Proforge AI Portfolio Generator. © 2026. All rights reserved.
          </div>
        </div>
      </div>
    );
  }

  // Render Theme 2: Cyber Terminal
  if (theme === 'terminal') {
    return (
      <div className="min-h-screen bg-black text-[#39FF14] font-mono p-4 md:p-8 selection:bg-green-500 selection:text-black">
        <div className="max-w-4xl mx-auto border-2 border-[#39FF14] rounded-lg p-6 bg-black/95 shadow-[0_0_15px_rgba(57,255,20,0.2)] text-left space-y-6">
          
          {/* Terminal Banner */}
          <div className="border-b-2 border-[#39FF14] pb-4 flex justify-between items-center text-xs">
            <span className="flex items-center gap-2"><Terminal className="h-4 w-4" /> PROFORGE_CLI v1.2</span>
            <span>SYSTEM STATE: ACTIVE</span>
          </div>

          {/* Bio block */}
          <div className="space-y-2">
            <h1 className="text-xl font-black uppercase tracking-widest text-white">&gt; C:\CANDIDATE\INFO\&gt; {profile.name}</h1>
            <p className="text-xs">&gt; ROLE: {profile.profession || 'Professional'}</p>
            {profile.tagline && <p className="text-xs text-yellow-400">&gt; TAGLINE: "{profile.tagline}"</p>}
            <p className="text-xs text-slate-300 leading-relaxed pt-2">&gt; BIO_DATA: {profile.bio || 'Biographical narrative unconfigured.'}</p>
          </div>

          {/* Skills block */}
          <div className="space-y-2 border-t border-[#39FF14]/30 pt-4">
            <h2 className="text-sm font-bold text-white">&gt; CORE_COMPETENCIES</h2>
            <div className="flex flex-wrap gap-2 pt-1">
              {skills.map((s, idx) => (
                <span key={idx} className="border border-[#39FF14] px-2 py-0.5 text-xs bg-[#39FF14]/5 rounded">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Experience block */}
          <div className="space-y-4 border-t border-[#39FF14]/30 pt-4">
            <h2 className="text-sm font-bold text-white">&gt; EXPERIENCE_JOURNAL</h2>
            {experience.map((exp, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="text-white font-bold">&gt;&gt; {exp.role} | {exp.company} [{exp.duration}]</div>
                <div className="text-slate-300 pl-4">{exp.description}</div>
              </div>
            ))}
          </div>

          {/* Projects block */}
          {showProjects && projects.length > 0 && (
            <div className="space-y-4 border-t border-[#39FF14]/30 pt-4">
              <h2 className="text-sm font-bold text-white">&gt; COMPILED_PROJECTS</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((proj, idx) => (
                  <div key={idx} className="border border-[#39FF14]/60 p-4 rounded bg-[#39FF14]/5 space-y-2">
                    <div className="text-white font-bold">{proj.title}</div>
                    {proj.technologies && <div className="text-[10px] text-yellow-400">STACK: [{proj.technologies}]</div>}
                    <div className="text-xs text-slate-300 leading-normal">{proj.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact block */}
          {showContactForm && (
            <div className="space-y-4 border-t border-[#39FF14]/30 pt-4">
              <h2 className="text-sm font-bold text-white">&gt; SEND_PING_SIGNAL</h2>
              {sentMessage ? (
                <div className="text-yellow-400 text-xs">PING RECEIVED. MESSAGE BUFFERED SUCCESSFULLY.</div>
              ) : (
                <form onSubmit={handleSubmitContact} className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="name_identifier"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="border border-[#39FF14] bg-black p-2 text-xs text-[#39FF14] outline-none rounded"
                    />
                    <input
                      type="email"
                      required
                      placeholder="email_address"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="border border-[#39FF14] bg-black p-2 text-xs text-[#39FF14] outline-none rounded"
                    />
                  </div>
                  <textarea
                    required
                    placeholder="message_payload"
                    rows={3}
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    className="w-full border border-[#39FF14] bg-black p-2 text-xs text-[#39FF14] outline-none rounded resize-none"
                  />
                  <button type="submit" className="border-2 border-[#39FF14] bg-[#39FF14]/10 hover:bg-[#39FF14]/30 py-2 px-6 text-xs text-[#39FF14] font-bold rounded cursor-pointer">
                    EXECUTE: SEND_OUTREACH
                  </button>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    );
  }

  // Render Theme 3: Executive Theme
  if (theme === 'executive') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans p-6 md:p-12 text-left selection:bg-slate-800 selection:text-white">
        <div className="max-w-5xl mx-auto bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Hero Banner header */}
          <div className="p-8 md:p-12 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6" style={accentBgStyle}>
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Executive Profile</span>
              <h1 className="text-3xl font-black tracking-tight">{profile.name}</h1>
              <p className="text-sm font-semibold">{profile.profession || 'Professional'}</p>
              {profile.tagline && <p className="text-xs text-white/80 italic font-serif">"{profile.tagline}"</p>}
            </div>
            {showSocials && (
              <div className="flex gap-2.5 flex-wrap">
                {profile.contact_email && <a href={`mailto:${profile.contact_email}`} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors" title="Email"><Mail className="h-4.5 w-4.5" /></a>}
                {profile.linkedin_url && <a href={profile.linkedin_url.startsWith('http') ? profile.linkedin_url : `https://${profile.linkedin_url}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"><Linkedin className="h-4.5 w-4.5" /></a>}
                {profile.github_url && <a href={profile.github_url.startsWith('http') ? profile.github_url : `https://${profile.github_url}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"><Github className="h-4.5 w-4.5" /></a>}
              </div>
            )}
          </div>

          <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Narrative Column */}
            <div className="md:col-span-8 space-y-8">
              <div className="space-y-3">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Executive Statement</h2>
                <p className="text-sm text-slate-600 leading-relaxed font-serif text-justify">{profile.bio || 'Narrative unconfigured.'}</p>
              </div>

              {/* Work history */}
              <div className="space-y-6">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Professional Experience</h2>
                <div className="space-y-6">
                  {experience.map((exp, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-start flex-col sm:flex-row">
                        <div>
                          <h3 className="text-xs font-extrabold text-slate-900">{exp.role}</h3>
                          <p className="text-[11px] text-slate-500 font-semibold">{exp.company}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold">{exp.duration}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Meta Column */}
            <div className="md:col-span-4 space-y-6 md:border-l md:border-slate-200 md:pl-8">
              <div className="space-y-3">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Target Objectives</h2>
                <p className="text-xs text-slate-600 italic">"{profile.goal}"</p>
              </div>

              {/* Skills */}
              <div className="space-y-2.5">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Key Expertise</h2>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s, idx) => (
                    <span key={idx} className="text-[10px] font-semibold py-1 px-2.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Location details */}
              <div className="space-y-2 text-xs text-slate-500 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4" style={accentStyle} /> {profile.contact_location || 'Remote'}</div>
                {profile.contact_phone && <div className="flex items-center gap-1.5"><Phone className="h-4 w-4" style={accentStyle} /> {profile.contact_phone}</div>}
              </div>
            </div>
          </div>

          {/* Contact and contact form */}
          {showContactForm && (
            <div className="p-8 md:p-12 border-t border-slate-100 bg-slate-50/50">
              <div className="max-w-2xl mx-auto space-y-4">
                <div className="text-center">
                  <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Send an Inquiry</h2>
                  <p className="text-[10px] text-slate-500 mt-0.5">Please provide your details below to schedule an interview or pitch opportunities.</p>
                </div>
                
                {sentMessage ? (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-600 text-xs rounded-theme text-center font-bold">
                    Message successfully transmitted. I will get back to you shortly.
                  </div>
                ) : (
                  <form onSubmit={handleSubmitContact} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="First & Last Name"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full p-2.5 rounded-theme border border-slate-200 bg-white focus:outline-none focus:border-slate-400 text-xs text-slate-800"
                      />
                      <input
                        type="email"
                        required
                        placeholder="professional_email@domain.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full p-2.5 rounded-theme border border-slate-200 bg-white focus:outline-none focus:border-slate-400 text-xs text-slate-800"
                      />
                    </div>
                    <textarea
                      required
                      placeholder="Compose your inquiry..."
                      rows={4}
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      className="w-full p-2.5 rounded-theme border border-slate-200 bg-white focus:outline-none focus:border-slate-400 text-xs text-slate-800 resize-none"
                    />
                    <button type="submit" className="py-2.5 px-6 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-theme text-xs shadow hover-lift transition-all" style={accentBgStyle}>
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  // Render Theme 4: Clean Glassmorphism
  if (theme === 'glass') {
    return (
      <div className="min-h-screen bg-[#070913] text-white font-sans p-4 md:p-8 flex flex-col justify-center items-center relative overflow-hidden pb-16">
        
        {/* Animated ambient background glow bubbles */}
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full filter blur-[100px] opacity-20 -z-10 animate-pulse" style={accentBgStyle}></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-indigo-600 filter blur-[120px] opacity-15 -z-10 animate-pulse"></div>

        <div className="max-w-3xl w-full bg-slate-900/40 border border-white/5 shadow-2xl rounded-[32px] p-6 md:p-10 backdrop-blur-xl -webkit-backdrop-filter:blur(24px) space-y-6 text-left">
          
          {/* Profile Header card */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 pb-6 border-b border-white/5">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center font-black text-white text-xl border border-white/10" style={{ boxShadow: `0 0 20px ${accentColor}30` }}>
              {profile.name?.slice(0, 2).toUpperCase() || 'PF'}
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-black text-white tracking-tight">{profile.name}</h1>
              <p className="text-xs font-bold uppercase tracking-widest" style={accentStyle}>{profile.profession || 'Professional'}</p>
              {profile.tagline && <p className="text-xs text-slate-300 italic">"{profile.tagline}"</p>}
              
              {showSocials && (
                <div className="flex gap-2.5 pt-2 justify-center sm:justify-start">
                  {profile.contact_email && <a href={`mailto:${profile.contact_email}`} className="text-slate-400 hover:text-white transition-colors" title="Email"><Mail className="h-4 w-4" /></a>}
                  {profile.linkedin_url && <a href={profile.linkedin_url.startsWith('http') ? profile.linkedin_url : `https://${profile.linkedin_url}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors"><Linkedin className="h-4 w-4" /></a>}
                  {profile.github_url && <a href={profile.github_url.startsWith('http') ? profile.github_url : `https://${profile.github_url}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors"><Github className="h-4 w-4" /></a>}
                </div>
              )}
            </div>
          </div>

          {/* Narrative statement */}
          <div className="space-y-2">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Overview Narrative</h2>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">{profile.bio}</p>
          </div>

          {/* Core Skills grid */}
          <div className="space-y-3">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Key Expertise</h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s, idx) => (
                <span key={idx} className="text-[10px] font-semibold py-1 px-3 rounded-full bg-white/5 border border-white/5 text-slate-200 hover:bg-white/10 transition-colors">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Experience list */}
          <div className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Professional History</h2>
            <div className="space-y-4">
              {experience.map((exp, idx) => (
                <div key={idx} className="p-4 bg-white/5 border border-white/5 rounded-theme space-y-1.5">
                  <div className="flex justify-between items-start flex-col sm:flex-row">
                    <h3 className="text-xs font-bold text-white">{exp.role} @ {exp.company}</h3>
                    <span className="text-[9px] text-slate-400 font-bold">{exp.duration}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-normal">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact form block */}
          {showContactForm && (
            <div className="space-y-4 pt-4 border-t border-white/5">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Send an Outreach Signal</h2>
              
              {sentMessage ? (
                <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-theme text-center font-bold flex items-center justify-center gap-1.5">
                  Message successfully sent!
                </div>
              ) : (
                <form onSubmit={handleSubmitContact} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full p-2.5 rounded-theme border border-white/5 bg-slate-950/40 focus:outline-none focus:border-white/20 text-xs text-white"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Your Email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full p-2.5 rounded-theme border border-white/5 bg-slate-950/40 focus:outline-none focus:border-white/20 text-xs text-white"
                    />
                  </div>
                  <textarea
                    required
                    placeholder="Describe your project, team or offer..."
                    rows={3}
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    className="w-full p-2.5 rounded-theme border border-white/5 bg-slate-950/40 focus:outline-none focus:border-white/20 text-xs text-white resize-none"
                  />
                  <button type="submit" className="w-full py-2.5 bg-blue-500 text-white font-bold rounded-theme text-xs shadow transition-all hover:brightness-110 flex items-center justify-center gap-1.5" style={accentBgStyle}>
                    <Send className="h-3.5 w-3.5" />
                    Transmit Signal
                  </button>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    );
  }

  return null;
}

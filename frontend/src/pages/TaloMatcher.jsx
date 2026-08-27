import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, RefreshCw, FileText, Send, Sparkles } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';

const demoScenarios = {
  'Jay': {
    title: 'Senior Software Engineer, Google Cloud',
    jd: 'We are looking for a Senior Software Engineer for Google Cloud Systems. Required: C++, Cloud Scale services, multithreading, system optimization, distributed key-value databases, and performance tuning.',
    scoreData: {
      score: 88,
      matchedSkills: ['C++', 'System Optimization', 'Multithreading', 'Performance Analysis'],
      missingSkills: ['Distributed Systems', 'Cloud Scale Architecture', 'Go/Python'],
      feedback: 'Jay has exceptional C++ game engine performance engineering capabilities at Ubisoft. High alignment for systems engineering, but should explicitly mention Google Cloud, Go, and distributed key-value storage structures.'
    }
  },
  'Priya': {
    title: 'Senior Product Designer, Netflix',
    jd: 'Netflix is seeking a Senior Product Designer to craft immersive streaming media playback interfaces. Required: Figma design systems, user research, mobile UI layout design, high-fidelity prototypes, A/B testing user testing.',
    scoreData: {
      score: 85,
      matchedSkills: ['Figma Prototyping', 'User Research', 'Mobile UI Layout', 'Design Systems'],
      missingSkills: ['Media Playback Interfaces', 'A/B Testing Integration', 'Interaction Design'],
      feedback: 'Priya has great layout design capabilities from Zomato food delivery apps. To fit Netflix streaming hubs, highlight entertainment industry trends, streaming video players design prototypes, and data-driven UX metrics.'
    }
  },
  'Rohan': {
    title: 'Product Manager, Meta Quick Commerce',
    jd: 'Seeking a Product Manager to scale commerce tools at Meta. Required: Product metrics optimization, SQL analytics, cross-functional execution, quick commerce supply chain flows, scale frameworks.',
    scoreData: {
      score: 91,
      matchedSkills: ['Product Metrics', 'SQL Analytics', 'Cross-functional Execution', 'Quick Commerce'],
      missingSkills: ['Meta Ad Tech', 'Global Commerce Infrastructure', 'Internationalization'],
      feedback: 'Rohan matches Swiggy quick commerce scaling metrics extremely well for Meta PM. Add details about platform infrastructure and API metrics optimizations.'
    }
  },
  'Tarun': {
    title: 'Vice President Operations, JP Morgan',
    jd: 'JP Morgan is hiring an Operations VP. Required: Wealth management operations, branch audits, risk assessments, financial auditing, regulatory compliance, executive leadership.',
    scoreData: {
      score: 87,
      matchedSkills: ['Wealth Management', 'Audit Operations', 'Risk Assessments', 'Executive Leadership'],
      missingSkills: ['Investment Banking Compliance', 'Global Operations Frameworks'],
      feedback: 'Tarun has solid retail banking vice-manager operations experience from HDFC. For JP Morgan Chase global VP role, highlight international compliance guidelines and investment portfolio metrics.'
    }
  },
  'Amit': {
    title: 'AI Engineer, OpenAI Research',
    jd: 'OpenAI is seeking an AI Engineer to optimize LLM training and API scaling. Required: Python, PyTorch, Natural Language Processing, Transformer architectures, API performance tuning, LLM fine-tuning.',
    scoreData: {
      score: 83,
      matchedSkills: ['Python', 'PyTorch', 'Natural Language Processing', 'Machine Learning Models'],
      missingSkills: ['Transformer Architectures', 'LLM Fine-tuning', 'API Scaling'],
      feedback: 'Amit has rich traditional machine learning experience at TCS. For OpenAI, explicitly highlight transformer architecture designs, LLM inference optimizations, and PyTorch multi-node scaling.'
    }
  }
};

export default function TaloMatcher() {
  const { fetchProfile, updateProfile } = useProfile();
  const [activeProfileId, setActiveProfileId] = useState(localStorage.getItem('pf_active_profile_id') || '');
  const [profile, setProfile] = useState(null);
  
  const [jd, setJd] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [scoreData, setScoreData] = useState(null);
  
  const [rewritingIndex, setRewritingIndex] = useState(null);
  const [rewrittenBullets, setRewrittenBullets] = useState({}); // maps bullet key to { rewritten, reason }

  // Check if profile belongs to a demo character
  const getDemoKey = () => {
    if (!profile?.name) return null;
    const name = profile.name;
    if (name.includes('Jay')) return 'Jay';
    if (name.includes('Priya')) return 'Priya';
    if (name.includes('Rohan')) return 'Rohan';
    if (name.includes('Tarun')) return 'Tarun';
    if (name.includes('Amit')) return 'Amit';
    return null;
  };

  const handleLoadDemo = () => {
    const key = getDemoKey();
    if (!key) return;
    const scenario = demoScenarios[key];
    setRoleTitle(scenario.title);
    setJd(scenario.jd);
    setScoreData(scenario.scoreData);
  };
  
  const loadActiveProfile = async (id) => {
    if (!id) return;
    try {
      const data = await fetchProfile(id);
      setProfile(data);
      if (data.profession && !roleTitle) {
        setRoleTitle(data.profession);
      }
    } catch (err) {
      console.error('Error loading active profile:', err);
    }
  };

  useEffect(() => {
    loadActiveProfile(activeProfileId);
    
    const handleProfileChanged = () => {
      const newId = localStorage.getItem('pf_active_profile_id') || '';
      setActiveProfileId(newId);
      loadActiveProfile(newId);
      setScoreData(null);
      setJd('');
    };
    window.addEventListener('pfActiveProfileChanged', handleProfileChanged);
    return () => window.removeEventListener('pfActiveProfileChanged', handleProfileChanged);
  }, [activeProfileId]);

  const handleCalculateMatch = async () => {
    if (!profile) {
      alert('Please select or create an active profile first.');
      return;
    }
    if (!jd.trim()) {
      alert('Please paste a target Job Description (JD) to compute score.');
      return;
    }
    
    setLoading(true);
    setScoreData(null);
    setRewrittenBullets({});
    
    try {
      // Include custom key in headers if it exists in localStorage
      const customKey = localStorage.getItem('pf_custom_groq_key') || '';
      const token = localStorage.getItem('pf_token');
      const res = await fetch('/api/analyze/ats-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-custom-groq-key': customKey
        },
        body: JSON.stringify({ profile, jd })
      });
      
      if (!res.ok) throw new Error('ATS scoring failed');
      const data = await res.json();
      setScoreData(data);
    } catch (err) {
      console.error(err);
      alert('Failed to analyze ATS Match: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRewriteBullet = async (index, type, originalText) => {
    if (!jd.trim()) {
      alert('Please provide the Job Description to align rewritten bullets.');
      return;
    }
    setRewritingIndex(`${type}-${index}`);
    try {
      const customKey = localStorage.getItem('pf_custom_groq_key') || '';
      const token = localStorage.getItem('pf_token');
      const res = await fetch('/api/analyze/ats-rewrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-custom-groq-key': customKey
        },
        body: JSON.stringify({ bullet: originalText, jd })
      });
      
      if (!res.ok) throw new Error('Bullet rewrite failed');
      const data = await res.json();
      setRewrittenBullets(prev => ({
        ...prev,
        [`${type}-${index}`]: data
      }));
    } catch (err) {
      console.error(err);
      alert('Failed to optimize bullet: ' + err.message);
    } finally {
      setRewritingIndex(null);
    }
  };

  const handleApplyRewrite = async (index, type) => {
    const optimized = rewrittenBullets[`${type}-${index}`];
    if (!optimized || !profile) return;
    
    const updated = { ...profile };
    
    // Parse helper
    const parseList = (val) => {
      if (Array.isArray(val)) return val;
      try { return JSON.parse(val || '[]'); } catch(e) { return []; }
    };

    if (type === 'experience') {
      const list = parseList(updated.experience);
      list[index].description = optimized.rewritten;
      updated.experience = list;
    } else if (type === 'projects') {
      const list = parseList(updated.projects);
      list[index].description = optimized.rewritten;
      updated.projects = list;
    }
    
    try {
      const saved = await updateProfile(profile.id, updated);
      setProfile(saved);
      // Remove optimized suggestion from state since applied
      const copy = { ...rewrittenBullets };
      delete copy[`${type}-${index}`];
      setRewrittenBullets(copy);
      alert('Successfully applied and saved ATS-optimized description to your profile!');
    } catch (err) {
      console.error(err);
      alert('Failed to apply rewrite: ' + err.message);
    }
  };

  const demoKey = getDemoKey();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-themeText flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-themePrimary" />
          Talo AI — ATS Keyword Matcher
        </h1>
        <p className="text-xs text-themeTextSecondary mt-1">
          Scan your active resume profile against target job descriptions. Clean skill gaps, audit keyword density, and rewrite project achievements on the fly.
        </p>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: JD Paste Form */}
        <div className="lg:col-span-5 bg-themeCard border border-themeBorder rounded-[24px] p-6 space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-themeText flex items-center gap-2 border-b border-themeBorder pb-2">
            <FileText className="h-4.5 w-4.5 text-themePrimary" />
            Target Role Details
          </h2>

          {demoKey && (
            <button
              onClick={handleLoadDemo}
              className="w-full py-2.5 px-4 rounded-theme border border-amber-500/30 bg-amber-500/10 text-amber-500 text-xxs font-black tracking-wider uppercase hover:bg-amber-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Load {demoKey} Demo Scenario & Gap Analysis
            </button>
          )}

          <div className="space-y-1">
            <label className="block text-xxs font-bold text-themeTextSecondary uppercase pl-0.5">Target Job Title</label>
            <input
              type="text"
              placeholder="e.g. Senior Full Stack Engineer"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              className="w-full p-2.5 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-xs text-themeText"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xxs font-bold text-themeTextSecondary uppercase pl-0.5">Target Job Description (JD)</label>
            <textarea
              placeholder="Paste the full job posting requirements, tech stack details, and responsibilities here..."
              rows={12}
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              className="w-full p-3 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-xs text-themeText font-sans leading-relaxed resize-none"
            />
          </div>

          <button
            onClick={handleCalculateMatch}
            disabled={loading || !profile}
            className="w-full py-3 bg-themePrimary hover:bg-themePrimaryDark text-white text-xs font-black rounded-theme shadow-md hover-lift transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Scanning Profile Fit...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Audit Profile & Score
              </>
            )}
          </button>
        </div>

        {/* Right Side: Score Analysis and accordion list of rewrites */}
        <div className="lg:col-span-7 space-y-6">
          {!scoreData ? (
            <div className="bg-themeCard border border-themeBorder rounded-[24px] p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-xl min-h-[400px]">
              <div className="p-4 bg-themePrimary/5 text-themePrimary rounded-full">
                <Sparkles className="h-10 w-10 animate-pulse" />
              </div>
              <h3 className="text-sm font-bold text-themeText">Awaiting Job Description Analysis</h3>
              <p className="text-xs text-themeTextSecondary max-w-sm leading-relaxed">
                Paste the requirements of the job posting on the left, and click "Audit Profile & Score" to view your compatibility rating, matching skills, and inline resume optimization recommendations.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Top Summary Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-12 bg-themeCard border border-themeBorder rounded-[24px] p-6 gap-6 items-center shadow-xl">
                
                {/* Circular Score Gauge */}
                <div className="md:col-span-4 flex flex-col items-center justify-center">
                  <div className="relative flex items-center justify-center w-28 h-28">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="56"
                        cy="56"
                        r="48"
                        className="stroke-themeBorder fill-transparent"
                        strokeWidth="8"
                      />
                      <circle
                        cx="56"
                        cy="56"
                        r="48"
                        className={`fill-transparent transition-all duration-1000 ${
                          scoreData.score >= 80 ? 'stroke-green-500' : scoreData.score >= 60 ? 'stroke-yellow-500' : 'stroke-red-500'
                        }`}
                        strokeWidth="8"
                        strokeDasharray={301.6}
                        strokeDashoffset={301.6 - (301.6 * scoreData.score) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-2xl font-black text-themeText">{scoreData.score}%</span>
                      <p className="text-[9px] text-themeTextSecondary font-bold uppercase tracking-wider">ATS Score</p>
                    </div>
                  </div>
                </div>

                {/* Score Summary Metrics */}
                <div className="md:col-span-8 space-y-2 text-left">
                  <h3 className="text-base font-bold text-themeText flex items-center gap-1.5">
                    {scoreData.score >= 75 ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    )}
                    {scoreData.score >= 85
                      ? 'Excellent Alignment!'
                      : scoreData.score >= 70
                      ? 'Good Baseline Fit'
                      : 'High Gap Identified'}
                  </h3>
                  <p className="text-xs text-themeTextSecondary leading-relaxed">
                    {scoreData.feedback}
                  </p>
                </div>
              </div>

              {/* Keywords Gap Panel */}
              <div className="bg-themeCard border border-themeBorder rounded-[24px] p-6 space-y-4 shadow-xl">
                <h3 className="text-xs font-black text-themeTextSecondary uppercase tracking-widest pl-0.5">Keyword Match Audit</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Matched Keywords */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-green-500 flex items-center gap-1.5">
                      ✓ Matched Keywords ({scoreData.matchedSkills?.length || 0})
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {scoreData.matchedSkills?.map((skill, idx) => (
                        <span key={idx} className="text-[10px] font-semibold py-1 px-2.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                          {skill}
                        </span>
                      ))}
                      {(!scoreData.matchedSkills || scoreData.matchedSkills.length === 0) && (
                        <span className="text-xxs text-themeTextSecondary">No semantic keyword matches discovered yet.</span>
                      )}
                    </div>
                  </div>

                  {/* Missing Keywords */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                      ✕ Missing Keywords ({scoreData.missingSkills?.length || 0})
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {scoreData.missingSkills?.map((skill, idx) => (
                        <span key={idx} className="text-[10px] font-semibold py-1 px-2.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                          {skill}
                        </span>
                      ))}
                      {(!scoreData.missingSkills || scoreData.missingSkills.length === 0) && (
                        <span className="text-xxs text-themeTextSecondary">Zero missing key concepts! Great work.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Accordion List for Bullet Optimization */}
              <div className="bg-themeCard border border-themeBorder rounded-[24px] p-6 space-y-4 shadow-xl">
                <div>
                  <h3 className="text-sm font-bold text-themeText">In-Place Bullet Optimizers</h3>
                  <p className="text-xxs text-themeTextSecondary mt-0.5">
                    Rewrite your experience bullet points and project summaries to match the job requirements directly.
                  </p>
                </div>

                <div className="space-y-3.5 max-h-[450px] overflow-y-auto pr-1">
                  {/* Experience list items */}
                  {profile.experience && (Array.isArray(profile.experience) ? profile.experience : JSON.parse(profile.experience || '[]')).map((exp, idx) => (
                    <div key={`exp-${idx}`} className="border border-themeBorder bg-themeBg/40 p-4 rounded-theme space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-xxs font-black text-themePrimary uppercase tracking-wider">Experience Bullet</span>
                          <h4 className="text-xs font-bold text-themeText leading-tight mt-0.5">{exp.role} @ {exp.company}</h4>
                        </div>
                        <button
                          onClick={() => handleRewriteBullet(idx, 'experience', exp.description)}
                          disabled={rewritingIndex === `experience-${idx}`}
                          className="px-2.5 py-1.5 rounded-theme text-[10px] font-bold border border-themePrimary text-themePrimary hover:bg-themePrimary hover:text-white transition-all duration-300 disabled:opacity-50 cursor-pointer"
                        >
                          {rewritingIndex === `experience-${idx}` ? 'Rewriting...' : 'Optimize Bullet'}
                        </button>
                      </div>

                      <p className="text-xs text-themeTextSecondary italic bg-black/10 p-2.5 rounded-theme">
                        "{exp.description}"
                      </p>

                      {rewrittenBullets[`experience-${idx}`] && (
                        <div className="mt-2 p-3.5 bg-green-500/5 border border-green-500/20 rounded-theme space-y-2 animate-in fade-in slide-in-from-top-1">
                          <span className="text-[10px] font-bold text-green-500">✨ Suggested Optimize Rewrite:</span>
                          <p className="text-xs text-themeText leading-relaxed font-semibold">
                            "{rewrittenBullets[`experience-${idx}`].rewritten}"
                          </p>
                          <div className="text-[10px] text-themeTextSecondary italic">
                            Reason: {rewrittenBullets[`experience-${idx}`].reason}
                          </div>
                          <button
                            onClick={() => handleApplyRewrite(idx, 'experience')}
                            className="py-1 px-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-theme text-[10px] shadow transition-colors cursor-pointer"
                          >
                            Apply Optimization
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Projects list items */}
                  {profile.projects && (Array.isArray(profile.projects) ? profile.projects : JSON.parse(profile.projects || '[]')).map((proj, idx) => (
                    <div key={`proj-${idx}`} className="border border-themeBorder bg-themeBg/40 p-4 rounded-theme space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-xxs font-black text-themePrimary uppercase tracking-wider">Project Description</span>
                          <h4 className="text-xs font-bold text-themeText leading-tight mt-0.5">{proj.title}</h4>
                        </div>
                        <button
                          onClick={() => handleRewriteBullet(idx, 'projects', proj.description)}
                          disabled={rewritingIndex === `projects-${idx}`}
                          className="px-2.5 py-1.5 rounded-theme text-[10px] font-bold border border-themePrimary text-themePrimary hover:bg-themePrimary hover:text-white transition-all duration-300 disabled:opacity-50 cursor-pointer"
                        >
                          {rewritingIndex === `projects-${idx}` ? 'Rewriting...' : 'Optimize Bullet'}
                        </button>
                      </div>

                      <p className="text-xs text-themeTextSecondary italic bg-black/10 p-2.5 rounded-theme">
                        "{proj.description}"
                      </p>

                      {rewrittenBullets[`projects-${idx}`] && (
                        <div className="mt-2 p-3.5 bg-green-500/5 border border-green-500/20 rounded-theme space-y-2 animate-in fade-in slide-in-from-top-1">
                          <span className="text-[10px] font-bold text-green-500">✨ Suggested Optimize Rewrite:</span>
                          <p className="text-xs text-themeText leading-relaxed font-semibold">
                            "{rewrittenBullets[`projects-${idx}`].rewritten}"
                          </p>
                          <div className="text-[10px] text-themeTextSecondary italic">
                            Reason: {rewrittenBullets[`projects-${idx}`].reason}
                          </div>
                          <button
                            onClick={() => handleApplyRewrite(idx, 'projects')}
                            className="py-1 px-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-theme text-[10px] shadow transition-colors cursor-pointer"
                          >
                            Apply Optimization
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

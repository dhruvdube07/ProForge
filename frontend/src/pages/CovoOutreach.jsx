import React, { useState, useEffect } from 'react';
import { Sparkles, FileText, Linkedin, MessageSquare, Clipboard, Download, Check, AlertCircle } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';

const demoOutreachData = {
  'Jay': {
    companyName: 'Google',
    jobTitle: 'Senior Software Engineer, Google Cloud',
    assets: {
      coverLetter: `Dear Google Cloud Hiring Team,

I am writing to express my strong interest in the Senior Software Engineer position for Google Cloud Systems. With over 3 years of game physics and system performance optimization experience at Ubisoft, I have honed low-level C++ capabilities and scaled engine systems that process millions of frames per second.

At Ubisoft, I scaled game loops and managed memory allocations that improved hardware efficiency by 24%. Transitioning this level of performance engineering to Google Cloud's distributed systems will allow me to build low-latency cloud infrastructure. I look forward to contributing to your scaling objectives.

Sincerely,
Jay Dhave`,
      linkedinInMail: `Hi Team, I am a Systems Engineer at Ubisoft specializing in C++ and performance tuning. I notice Google Cloud is hiring systems developers. Having optimized engine physics loop frequencies by 24%, I would love to connect to discuss scaling distributed databases at Google. Thanks, Jay.`,
      elevatorPitch: `I am a performance-oriented Systems Engineer with 3 years of experience building scalable C++ game loops at Ubisoft. I specialize in multithreaded systems, memory layouts optimization, and latency reductions. I am looking to apply low-level performance metrics to distributed systems at Google Cloud.`
    }
  },
  'Priya': {
    companyName: 'Netflix',
    jobTitle: 'Senior Product Designer',
    assets: {
      coverLetter: `Dear Netflix Design Recruitment Team,

I am thrilled to apply for the Senior Product Designer role at Netflix. As a Product Designer with 4 years of experience building mobile UI architectures and comprehensive design systems at Zomato, I specialize in crafting consumer-facing apps that are both simple and high-performing.

At Zomato, I led the redesign of our mobile checkout flow which drove a 12% increase in conversion rates. By combining user research, interactive Figma prototyping, and design tokens scaling, I create interactive flows that feel alive. I am eager to apply this user-centric design approach to Netflix's media streaming playback systems.

Sincerely,
Priya Sharma`,
      linkedinInMail: `Hi Netflix Design Team, I am a Product Designer at Zomato. I lead mobile checkout UI flow redesigns (driving +12% conversions) and design systems. I would love to connect to learn more about how Netflix approaches playback interactions prototyping. Thanks! Priya`,
      elevatorPitch: `I am a Product Designer with 4 years of experience building mobile design systems at Zomato. I combine Figma prototyping, structured user research, and UX metrics analysis to scale products. I am looking to join Netflix to craft user-centric entertainment streaming interfaces.`
    }
  },
  'Rohan': {
    companyName: 'Meta',
    jobTitle: 'Product Manager, Quick Commerce',
    assets: {
      coverLetter: `Dear Meta Commerce Recruitment Team,

I am writing to apply for the Product Manager position within the Quick Commerce division at Meta. Having spent my career leading product scaling and cross-functional teams at Swiggy, I specialize in quick-commerce supply networks and growth analytics.

At Swiggy, I led the product roadmap for scaling quick delivery delivery logic, optimizing delivery route algorithms to save 8% in delivery time. I am a metric-focused product leader who leverages SQL analytics and cross-functional partnerships to build product structures. I look forward to scaling commerce tools at Meta.

Sincerely,
Rohan Mehta`,
      linkedinInMail: `Hi Meta Team, I am a Product Manager at Swiggy, scaling quick-commerce delivery frameworks (saving 8% delivery route times). I see Meta is hiring product leads. I would love to connect and discuss commerce scaling. Best, Rohan`,
      elevatorPitch: `I am a metrics-driven Product Manager with experience scaling Swiggy's quick-commerce operations. I specialize in SQL analytics, delivery optimization roadmaps, and cross-functional execution. I am looking to join Meta to drive commerce systems growth.`
    }
  },
  'Tarun': {
    companyName: 'JP Morgan Chase',
    jobTitle: 'Vice President Operations',
    assets: {
      coverLetter: `Dear JP Morgan Operations Selection Panel,

I am writing to formally apply for the Vice President of Operations position. Currently serving as a Branch Manager at HDFC Bank, I have built a track record of driving operational efficiency, branch audits compliance, and wealth management portfolios growth.

In my current role, I manage a team of 15 advisors and oversee financial audits that consistently achieve 100% regulatory compliance ratings. My experience in risk assessments and executive leadership aligns with the standard JP Morgan maintains globally. I look forward to leading JP Morgan operations.

Sincerely,
Tarun Vaidya`,
      linkedinInMail: `Dear JP Morgan Team, I am an HDFC Branch Manager overseeing branch audit operations and wealth portfolios. I see JP Morgan is hiring an Operations VP. I would love to connect and discuss operational risk leadership. Kind regards, Tarun.`,
      elevatorPitch: `I am an Operations Lead with retail banking management experience at HDFC. I specialize in financial auditing, wealth management advisory, and regulatory risk compliance. I am seeking to join JP Morgan Chase to drive operational excellence.`
    }
  },
  'Amit': {
    companyName: 'OpenAI',
    jobTitle: 'AI Engineer, API Scaling',
    assets: {
      coverLetter: `Dear OpenAI Engineering Team,

I am writing to apply for the AI Engineer position. With 5 years of experience leading machine learning model pipelines at TCS and writing NLP algorithms, I am eager to apply my skills to LLM scaling at OpenAI.

At TCS, I led the development of NLP semantic classification systems that reduced customer inquiry response times by 30%. I am highly proficient in PyTorch, Python, and scalable transformers tuning. I am excited to apply my machine learning scaling expertise to OpenAI's API frameworks.

Sincerely,
Amit Mishra`,
      linkedinInMail: `Hi OpenAI Team, I am a Lead Data Scientist at TCS. I build PyTorch NLP models (reducing response times by 30%). I would love to connect and discuss scaling transformer inference pipelines at OpenAI. Cheers, Amit.`,
      elevatorPitch: `I am an AI Engineer with 5 years of experience building PyTorch machine learning models at TCS. I specialize in NLP algorithms, transformer fine-tuning, and model pipeline scaling. I am looking to join OpenAI to optimize LLM performance.`
    }
  }
};

export default function CovoOutreach() {
  const { fetchProfile, generateCoverLetter } = useProfile();
  
  const [activeProfileId, setActiveProfileId] = useState(localStorage.getItem('pf_active_profile_id') || '');
  const [profile, setProfile] = useState(null);
  
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jd, setJd] = useState('');
  const [tone, setTone] = useState('Professional');
  
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState(null);
  const [activeTab, setActiveTab] = useState('letter'); // 'letter', 'inmail', 'pitch'
  
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

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
    const demo = demoOutreachData[key];
    setCompanyName(demo.companyName);
    setJobTitle(demo.jobTitle);
    setAssets(demo.assets);
  };

  const loadActiveProfile = async (id) => {
    if (!id) return;
    try {
      const data = await fetchProfile(id);
      setProfile(data);
      if (data.profession && !jobTitle) {
        setJobTitle(data.profession);
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
      setAssets(null);
      setCompanyName('');
    };
    window.addEventListener('pfActiveProfileChanged', handleProfileChanged);
    return () => window.removeEventListener('pfActiveProfileChanged', handleProfileChanged);
  }, [activeProfileId]);

  const handleGenerateOutreach = async () => {
    if (!profile) {
      alert('Please select or create an active profile first.');
      return;
    }
    if (!companyName.trim()) {
      alert('Please specify the Target Company.');
      return;
    }
    if (!jobTitle.trim()) {
      alert('Please specify the Job Title.');
      return;
    }
    
    setLoading(true);
    setAssets(null);
    setCopied(false);
    
    try {
      const customKey = localStorage.getItem('pf_custom_groq_key') || '';
      const token = localStorage.getItem('pf_token');
      const res = await fetch('/api/generate/outreach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-custom-groq-key': customKey
        },
        body: JSON.stringify({ profile, companyName, jobTitle, jd, tone })
      });
      
      if (!res.ok) throw new Error('Outreach generation failed');
      const data = await res.json();
      setAssets(data);
    } catch (err) {
      console.error(err);
      alert('Failed to generate materials: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = async () => {
    if (!assets || !assets.coverLetter) return;
    setDownloading(true);
    try {
      await generateCoverLetter(profile, companyName, jobTitle, assets.coverLetter);
    } catch (err) {
      console.error('PDF download error:', err);
      alert('Failed to download PDF: ' + err.message);
    } finally {
      setDownloading(false);
    }
  };

  const demoKey = getDemoKey();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-themeText flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-themePrimary" />
          Covo AI — Cold Outreach Studio
        </h1>
        <p className="text-xs text-themeTextSecondary mt-1">
          Draft hyper-personalized cover letters, custom LinkedIn recruiter pitches, and elevator hooks tailored to any job listing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Setup Panel */}
        <div className="lg:col-span-4 bg-themeCard border border-themeBorder rounded-[24px] p-6 space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-themeText flex items-center gap-2 border-b border-themeBorder pb-2">
            <MessageSquare className="h-4.5 w-4.5 text-themePrimary" />
            Outreach Parameters
          </h2>

          {demoKey && (
            <button
              onClick={handleLoadDemo}
              className="w-full py-2.5 px-4 rounded-theme border border-amber-500/30 bg-amber-500/10 text-amber-500 text-xxs font-black tracking-wider uppercase hover:bg-amber-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Load {demoKey} Demo Cold Outreach
            </button>
          )}

          <div className="space-y-1">
            <label className="block text-xxs font-bold text-themeTextSecondary uppercase pl-0.5">Target Company</label>
            <input
              type="text"
              placeholder="e.g. Google"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full p-2.5 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-xs text-themeText"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xxs font-bold text-themeTextSecondary uppercase pl-0.5">Job Title</label>
            <input
              type="text"
              placeholder="e.g. Frontend developer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full p-2.5 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-xs text-themeText"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xxs font-bold text-themeTextSecondary uppercase pl-0.5">Tone of Voice</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full p-2.5 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-xs text-themeText"
            >
              <option value="Professional">🤝 Professional & Balanced</option>
              <option value="Confident & Bold">🔥 Confident & Bold</option>
              <option value="Technical">⚙️ Technical & Detail-Oriented</option>
              <option value="Minimalist">◽ Minimalist & Direct</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xxs font-bold text-themeTextSecondary uppercase pl-0.5">Job Description Context (Optional)</label>
            <textarea
              placeholder="Paste specific job requirements here to tailor the letter context..."
              rows={6}
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              className="w-full p-3 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-xs text-themeText leading-relaxed resize-none"
            />
          </div>

          <button
            onClick={handleGenerateOutreach}
            disabled={loading || !profile}
            className="w-full py-3 bg-themePrimary hover:bg-themePrimaryDark text-white text-xs font-black rounded-theme shadow-md hover-lift transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Generating Outreach...' : 'Draft Outreach Assets'}
          </button>
        </div>

        {/* Right Side: Tabbed Output Canvas */}
        <div className="lg:col-span-8 space-y-4">
          {!assets ? (
            <div className="bg-themeCard border border-themeBorder rounded-[24px] p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-xl min-h-[450px]">
              <div className="p-4 bg-themePrimary/5 text-themePrimary rounded-full">
                <FileText className="h-10 w-10 animate-pulse" />
              </div>
              <h3 className="text-sm font-bold text-themeText">Outreach Assets Canvas</h3>
              <p className="text-xs text-themeTextSecondary max-w-sm leading-relaxed">
                Provide the company details, target role title, and optional job description on the left. Proforge AI will compose a full-length cover letter, a short LinkedIn message, and an elevator pitch automatically.
              </p>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-300">
              
              {/* Tab Selector */}
              <div className="flex bg-themeBg border border-themeBorder p-1 rounded-theme">
                <button
                  onClick={() => setActiveTab('letter')}
                  className={`flex-1 py-2 text-xs font-bold rounded-theme transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'letter'
                      ? 'bg-themeCard text-themePrimary shadow-sm'
                      : 'text-themeTextSecondary hover:text-themeText'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Cover Letter
                </button>
                <button
                  onClick={() => setActiveTab('inmail')}
                  className={`flex-1 py-2 text-xs font-bold rounded-theme transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'inmail'
                      ? 'bg-themeCard text-themePrimary shadow-sm'
                      : 'text-themeTextSecondary hover:text-themeText'
                  }`}
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn InMail
                </button>
                <button
                  onClick={() => setActiveTab('pitch')}
                  className={`flex-1 py-2 text-xs font-bold rounded-theme transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'pitch'
                      ? 'bg-themeCard text-themePrimary shadow-sm'
                      : 'text-themeTextSecondary hover:text-themeText'
                  }`}
                >
                  <MessageSquare className="h-4 w-4" />
                  Elevator Pitch
                </button>
              </div>

              {/* Asset Container */}
              <div className="bg-themeCard border border-themeBorder rounded-[24px] p-6 shadow-xl space-y-4">
                
                {/* Actions Toolbar */}
                <div className="flex justify-between items-center border-b border-themeBorder pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-themePrimary uppercase tracking-widest">
                      {activeTab === 'letter' ? 'Full Document' : activeTab === 'inmail' ? 'LinkedIn Pitch' : 'Short elevator pitch'}
                    </span>
                    <h3 className="text-xs text-themeTextSecondary mt-0.5">
                      {activeTab === 'letter' ? 'Tailored Cover Letter' : activeTab === 'inmail' ? 'Recruiter Direct Message' : '3-Sentence Elevator Pitch'}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(
                        activeTab === 'letter' ? assets.coverLetter : activeTab === 'inmail' ? assets.linkedinInMail : assets.elevatorPitch
                      )}
                      className="p-2 rounded-theme hover:bg-themeBg text-themeTextSecondary hover:text-themePrimary transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                      title="Copy to Clipboard"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-green-500">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Clipboard className="h-4 w-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    
                    {activeTab === 'letter' && (
                      <button
                        onClick={handleDownloadPdf}
                        disabled={downloading}
                        className="p-2 rounded-theme hover:bg-themeBg text-themeTextSecondary hover:text-themePrimary transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer disabled:opacity-50"
                        title="Download Cover Letter as PDF"
                      >
                        <Download className="h-4 w-4" />
                        <span>{downloading ? 'Downloading...' : 'Export PDF'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Content Render Canvas */}
                <div className="p-6 bg-themeBg/40 border border-themeBorder rounded-[20px] max-h-[500px] overflow-y-auto font-sans leading-relaxed text-xs text-themeText whitespace-pre-wrap text-left shadow-inner">
                  {activeTab === 'letter' && assets.coverLetter}
                  {activeTab === 'inmail' && (
                    <div className="space-y-4">
                      <div>{assets.linkedinInMail}</div>
                      <div className="flex items-center gap-1.5 text-[10px] text-themeTextSecondary bg-themePrimary/5 p-2 rounded-theme border border-themePrimary/15 w-fit">
                        <AlertCircle className="h-3.5 w-3.5 text-themePrimary" />
                        Word count optimized to stay under recruiter character limits.
                      </div>
                    </div>
                  )}
                  {activeTab === 'pitch' && assets.elevatorPitch}
                </div>

              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

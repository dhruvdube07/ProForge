import React, { useState, useEffect } from 'react';
import { Sparkles, Linkedin, Clipboard, Check, RefreshCw, Send, Globe, ThumbsUp, MessageSquare, Share2 } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';

const demoPostData = {
  'Jay': {
    milestoneType: 'project',
    milestoneTitle: 'Physics-Based Game Engine Loop',
    milestoneDesc: 'Built a multithreaded C++ engine loop that optimized physics updates by 24%.',
    postData: {
      hooks: [
        "C++ isn't slow. Your memory layouts are.",
        "How we shaved 24% off Ubisoft's game engine physics processing latency:",
        "From game physics to cloud servers: Why I am transitioning to Google Cloud."
      ],
      postText: `I recently optimized our C++ physics simulation loop. The results? A 24% reduction in overall hardware latency and zero framerate drops.

Here is the exact architectural approach I took:
1. Swapped out dynamic pointer arrays for contiguous memory arenas to eliminate cache misses.
2. Parallelized collision detection using a lock-free work-stealing job queue.
3. Aligned data structures to standard cache-line boundaries.

Learnings:
• Cache locality beats raw algorithm optimization.
• Threads are expensive; work-stealing queues are cheap.
• Profilers tell the truth, developers guess.`,
      tags: ['#cpp', '#gameengineering', '#performance', '#softwaredeveloper']
    }
  },
  'Priya': {
    milestoneType: 'project',
    milestoneTitle: 'Checkout Conversion Optimization Redesign',
    milestoneDesc: 'Led Zomato mobile checkout redesign that increased order conversion metrics by 12%.',
    postData: {
      hooks: [
        "We increased checkout conversions by 12% at Zomato. Here is the Figmas.",
        "Most checkout screens have too many choices. Here is how we simplified ours:",
        "Product Design isn't about pretty colors. It's about conversion metrics."
      ],
      postText: `We redesigned our food delivery order checkout page. The result? A 12% bump in conversion rates and a significant drop in cart abandonment.

Here is what we changed in the design system:
1. Removed all secondary links and navigation bars from the final pay screen to isolate the purchase action.
2. Implemented micro-interactions that animate payment method confirmation.
3. Rewrote copy to clearly state delivery fees and timing.

Lessons:
• Less choice = more action.
• Feedback animations reduce anxiety.
• Clear copy beats fancy layouts.`,
      tags: ['#uiux', '#productdesign', '#conversions', '#figma']
    }
  },
  'Rohan': {
    milestoneType: 'project',
    milestoneTitle: 'Swiggy Quick Commerce Routing Algorithms',
    milestoneDesc: 'Managed Swiggy commerce route delivery integrations that reduced transit times by 8%.',
    postData: {
      hooks: [
        "How we saved Swiggy delivery partners 8% in transit times:",
        "Product management isn't about features list. It's about supply chains.",
        "Metrics that matter: How we optimized quick commerce delivery loops."
      ],
      postText: `We launched our quick commerce delivery route optimization. The results? An 8% reduction in delivery partner transit times.

Here is the PM approach:
1. Analyzed route bottlenecks using SQL analytics.
2. Partnered with engineering to implement dynamic grid clustering.
3. Beta tested in 3 metro hubs before global rollout.

Key PM Lessons:
• SQL analytics is a superpower.
• Test in small batches to reduce risk.
• Operational loops impact product code directly.`,
      tags: ['#productmanagement', '#analytics', '#quickcommerce', '#scaling']
    }
  },
  'Tarun': {
    milestoneType: 'certification',
    milestoneTitle: 'HDFC Branch Auditing Excellence',
    milestoneDesc: 'Led branch audit operational improvements achieving 100% regulatory compliance ratings.',
    postData: {
      hooks: [
        "We achieved a 100% audit rating at HDFC. Here is the operational blueprint:",
        "Risk management is often treated as a checklist. That is a mistake.",
        "Regulatory compliance isn't a blocker. It's an operational standard."
      ],
      postText: `We just locked our branch financial audit with a 100% compliance rating.

Here is how we set up our operations:
1. Swapped out monthly spreadsheets for automated daily reconciliations.
2. Conducted blind audits with our 15 advisory partners.
3. Documented clear risk compliance boundaries.

Lessons:
• Daily auditing is easier than monthly scrambling.
• Blind testing surfaces real operational gaps.
• Trust is built on operational compliance.`,
      tags: ['#banking', '#operations', '#compliance', '#leadership']
    }
  },
  'Amit': {
    milestoneType: 'project',
    milestoneTitle: 'PyTorch NLP Classification Models',
    milestoneDesc: 'Built machine learning classifier at TCS that reduced email response latency by 30%.',
    postData: {
      hooks: [
        "How we built a PyTorch model that cut response latency by 30%:",
        "ML isn't about models. It's about data pipelines.",
        "AI scaling: What we learned training our classifier at TCS."
      ],
      postText: `We deployed our PyTorch classification model. The results? A 30% reduction in customer response times.

Here is the AI engineering pipeline:
1. Tokenized and cleaned text databases.
2. Trained a PyTorch transformer model on multi-GPU nodes.
3. Scaled inference via low-latency API wrappers.

Learnings:
• Clean data beats complex modeling.
• Model scale is limited by API latency.
• PyTorch makes model engineering simple.`,
      tags: ['#pytorch', '#aiengineering', '#machinelearning', '#nlp']
    }
  }
};

export default function LikoPost() {
  const { fetchProfile } = useProfile();
  
  const [activeProfileId, setActiveProfileId] = useState(localStorage.getItem('pf_active_profile_id') || '');
  const [profile, setProfile] = useState(null);
  
  const [milestoneType, setMilestoneType] = useState('project'); // 'project', 'certification', 'custom'
  const [selectedItemIndex, setSelectedItemIndex] = useState('');
  const [customMilestone, setCustomMilestone] = useState('');
  const [milestoneDesc, setMilestoneDesc] = useState('');
  
  const [style, setStyle] = useState('Storytelling');
  
  const [loading, setLoading] = useState(false);
  const [postData, setPostData] = useState(null);
  const [selectedHookIndex, setSelectedHookIndex] = useState(0);
  
  const [copied, setCopied] = useState(false);

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
    const demo = demoPostData[key];
    setMilestoneType(demo.milestoneType);
    setCustomMilestone(demo.milestoneTitle);
    setMilestoneDesc(demo.milestoneDesc);
    setPostData(demo.postData);
  };

  const loadActiveProfile = async (id) => {
    if (!id) return;
    try {
      const data = await fetchProfile(id);
      setProfile(data);
      // Parse arrays safely
      const projects = Array.isArray(data.projects) 
        ? data.projects 
        : (typeof data.projects === 'string' ? JSON.parse(data.projects || '[]') : []);

      if (projects.length > 0) {
        setSelectedItemIndex('0');
        setMilestoneDesc(projects[0].description || '');
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
      setPostData(null);
      setMilestoneDesc('');
    };
    window.addEventListener('pfActiveProfileChanged', handleProfileChanged);
    return () => window.removeEventListener('pfActiveProfileChanged', handleProfileChanged);
  }, [activeProfileId]);

  const handleItemSelectChange = (val) => {
    setSelectedItemIndex(val);
    if (!profile) return;
    
    // Parse arrays safely
    const projects = Array.isArray(profile.projects) 
      ? profile.projects 
      : (typeof profile.projects === 'string' ? JSON.parse(profile.projects || '[]') : []);
    
    const certifications = Array.isArray(profile.certifications) 
      ? profile.certifications 
      : (typeof profile.certifications === 'string' ? JSON.parse(profile.certifications || '[]') : []);

    if (milestoneType === 'project' && projects[val]) {
      setMilestoneDesc(projects[val].description || '');
    } else if (milestoneType === 'certification' && certifications[val]) {
      setMilestoneDesc(`Earned my professional certification in ${certifications[val]}.`);
    }
  };

  const handleMilestoneTypeChange = (type) => {
    setMilestoneType(type);
    setSelectedItemIndex('');
    setMilestoneDesc('');
    
    if (!profile) return;
    
    const projects = Array.isArray(profile.projects) 
      ? profile.projects 
      : (typeof profile.projects === 'string' ? JSON.parse(profile.projects || '[]') : []);
    
    const certifications = Array.isArray(profile.certifications) 
      ? profile.certifications 
      : (typeof profile.certifications === 'string' ? JSON.parse(profile.certifications || '[]') : []);

    if (type === 'project' && projects.length > 0) {
      setSelectedItemIndex('0');
      setMilestoneDesc(projects[0].description || '');
    } else if (type === 'certification' && certifications.length > 0) {
      setSelectedItemIndex('0');
      setMilestoneDesc(`Earned my professional certification in ${certifications[0]}.`);
    }
  };

  const handleGeneratePost = async () => {
    if (!profile) {
      alert('Please select or create an active profile first.');
      return;
    }
    
    let title = '';
    const projects = Array.isArray(profile.projects) 
      ? profile.projects 
      : (typeof profile.projects === 'string' ? JSON.parse(profile.projects || '[]') : []);
    
    const certifications = Array.isArray(profile.certifications) 
      ? profile.certifications 
      : (typeof profile.certifications === 'string' ? JSON.parse(profile.certifications || '[]') : []);

    if (milestoneType === 'project') {
      if (selectedItemIndex === '') {
        alert('Please select a project.');
        return;
      }
      title = projects[selectedItemIndex]?.title || 'New Project';
    } else if (milestoneType === 'certification') {
      if (selectedItemIndex === '') {
        alert('Please select a certification.');
        return;
      }
      title = certifications[selectedItemIndex] || 'New Certification';
    } else {
      if (!customMilestone.trim()) {
        alert('Please input your custom milestone title.');
        return;
      }
      title = customMilestone;
    }

    if (!milestoneDesc.trim()) {
      alert('Please add details or description.');
      return;
    }

    setLoading(true);
    setPostData(null);
    setSelectedHookIndex(0);
    setCopied(false);

    try {
      const customKey = localStorage.getItem('pf_custom_groq_key') || '';
      const token = localStorage.getItem('pf_token');
      const res = await fetch('/api/generate/linkedin-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-custom-groq-key': customKey
        },
        body: JSON.stringify({ milestone: title, description: milestoneDesc, style })
      });

      if (!res.ok) throw new Error('LinkedIn post generation failed');
      const data = await res.json();
      setPostData(data);
    } catch (err) {
      console.error(err);
      alert('Failed to generate LinkedIn Post: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCompiledPost = () => {
    if (!postData) return '';
    const hook = postData.hooks[selectedHookIndex] || '';
    const body = postData.postText || '';
    const hashTags = postData.tags ? '\n\n' + postData.tags.join(' ') : '';
    return `${hook}\n\n${body}${hashTags}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCompiledPost());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const demoKey = getDemoKey();
  
  const projects = Array.isArray(profile?.projects) 
    ? profile.projects 
    : (typeof profile?.projects === 'string' ? JSON.parse(profile.projects || '[]') : []);

  const certifications = Array.isArray(profile?.certifications) 
    ? profile.certifications 
    : (typeof profile?.certifications === 'string' ? JSON.parse(profile.certifications || '[]') : []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-themeText flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-themePrimary" />
          Liko AI — LinkedIn Post Architect
        </h1>
        <p className="text-xs text-themeTextSecondary mt-1">
          Turn your portfolio projects and achievements into professional, high-engaging LinkedIn posts. Test hooks, previews, and viral frameworks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Setup Column */}
        <div className="lg:col-span-5 bg-themeCard border border-themeBorder rounded-[24px] p-6 space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-themeText flex items-center gap-2 border-b border-themeBorder pb-2">
            <Linkedin className="h-4.5 w-4.5 text-themePrimary" />
            Milestone Settings
          </h2>

          {demoKey && (
            <button
              onClick={handleLoadDemo}
              className="w-full py-2.5 px-4 rounded-theme border border-amber-500/30 bg-amber-500/10 text-amber-500 text-xxs font-black tracking-wider uppercase hover:bg-amber-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Load {demoKey} Demo LinkedIn Post
            </button>
          )}

          {/* Category Selector */}
          <div className="space-y-1">
            <label className="block text-xxs font-bold text-themeTextSecondary uppercase pl-0.5">Select Milestone Category</label>
            <div className="grid grid-cols-3 bg-themeBg p-0.5 rounded-theme border border-themeBorder">
              <button
                type="button"
                onClick={() => handleMilestoneTypeChange('project')}
                className={`py-2 px-1 text-[10px] font-bold rounded-theme transition-all duration-300 cursor-pointer ${
                  milestoneType === 'project' ? 'bg-themeCard text-themePrimary shadow-sm' : 'text-themeTextSecondary hover:text-themeText'
                }`}
              >
                Project
              </button>
              <button
                type="button"
                onClick={() => handleMilestoneTypeChange('certification')}
                className={`py-2 px-1 text-[10px] font-bold rounded-theme transition-all duration-300 cursor-pointer ${
                  milestoneType === 'certification' ? 'bg-themeCard text-themePrimary shadow-sm' : 'text-themeTextSecondary hover:text-themeText'
                }`}
              >
                Cert
              </button>
              <button
                type="button"
                onClick={() => handleMilestoneTypeChange('custom')}
                className={`py-2 px-1 text-[10px] font-bold rounded-theme transition-all duration-300 cursor-pointer ${
                  milestoneType === 'custom' ? 'bg-themeCard text-themePrimary shadow-sm' : 'text-themeTextSecondary hover:text-themeText'
                }`}
              >
                Custom
              </button>
            </div>
          </div>

          {/* Dynamic Selection Input */}
          {milestoneType === 'project' && (
            <div className="space-y-1">
              <label className="block text-xxs font-bold text-themeTextSecondary uppercase pl-0.5">Choose Project</label>
              {projects.length > 0 ? (
                <select
                  value={selectedItemIndex}
                  onChange={(e) => handleItemSelectChange(e.target.value)}
                  className="w-full p-2.5 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-xs text-themeText"
                >
                  {projects.map((p, idx) => (
                    <option key={idx} value={idx}>{p.title}</option>
                  ))}
                </select>
              ) : (
                <div className="text-xxs text-red-400 p-2.5 border border-red-500/10 rounded-theme bg-red-500/5">
                  No projects found in active profile. Go to dashboard to add.
                </div>
              )}
            </div>
          )}

          {milestoneType === 'certification' && (
            <div className="space-y-1">
              <label className="block text-xxs font-bold text-themeTextSecondary uppercase pl-0.5">Choose Certification</label>
              {certifications.length > 0 ? (
                <select
                  value={selectedItemIndex}
                  onChange={(e) => handleItemSelectChange(e.target.value)}
                  className="w-full p-2.5 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-xs text-themeText"
                >
                  {certifications.map((c, idx) => (
                    <option key={idx} value={idx}>{c}</option>
                  ))}
                </select>
              ) : (
                <div className="text-xxs text-red-400 p-2.5 border border-red-500/10 rounded-theme bg-red-500/5">
                  No certifications found in active profile. Go to dashboard to add.
                </div>
              )}
            </div>
          )}

          {milestoneType === 'custom' && (
            <div className="space-y-1">
              <label className="block text-xxs font-bold text-themeTextSecondary uppercase pl-0.5">Milestone/Event Title</label>
              <input
                type="text"
                placeholder="e.g. Started my new role as Tech Lead at Stripe"
                value={customMilestone}
                onChange={(e) => setCustomMilestone(e.target.value)}
                className="w-full p-2.5 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-xs text-themeText"
              />
            </div>
          )}

          {/* Hook Engagement Style */}
          <div className="space-y-1">
            <label className="block text-xxs font-bold text-themeTextSecondary uppercase pl-0.5">Viral Hook Angle</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full p-2.5 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-xs text-themeText"
            >
              <option value="Storytelling">🎭 Storytelling (Journey & Lessons)</option>
              <option value="Contrarian">⚡ Contrarian (Challenging standard assumptions)</option>
              <option value="Educational">🎓 Educational (Direct values & checklist)</option>
            </select>
          </div>

          {/* Description details */}
          <div className="space-y-1">
            <label className="block text-xxs font-bold text-themeTextSecondary uppercase pl-0.5">Milestone Description & Details</label>
            <textarea
              placeholder="What challenges did you face? What did you build? What did you learn?"
              rows={8}
              value={milestoneDesc}
              onChange={(e) => setMilestoneDesc(e.target.value)}
              className="w-full p-3 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-xs text-themeText leading-relaxed resize-none"
            />
          </div>

          <button
            onClick={handleGeneratePost}
            disabled={loading || !profile}
            className="w-full py-3 bg-themePrimary hover:bg-themePrimaryDark text-white text-xs font-black rounded-theme shadow-md hover-lift transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Crafting Social Proof...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Architect LinkedIn Post
              </>
            )}
          </button>
        </div>

        {/* Right Side: Mock Feed Output Preview */}
        <div className="lg:col-span-7 space-y-6">
          {!postData ? (
            <div className="bg-themeCard border border-themeBorder rounded-[24px] p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-xl min-h-[450px]">
              <div className="p-4 bg-themePrimary/5 text-themePrimary rounded-full">
                <Linkedin className="h-10 w-10 animate-pulse" />
              </div>
              <h3 className="text-sm font-bold text-themeText">LinkedIn Preview Canvas</h3>
              <p className="text-xs text-themeTextSecondary max-w-sm leading-relaxed">
                Choose a project or custom event on the left, describe your key achievements, and hit generate. Liko AI will build hook variations and render a desktop LinkedIn mock preview here.
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Hook Customizer Panel */}
              <div className="bg-themeCard border border-themeBorder rounded-[24px] p-5 space-y-3.5 shadow-md text-left">
                <div>
                  <h3 className="text-xs font-black text-themeTextSecondary uppercase tracking-widest pl-0.5">Test Hook Variations</h3>
                  <p className="text-xxs text-themeTextSecondary mt-0.5">Select a hook variation below to swap the header line of your post:</p>
                </div>
                <div className="space-y-2">
                  {postData.hooks.map((hk, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedHookIndex(idx)}
                      className={`w-full text-left p-3 rounded-theme border text-xs leading-relaxed transition-all duration-300 flex items-start gap-2.5 cursor-pointer ${
                        selectedHookIndex === idx
                          ? 'border-themePrimary bg-themePrimary/5 text-themePrimary font-bold'
                          : 'border-themeBorder bg-themeBg/40 text-themeTextSecondary hover:text-themeText'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${
                        selectedHookIndex === idx ? 'bg-themePrimary text-white' : 'bg-themeBorder text-themeTextSecondary'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="truncate-2-lines">"{hk}"</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mock LinkedIn Post View */}
              <div className="bg-themeCard border border-themeBorder rounded-[24px] shadow-xl overflow-hidden text-left">
                {/* Mock Header */}
                <div className="p-4 flex items-center gap-3 border-b border-themeBorder bg-themeBg/20">
                  <div className="w-10 h-10 bg-themePrimary/15 text-themePrimary rounded-full flex items-center justify-center font-bold text-sm">
                    {profile.name?.slice(0,2).toUpperCase() || 'PF'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-extrabold text-themeText hover:text-themePrimary transition-colors cursor-pointer">
                        {profile.name || 'Your Name'}
                      </span>
                      <span className="text-[10px] text-themeTextSecondary">• 1st</span>
                    </div>
                    <p className="text-[10px] text-themeTextSecondary leading-tight truncate max-w-[280px]">
                      {profile.profession || 'Professional'} | Proforge Member
                    </p>
                    <div className="flex items-center gap-1 text-[9px] text-themeTextSecondary mt-0.5">
                      <span>2h</span>
                      <span>•</span>
                      <Globe className="h-3 w-3" />
                    </div>
                  </div>
                </div>

                {/* Mock Content Body */}
                <div className="p-5 space-y-4 text-xs leading-relaxed text-themeText font-sans whitespace-pre-wrap select-text">
                  <span className="font-extrabold text-themePrimary">
                    {postData.hooks[selectedHookIndex]}
                  </span>
                  <div>{postData.postText}</div>
                  
                  {postData.tags && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-themeBorder/40">
                      {postData.tags.map((tag, idx) => (
                        <span key={idx} className="text-themePrimary font-bold hover:underline cursor-pointer">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mock Engagements Metrics */}
                <div className="px-4 py-2 flex justify-between items-center text-[10px] text-themeTextSecondary border-t border-themeBorder/40">
                  <div className="flex items-center gap-1">
                    <span className="flex -space-x-1">
                      <span className="w-4 h-4 bg-themePrimary text-white rounded-full flex items-center justify-center text-[8px] font-bold">👍</span>
                      <span className="w-4 h-4 bg-purple-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold">💡</span>
                    </span>
                    <span>148 likes</span>
                  </div>
                  <div>
                    <span>12 comments • 3 shares</span>
                  </div>
                </div>

                {/* Mock Footer Actions */}
                <div className="px-2 py-1 bg-themeBg/30 flex justify-between border-t border-themeBorder">
                  <button className="flex-1 py-2 text-xxs font-bold text-themeTextSecondary hover:bg-themeBg hover:text-themeText rounded-theme transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                    <ThumbsUp className="h-3.5 w-3.5" />
                    <span>Like</span>
                  </button>
                  <button className="flex-1 py-2 text-xxs font-bold text-themeTextSecondary hover:bg-themeBg hover:text-themeText rounded-theme transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Comment</span>
                  </button>
                  <button className="flex-1 py-2 text-xxs font-bold text-themeTextSecondary hover:bg-themeBg hover:text-themeText rounded-theme transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                    <Share2 className="h-3.5 w-3.5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {/* Global Post Action Button */}
              <button
                onClick={handleCopy}
                className="w-full py-3 bg-themePrimary hover:bg-themePrimaryDark text-white text-xs font-black rounded-theme shadow-md hover-lift transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="h-4.5 w-4.5 text-green-300" />
                    Copied Post to Clipboard!
                  </>
                ) : (
                  <>
                    <Clipboard className="h-4.5 w-4.5" />
                    Copy Final Compiled Post
                  </>
                )}
              </button>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}

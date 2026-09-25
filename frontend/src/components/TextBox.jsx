import React, { useState } from 'react';
import { Sparkles, HelpCircle, FileText, Trash2, ArrowRight } from 'lucide-react';

export default function TextBox({ onAnalyze, loading }) {
  const [text, setText] = useState('');
  const [activeIndex, setActiveIndex] = useState(null);

  const sampleProfiles = [
    {
      label: '🎮 Jay Dhave (Ubisoft ➔ Google)',
      text: 'My name is Jay Dhave. I am a software engineer at Ubisoft. I have 3 years of experience in C++ and game physics programming. I built core movement features for major game titles. I am good at system optimization, multithreading, and performance analysis. I want to transition into Google as a Senior Software Engineer to build large-scale cloud services.'
    },
    {
      label: '💼 Tarun Vaidya (HDFC ➔ JP Morgan)',
      text: 'I am Tarun Vaidya, currently working as a Branch Manager at HDFC Bank. I manage banking operations, financial audits, and a team of 15 relationship advisors. I recently got selected as a Vice Manager at JP Morgan Chase. I specialize in wealth management, risk assessments, and executive leadership. I want to build a profile for my new role.'
    },
    {
      label: '🎨 Priya Sharma (Zomato ➔ Netflix)',
      text: 'My name is Priya Sharma. I am a UI/UX designer with 4 years of experience at Zomato. I design mobile food delivery interfaces and design systems. I am good at user research, Figma prototyping, and visual aesthetics. I got selected at Netflix for Senior Product Designer and want to build my executive branding portfolio.'
    },
    {
      label: '📊 Amit Mishra (TCS ➔ OpenAI)',
      text: 'I am Amit Mishra, a Lead Data Scientist at TCS. I have 5 years of experience building machine learning models for retail clients. I specialize in Python, PyTorch, and NLP models. I am trying to get a role at OpenAI as an AI Engineer, and want to extract my accomplishments into a clean branding page.'
    },
    {
      label: '🚀 Rohan Mehta (Swiggy ➔ Meta)',
      text: 'My name is Rohan Mehta. I am a Product Manager at Swiggy, scaling quick commerce systems. I got selected in Meta as a Product Manager. I specialize in product metrics, SQL analytics, and cross-functional team execution. I want to optimize my bio and resume for Meta\'s executive team.'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAnalyze(text);
  };

  const handleProfileSelect = (index) => {
    setText(sampleProfiles[index].text);
    setActiveIndex(index);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  return (
    <form onSubmit={handleSubmit} className="w-full glass-panel p-6 sm:p-8 rounded-2xl border border-themeBorder/80 space-y-6 text-left shadow-lg">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-heading font-black text-themeTextSecondary uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="h-4 w-4 text-themePrimary" />
            Choose a Sample Scenario or Describe Yours
          </label>
          {text && (
            <button
              type="button"
              onClick={() => {
                setText('');
                setActiveIndex(null);
              }}
              className="text-[10px] font-mono text-themeTextSecondary hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 className="h-3 w-3" />
              Clear
            </button>
          )}
        </div>
        
        {/* Profile pills grid */}
        <div className="flex flex-wrap gap-2">
          {sampleProfiles.map((profile, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleProfileSelect(index)}
              className={`py-1.5 px-3 rounded-full text-[11px] font-bold transition-all duration-300 border hover-lift cursor-pointer ${
                activeIndex === index
                  ? 'bg-themePrimary text-white border-themePrimary shadow-sm shadow-themePrimary/25'
                  : 'bg-themeCard text-themeTextSecondary border-themeBorder/80 hover:border-themePrimary/50 hover:text-themeText'
              }`}
            >
              {profile.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setActiveIndex(null);
          }}
          rows={8}
          placeholder="Select one of the quick profiles above, or type your own experience here (e.g., your achievements, current role, and the job you want to target next)..."
          className="w-full p-4 rounded-xl border border-themeBorder bg-themeCard/60 focus:bg-themeCard focus:border-themePrimary focus:ring-2 focus:ring-themePrimary/20 focus:outline-none transition-all duration-200 text-themeText font-mono text-xs leading-relaxed"
        />

        {/* Dynamic metrics bar */}
        <div className="flex items-center justify-between pt-2 px-1 text-[10px] text-themeTextSecondary font-mono border-t border-themeBorder/40">
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3 text-themePrimary" />
            AI Parsing Engine Ready
          </span>
          <div className="flex items-center gap-3">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{charCount} chars</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !text.trim()}
        className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-themePrimary hover:bg-themePrimaryDark text-white font-heading font-bold rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover-lift cursor-pointer btn-shimmer"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Analyzing Profile with Groq AI...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-4.5 w-4.5" />
            <span>Synthesize Career Profile</span>
            <ArrowRight className="h-4 w-4 ml-1 opacity-70 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
}

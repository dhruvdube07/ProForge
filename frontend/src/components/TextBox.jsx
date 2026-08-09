import React, { useState } from 'react';
import { Sparkles, HelpCircle } from 'lucide-react';

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

  return (
    <form onSubmit={handleSubmit} className="w-full glass-panel p-6 rounded-theme space-y-5 text-left">
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-themeTextSecondary flex items-center gap-1.5">
          <HelpCircle className="h-4 w-4 text-themePrimary" />
          Choose a Sample Scenario or Describe Yours
        </label>
        
        {/* Profile pills grid */}
        <div className="flex flex-wrap gap-2">
          {sampleProfiles.map((profile, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleProfileSelect(index)}
              className={`py-1.5 px-3 rounded-full text-xxs font-bold transition-all duration-300 border hover-lift cursor-pointer ${
                activeIndex === index
                  ? 'bg-themePrimary text-white border-themePrimary'
                  : 'bg-themeCard text-themeTextSecondary border-themeBorder hover:border-themePrimary hover:text-themeText'
              }`}
            >
              {profile.label}
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setActiveIndex(null); // Reset active indicator if user typed custom
        }}
        rows={8}
        placeholder="Select one of the quick profiles above, or type your own experience here (e.g., your achievements, current role, and the job you want to get next)..."
        className="w-full p-4 rounded-theme border border-themeBorder bg-themeCard focus:border-themePrimary focus:ring-2 focus:ring-themePrimaryLight focus:outline-none transition-all duration-200 text-themeText font-mono text-sm leading-relaxed"
      />

      <button
        type="submit"
        disabled={loading || !text.trim()}
        className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-themePrimary hover:bg-themePrimaryDark text-white font-semibold rounded-theme shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover-lift cursor-pointer"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Analyzing Profile details with Groq AI...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            Analyze Me
          </>
        )}
      </button>
    </form>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Globe, 
  Briefcase, 
  Mail, 
  Linkedin, 
  Sparkles, 
  ArrowRight, 
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Layers
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Hub() {
  const { user } = useAuth();
  const userName = user?.first_name || user?.name || 'Professional';

  const tools = [
    {
      id: 'remo',
      title: 'Remo AI',
      subtitle: 'Resume Intelligence Studio',
      desc: 'Create ATS-optimized, high-conversion executive resumes. Supports 105+ colorway schemes and native PDFKit vector renders.',
      icon: FileText,
      path: '/dashboard',
      gradient: 'from-blue-500/15 via-blue-500/5 to-transparent',
      borderColor: 'hover:border-blue-500/50',
      badge: 'Resume Studio',
      accentColor: 'text-blue-400'
    },
    {
      id: 'folio',
      title: 'Folio AI',
      subtitle: 'Portfolio Publisher',
      desc: 'Build & launch customized digital portfolios. Pick Bento, Executive, or Terminal layouts, and export standalone static ZIP bundles.',
      icon: Globe,
      path: '/folio',
      gradient: 'from-emerald-500/15 via-emerald-500/5 to-transparent',
      borderColor: 'hover:border-emerald-500/50',
      badge: '1-Click Portfolios',
      accentColor: 'text-emerald-400'
    },
    {
      id: 'talo',
      title: 'Talo AI',
      subtitle: 'ATS Alignment Matcher',
      desc: 'Scan resumes against target Job Descriptions. Get real-time match scoring metrics, keyword audits, and direct AI bullet optimizations.',
      icon: Briefcase,
      path: '/talo',
      gradient: 'from-amber-500/15 via-amber-500/5 to-transparent',
      borderColor: 'hover:border-amber-500/50',
      badge: 'ATS Scanner',
      accentColor: 'text-amber-400'
    },
    {
      id: 'covo',
      title: 'Covo AI',
      subtitle: 'Outreach Copilot',
      desc: 'Compose highly tailored cover letters, concise recruiter LinkedIn messages, and executive pitch statements for rapid job hunting.',
      icon: Mail,
      path: '/covo',
      gradient: 'from-purple-500/15 via-purple-500/5 to-transparent',
      borderColor: 'hover:border-purple-500/50',
      badge: 'Outreach Studio',
      accentColor: 'text-purple-400'
    },
    {
      id: 'liko',
      title: 'Liko AI',
      subtitle: 'LinkedIn Content Architect',
      desc: 'Convert project details or certified achievements into engaging, hook-based LinkedIn posts. Preview rendering inside desktop feed mocks.',
      icon: Linkedin,
      path: '/liko',
      gradient: 'from-pink-500/15 via-pink-500/5 to-transparent',
      borderColor: 'hover:border-pink-500/50',
      badge: 'Branding Builder',
      accentColor: 'text-pink-400'
    },
    {
      id: 'mali',
      title: 'Mali AI',
      subtitle: 'Email Campaigns',
      desc: 'Compose rich-text email outreaches, inject custom links and styles, and schedule automated dispatches for cold campaigns.',
      icon: Mail,
      path: '/mali',
      gradient: 'from-cyan-500/15 via-cyan-500/5 to-transparent',
      borderColor: 'hover:border-cyan-500/50',
      badge: 'Email Studio',
      accentColor: 'text-cyan-400'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left space-y-10">
      {/* Header Banner */}
      <div className="relative glass-panel premium-frame p-8 sm:p-12 overflow-hidden flex flex-col justify-between shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-themePrimary/10 rounded-full blur-3xl -z-10 translate-x-20 -translate-y-20 pointer-events-none"></div>
        
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-themePrimary/15 text-themePrimary text-[10px] font-heading font-black tracking-widest uppercase border border-themePrimary/30">
            <Sparkles className="h-3.5 w-3.5" />
            Unified Workspace Launchpad
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-themeText leading-tight">
            Welcome back, <span className="text-gradient-primary">{userName}</span>
          </h1>
          
          <p className="text-sm text-themeTextSecondary leading-relaxed">
            Enter your career history once into <strong className="text-themeText font-semibold">Proforge AI</strong>, and dynamically synthesize ATS-ready resumes, responsive web portfolios, recruiter outreach, and LinkedIn thought leadership across all 6 specialized studios.
          </p>

          {/* Quick status chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-themeBg/80 border border-themeBorder text-[10px] font-mono text-themeTextSecondary">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              6 Intelligence Engines Ready
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-themeBg/80 border border-themeBorder text-[10px] font-mono text-themeTextSecondary">
              <ShieldCheck className="h-3 w-3 text-themePrimary" />
              ATS Strict Compliance
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-themeBg/80 border border-themeBorder text-[10px] font-mono text-themeTextSecondary">
              <Layers className="h-3 w-3 text-amber-400" />
              Dynamic Typography Synchronized
            </span>
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pl-1">
          <h2 className="text-xs font-heading font-black text-themeTextSecondary uppercase tracking-widest flex items-center gap-2">
            <Zap className="h-4 w-4 text-themePrimary" />
            Select a Dedicated Career Studio
          </h2>
          <span className="text-[10px] font-mono text-themeTextSecondary opacity-75">
            Click any suite to launch
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                to={tool.path}
                className={`group pro-card relative flex flex-col justify-between p-6 rounded-2xl border border-themeBorder/80 bg-gradient-to-br ${tool.gradient} bg-themeCard hover:shadow-xl transition-all duration-300 hover-lift cursor-pointer overflow-hidden ${tool.borderColor}`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-themeBg/80 border border-themeBorder/60 rounded-xl group-hover:scale-105 group-hover:border-themePrimary/40 transition-all duration-300 shadow-sm">
                      <Icon className={`h-5 w-5 ${tool.accentColor}`} />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-themeBg/80 text-themeTextSecondary border border-themeBorder uppercase tracking-wider">
                      {tool.badge}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-base font-heading font-bold text-themeText flex items-center gap-1">
                      {tool.title}
                      <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 text-themePrimary" />
                    </h3>
                    <p className="text-xs font-semibold text-themeTextSecondary">
                      {tool.subtitle}
                    </p>
                    <p className="text-[11px] text-themeTextSecondary/90 leading-relaxed pt-1">
                      {tool.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-3.5 border-t border-themeBorder/40 flex items-center justify-between text-xs font-bold text-themeTextSecondary group-hover:text-themePrimary transition-colors">
                  <span className="font-heading">Enter Studio</span>
                  <div className="w-6 h-6 rounded-full bg-themeBg/80 border border-themeBorder/60 flex items-center justify-center group-hover:border-themePrimary/50 group-hover:bg-themePrimary group-hover:text-white transition-all">
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

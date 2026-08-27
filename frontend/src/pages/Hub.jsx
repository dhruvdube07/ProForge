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
  ArrowUpRight 
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Hub() {
  const { user } = useAuth();
  const userName = user?.first_name || user?.name || 'Professional';

  const tools = [
    {
      id: 'remo',
      title: 'Remo AI',
      subtitle: 'Resume Intelligence',
      desc: 'Create ATS-optimized, high-conversion resumes. Supports 105+ design combinations and client/server PDFKit renders.',
      icon: FileText,
      path: '/dashboard',
      color: 'from-blue-500/20 to-cyan-500/10 hover:border-blue-500/50',
      badge: 'Resume Studio'
    },
    {
      id: 'folio',
      title: 'Folio AI',
      subtitle: 'Portfolio Publisher',
      desc: 'Build & launch customized digital portfolios. Pick Bento, Executive, or Terminal layouts, and export standalone static source code ZIP bundles.',
      icon: Globe,
      path: '/folio',
      color: 'from-emerald-500/20 to-teal-500/10 hover:border-emerald-500/50',
      badge: '1-Click Portfolios'
    },
    {
      id: 'talo',
      title: 'Talo AI',
      subtitle: 'ATS Alignment Matcher',
      desc: 'Scan resumes against target Job Descriptions. Get match scoring metrics, keyword audits, and direct AI bullet optimizations.',
      icon: Briefcase,
      path: '/talo',
      color: 'from-amber-500/20 to-orange-500/10 hover:border-amber-500/50',
      badge: 'ATS Scanner'
    },
    {
      id: 'covo',
      title: 'Covo AI',
      subtitle: 'Outreach Copilot',
      desc: 'Compose highly tailored cover letters, concise recruiter LinkedIn messages, and brief pitch statements for job hunting.',
      icon: Mail,
      path: '/covo',
      color: 'from-purple-500/20 to-indigo-500/10 hover:border-purple-500/50',
      badge: 'Outreach Studio'
    },
    {
      id: 'liko',
      title: 'Liko AI',
      subtitle: 'LinkedIn Content Suite',
      desc: 'Convert project details or certified achievements into engaging, hook-based LinkedIn posts. Preview rendering inside desktop feed mocks.',
      icon: Linkedin,
      path: '/liko',
      color: 'from-pink-500/20 to-rose-500/10 hover:border-pink-500/50',
      badge: 'Branding Builder'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left">
      {/* Header Banner */}
      <div className="relative glass-panel premium-frame p-8 sm:p-12 mb-12 overflow-hidden flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-80 h-80 bg-themePrimary/5 rounded-full blur-3xl -z-10 translate-x-20 -translate-y-20"></div>
        <div className="space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-themePrimary/10 text-themePrimary text-xxs font-black tracking-wider uppercase border border-themePrimary/20">
            <Sparkles className="h-3.5 w-3.5" />
            Unified Workspace Launchpad
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-themeText leading-tight">
            Welcome back, <span className="text-themePrimary">{userName}</span>
          </h1>
          <p className="text-sm text-themeTextSecondary leading-relaxed">
            Welcome to <strong className="text-themeText font-semibold">Proforge AI</strong>. Enter your professional credentials once, and instantly generate portfolios, resume documents, outreach messaging, and social posts across all integrated suites.
          </p>
        </div>
      </div>

      {/* Bento Grid */}
      <h2 className="text-lg font-bold text-themeTextSecondary uppercase tracking-widest mb-6 pl-1">
        Select a Workspace Suite
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, idx) => {
          const Icon = tool.icon;
          // Let's make the first 2 items span 1 grid columns, or the 3rd item span, to make a beautiful Bento Grid
          // Column span layout logic: 
          const gridSpan = idx === 0 || idx === 1 ? 'lg:col-span-1' : 'lg:col-span-1';
          
          return (
            <Link
              key={tool.id}
              to={tool.path}
              className={`group relative flex flex-col justify-between p-6 rounded-theme border border-themeBorder bg-gradient-to-br ${tool.color} bg-themeCard hover:shadow-2xl transition-all duration-300 hover-lift cursor-pointer`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-themeBg/90 border border-themeBorder/50 rounded-theme group-hover:text-themePrimary transition-colors">
                    <Icon className="h-5 w-5 text-themeText" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-themeBg/80 text-themeTextSecondary border border-themeBorder uppercase tracking-wider">
                    {tool.badge}
                  </span>
                </div>
                
                <div className="space-y-1.5">
                  <h3 className="text-base font-black text-themeText flex items-center gap-1">
                    {tool.title}
                    <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 text-themePrimary" />
                  </h3>
                  <p className="text-xs font-bold text-themeTextSecondary opacity-85">
                    {tool.subtitle}
                  </p>
                  <p className="text-xxs text-themeTextSecondary leading-relaxed pt-1">
                    {tool.desc}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-themeBorder/30 flex items-center justify-between text-xxs font-bold text-themeTextSecondary group-hover:text-themePrimary transition-colors">
                <span>Enter Workspace</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

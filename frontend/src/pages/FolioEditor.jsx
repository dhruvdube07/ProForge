import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Globe, 
  Settings, 
  Eye, 
  Clipboard, 
  Check, 
  LayoutGrid, 
  Terminal, 
  Briefcase, 
  FileText,
  Download,
  Edit3,
  AlignLeft,
  FolderOpen
} from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import JSZip from 'jszip';

export default function FolioEditor() {
  const { fetchProfile, updateProfile } = useProfile();
  
  const [activeProfileId, setActiveProfileId] = useState(localStorage.getItem('pf_active_profile_id') || '');
  const [profile, setProfile] = useState(null);
  const [profilesList, setProfilesList] = useState([]);
  
  // Customization preferences
  const [slug, setSlug] = useState('');
  const [folioTheme, setFolioTheme] = useState('bento'); // 'bento', 'terminal', 'executive', 'glass'
  const [showSocials, setShowSocials] = useState(true);
  const [showProjects, setShowProjects] = useState(true);
  const [showContactForm, setShowContactForm] = useState(true);
  const [accentColor, setAccentColor] = useState('#3B82F6');
  
  // Overrides / Narrative editors
  const [customTitle, setCustomTitle] = useState('');
  const [customTagline, setCustomTagline] = useState('');
  const [customBio, setCustomBio] = useState('');
  const [customProjects, setCustomProjects] = useState([]);

  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [zipLoading, setZipLoading] = useState(false);

  const loadActiveProfile = async (id) => {
    if (!id) return;
    try {
      const data = await fetchProfile(id);
      setProfile(data);
      
      // Load serialized folio custom preferences
      setSlug(data.slug || '');
      setFolioTheme(data.folioTheme || 'bento');
      setShowSocials(data.showSocials !== undefined ? data.showSocials : true);
      setShowProjects(data.showProjects !== undefined ? data.showProjects : true);
      setShowContactForm(data.showContactForm !== undefined ? data.showContactForm : true);
      setAccentColor(data.accentColor || '#3B82F6');

      // Load overrides or fallback to original values
      setCustomTitle(data.customTitle || data.profession || '');
      setCustomTagline(data.customTagline || data.tagline || '');
      setCustomBio(data.customBio || data.bio || '');

      // Handle project overrides
      let initialProjects = [];
      const origProjects = Array.isArray(data.projects) 
        ? data.projects 
        : (typeof data.projects === 'string' ? JSON.parse(data.projects || '[]') : []);
      
      if (Array.isArray(data.customProjects) && data.customProjects.length === origProjects.length) {
        initialProjects = data.customProjects;
      } else {
        initialProjects = origProjects.map(p => ({
          title: p.title || '',
          technologies: p.technologies || '',
          duration: p.duration || '',
          description: p.description || ''
        }));
      }
      setCustomProjects(initialProjects);
    } catch (err) {
      console.error('Error loading active profile:', err);
    }
  };

  const loadProfilesList = async () => {
    try {
      const token = localStorage.getItem('pf_token');
      if (!token) return;
      const res = await fetch('/api/profiles', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setProfilesList(data);
        }
      }
    } catch (err) {
      console.error('Error loading profile list inside folio:', err);
    }
  };

  useEffect(() => {
    loadActiveProfile(activeProfileId);
    loadProfilesList();
    
    const handleProfileChanged = () => {
      const newId = localStorage.getItem('pf_active_profile_id') || '';
      setActiveProfileId(newId);
      loadActiveProfile(newId);
    };
    window.addEventListener('pfActiveProfileChanged', handleProfileChanged);
    return () => window.removeEventListener('pfActiveProfileChanged', handleProfileChanged);
  }, [activeProfileId]);

  const handleProfileSelectInsideFolio = (id) => {
    if (!id) return;
    localStorage.setItem('pf_active_profile_id', id);
    setActiveProfileId(id);
    loadActiveProfile(id);
    window.dispatchEvent(new Event('pfActiveProfileChanged'));
  };

  const handleLoadDemoScenario = (charName) => {
    const demoData = {
      Jay: {
        title: 'Lead Systems Engine Developer',
        tagline: 'Optimizing core game physics loops and scaling distributed backend nodes.',
        bio: 'Lead Systems Architect with 4+ years of experience optimizing C++ engines at Ubisoft. Optimized frame delivery physics by 24% and built core multithreaded network engines for global AAA game releases.',
        theme: 'terminal',
        accent: '#10B981',
        projects: [
          { title: 'PhysX Subsystem Optimization', technologies: 'C++, Assembly, CUDA', duration: '12 months', description: 'Refactored physics execution grids to run on massive parallel GPUs.' },
          { title: 'Distributed Key-Value Cache', technologies: 'Go, Redis, gRPC', duration: '6 months', description: 'Built an engine state caching system that keeps server sync latencies below 2ms.' }
        ]
      },
      Tarun: {
        title: 'Vice Manager of Private Wealth Operations',
        tagline: 'Spearheading portfolio risk audits and high-net-worth wealth management.',
        bio: 'Experienced Financial Operations Lead with a proven track record managing branch assets and directing portfolio advisors. Specialized in risk modeling and operational audit efficiency.',
        theme: 'executive',
        accent: '#F59E0B',
        projects: [
          { title: 'Hedge Portfolio Risk Assessor', technologies: 'Python, Excel, VBA', duration: '8 months', description: 'Modeled simulated asset drawdowns across multiple interest rate hikes.' },
          { title: 'Client Onboarding CRM Sync', technologies: 'Salesforce, REST API', duration: '4 months', description: 'Streamlined wealth relationship tracking for over 15 financial managers.' }
        ]
      },
      Priya: {
        title: 'Senior UI/UX & Design Architect',
        tagline: 'Crafting responsive design systems and human-centric mobile layouts.',
        bio: 'Visual Design Lead with 4+ years designing delivery interfaces for Zomato. Passionate about glassmorphic components, accessible micro-interactions, and visual storytelling.',
        theme: 'glass',
        accent: '#EC4899',
        projects: [
          { title: 'Zomato Food Express Redesign', technologies: 'Figma, Tailwind, React', duration: '10 months', description: 'Created accessibility-compliant cart checkout screens, boosting retention by 14%.' },
          { title: 'Interactive Figma Components Kit', technologies: 'Design Tokens, CSS', duration: '6 months', description: 'Maintained a cross-platform visual UI kit used by 20 product engineers.' }
        ]
      },
      Amit: {
        title: 'Senior AI & Deep Learning Developer',
        tagline: 'Training natural language transformer models and custom pipelines.',
        bio: 'AI Engineer specializing in NLP, transformers, and large language model pre-training. Led machine learning teams to design state-of-the-art text classification and classification models.',
        theme: 'bento',
        accent: '#84CC16',
        projects: [
          { title: 'Llama Quantization Toolbox', technologies: 'Python, PyTorch, C++', duration: '8 months', description: 'Compressed LLM weights into 4-bit formats to run low-latency models locally.' },
          { title: 'Retail Sentiment Classifier', technologies: 'Python, Hugging Face', duration: '5 months', description: 'Analyzed over 1M feedback records using fine-tuned transformer networks.' }
        ]
      },
      Rohan: {
        title: 'Lead Product & Growth Architect',
        tagline: 'Scaling high-frequency commerce platforms and growth metrics.',
        bio: 'Metrics-driven Product Manager with experience launching hyper-local commerce systems. Specialized in scaling checkout funnels, user retention modeling, and cross-functional team execution.',
        theme: 'bento',
        accent: '#3B82F6',
        projects: [
          { title: 'Swiggy Instamart checkout scale', technologies: 'SQL, Amplitude, Jira', duration: '9 months', description: 'A/B tested discount distribution triggers, reducing checkout drop-offs by 8%.' },
          { title: 'User Retention Cohort Engine', technologies: 'Python, Snowflake', duration: '5 months', description: 'Modeled user churn probability cohorts based on purchasing frequencies.' }
        ]
      }
    };

    const data = demoData[charName];
    if (data) {
      setSlug(charName.toLowerCase() + '-portfolio');
      setFolioTheme(data.theme);
      setAccentColor(data.accent);
      setCustomTitle(data.title);
      setCustomTagline(data.tagline);
      setCustomBio(data.bio);
      setCustomProjects(data.projects);
      alert(`Loaded demo portfolio case study for ${charName}! Hit "Apply & Save Portfolio" to apply to link.`);
    }
  };

  const handleSaveFolioSettings = async () => {
    if (!profile) return;
    
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-_]/g, '');
    if (slug && cleanSlug !== slug) {
      alert('Portfolio URL Slug must contain only alphanumeric characters, dashes, or underscores.');
      return;
    }
    
    setSaving(true);
    const updated = {
      ...profile,
      slug: cleanSlug,
      folioTheme,
      showSocials,
      showProjects,
      showContactForm,
      accentColor,
      customTitle,
      customTagline,
      customBio,
      customProjects
    };
    
    try {
      const saved = await updateProfile(profile.id, updated);
      setProfile(saved);
      alert('Portfolio configurations saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save configurations: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Helper to parse lists
  const parseList = (val) => {
    if (Array.isArray(val)) return val;
    try { return JSON.parse(val || '[]'); } catch(e) { return []; }
  };

  // Standalone ZIP Exporter
  const handleExportZip = async () => {
    if (!profile) return;
    setZipLoading(true);
    
    try {
      const name = profile.name || 'Professional';
      const cleanUsername = name.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'user';
      const email = profile.contact_email || '';
      const phone = profile.contact_phone || '';
      const location = profile.contact_location || '';
      const linkedin = profile.linkedin_url || '';
      const github = profile.github_url || '';
      
      const skills = parseList(profile.skills);
      const experiences = parseList(profile.experience);
      const education = parseList(profile.education);

      // Create ZIP Archive
      const zip = new JSZip();
      const folderName = `portfolio-${cleanUsername}`;
      const folder = zip.folder(folderName);

      // 1. STYLE.CSS
      const styleCss = `
:root {
  --bg-color: #0b0f19;
  --card-bg: #111827;
  --text-color: #f3f4f6;
  --text-secondary: #9ca3af;
  --border-color: rgba(255, 255, 255, 0.08);
  --accent-color: ${accentColor};
  --accent-glow: ${accentColor}25;
}

body.light-theme {
  --bg-color: #f9fafb;
  --card-bg: #ffffff;
  --text-color: #111827;
  --text-secondary: #4b5563;
  --border-color: #e5e7eb;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Inter', system-ui, sans-serif;
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  padding: 0;
  line-height: 1.6;
}

header {
  border-bottom: 1px solid var(--border-color);
  background: rgba(17, 24, 39, 0.8);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 100;
}

body.light-theme header {
  background: rgba(255, 255, 255, 0.8);
}

.nav-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-weight: 900;
  font-size: 1.25rem;
  color: var(--text-color);
  text-decoration: none;
}

.logo span {
  color: var(--accent-color);
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-links a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 600;
}

.nav-links a:hover {
  color: var(--text-color);
}

.theme-toggle-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-color);
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
}

main {
  max-width: 1100px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.hero-section {
  padding: 4rem 0;
  text-align: left;
}

.hero-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.25rem 0.75rem;
  background-color: var(--accent-glow);
  color: var(--accent-color);
  border-radius: 9999px;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  border: 1px solid var(--accent-color);
}

.hero-section h1 {
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  letter-spacing: -1px;
}

.hero-section h2 {
  font-size: 1.5rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.hero-tagline {
  font-style: italic;
  color: var(--accent-color);
  margin-bottom: 1.5rem;
  font-size: 1.125rem;
}

.btn-primary {
  display: inline-block;
  background: var(--accent-color);
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
}

.grid-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-top: 3rem;
}

@media(max-width: 768px) {
  .grid-layout {
    grid-template-columns: 1fr;
  }
}

.card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 1rem;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 0.5rem;
  text-transform: uppercase;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.skill-tag {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  font-size: 0.75rem;
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  font-weight: 600;
}

.timeline-item {
  border-left: 2px solid var(--border-color);
  padding-left: 1.5rem;
  position: relative;
  margin-bottom: 1.5rem;
}

.timeline-item::after {
  content: '';
  position: absolute;
  left: -5px;
  top: 6px;
  width: 8px;
  height: 8px;
  background: var(--accent-color);
  border-radius: 50%;
}

.timeline-role {
  font-weight: bold;
  font-size: 1rem;
}

.timeline-company {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.timeline-desc {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.filter-bar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-btn {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: bold;
}

.filter-btn.active {
  background: var(--accent-color);
  color: #fff;
  border-color: var(--accent-color);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-group label {
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
}

.form-group input, .form-group textarea {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
}

.form-group input:focus, .form-group textarea:focus {
  border-color: var(--accent-color);
  outline: none;
}

footer {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
  border-top: 1px solid var(--border-color);
  margin-top: 4rem;
}
`;

      // 2. SCRIPT.JS
      const scriptJs = `
// Dark/Light Theme Toggle
const toggleBtn = document.getElementById('theme-toggle');
if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    toggleBtn.textContent = isLight ? '☀️' : '🌙';
  });
}

// Contact Form Handler
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you! Your mock message was processed successfully.');
    form.reset();
  });
}

// Project Search Filter (Optional client helper)
function filterProjects(tag) {
  const cards = document.querySelectorAll('.project-card');
  const buttons = document.querySelectorAll('.filter-btn');
  
  buttons.forEach(btn => {
    if (btn.getAttribute('data-tag') === tag) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  cards.forEach(card => {
    if (tag === 'all') {
      card.style.display = 'block';
    } else {
      const technologies = card.getAttribute('data-tech').toLowerCase();
      if (technologies.includes(tag.toLowerCase())) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    }
  });
}
`;

      // 3. INDEX.HTML
      const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} | Portfolio</title>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap" rel="stylesheet">
</head>
<body>
  <header>
    <div class="nav-container">
      <a href="index.html" class="logo">${name}<span>.</span></a>
      <div class="nav-links">
        <a href="#about">About</a>
        <a href="#timeline">Timeline</a>
        <a href="projects.html">Projects</a>
        <button id="theme-toggle" class="theme-toggle-btn">🌙</button>
      </div>
    </div>
  </header>

  <main>
    <section class="hero-section">
      <div class="hero-badge">Welcome to my Portfolio</div>
      <h1>I'm ${name}</h1>
      <h2>${customTitle || 'Professional'}</h2>
      ${customTagline ? `<p class="hero-tagline">"${customTagline}"</p>` : ''}
      <a href="#contact" class="btn-primary">Get In Touch</a>
    </section>

    <div class="grid-layout">
      <!-- Left Area -->
      <div>
        <section id="about" class="card">
          <h3 class="section-title">About Me</h3>
          <p style="white-space: pre-wrap;">${customBio || 'Welcome to my professional portfolio site.'}</p>
        </section>

        <section id="timeline" class="card">
          <h3 class="section-title">Work Experience</h3>
          ${experiences.length === 0 ? '<p>No work history added.</p>' : experiences.map(exp => `
            <div class="timeline-item">
              <div class="timeline-role">${exp.role || 'Professional'}</div>
              <div class="timeline-company">${exp.company || ''} | ${exp.duration || ''}</div>
              <p class="timeline-desc">${exp.description || ''}</p>
            </div>
          `).join('')}
        </section>
      </div>

      <!-- Right Column -->
      <div>
        <section class="card">
          <h3 class="section-title">Expertise</h3>
          <div class="skills-list">
            ${skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
          </div>
        </section>

        ${showContactForm ? `
        <section id="contact" class="card">
          <h3 class="section-title">Contact Me</h3>
          <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 1rem;">
            Email: ${email}<br/>
            ${phone ? `Phone: ${phone}<br/>` : ''}
            ${location ? `Loc: ${location}<br/>` : ''}
          </p>
          <form id="contact-form" class="contact-form">
            <div class="form-group">
              <label>Name</label>
              <input type="text" required placeholder="Your Name">
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" required placeholder="your@email.com">
            </div>
            <div class="form-group">
              <label>Message</label>
              <textarea rows="4" required placeholder="Write your message..."></textarea>
            </div>
            <button type="submit" class="btn-primary" style="border:none; cursor:pointer;">Send Message</button>
          </form>
        </section>
        ` : ''}
      </div>
    </div>
  </main>

  <footer>
    <p>&copy; ${new Date().getFullYear()} ${name}. All rights reserved.</p>
  </footer>
  <script src="script.js"></script>
</body>
</html>`;

      // 4. PROJECTS.HTML
      const projectsHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} | Projects</title>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap" rel="stylesheet">
</head>
<body>
  <header>
    <div class="nav-container">
      <a href="index.html" class="logo">${name}<span>.</span></a>
      <div class="nav-links">
        <a href="index.html">Home</a>
        <a href="projects.html" class="active">Projects</a>
        <button id="theme-toggle" class="theme-toggle-btn">🌙</button>
      </div>
    </div>
  </header>

  <main>
    <section class="hero-section" style="padding: 2rem 0;">
      <h1>My Projects</h1>
      <p style="color: var(--text-secondary);">Showcase of my builds, utilities, and professional contributions.</p>
    </section>

    <!-- Project Filters -->
    <div class="filter-bar">
      <button class="filter-btn active" data-tag="all" onclick="filterProjects('all')">Show All</button>
      ${Array.from(new Set(customProjects.flatMap(p => p.technologies?.split(',').map(t => t.trim()) || []))).slice(0, 8).map(tag => `
        <button class="filter-btn" data-tag="${tag}" onclick="filterProjects('${tag}')">${tag}</button>
      `).join('')}
    </div>

    <!-- Grid -->
    <div class="projects-grid">
      ${customProjects.length === 0 ? '<p>No projects showcased.</p>' : customProjects.map(proj => `
        <div class="card project-card" data-tech="${proj.technologies || ''}">
          <h4 class="timeline-role" style="color: var(--accent-color);">${proj.title}</h4>
          <div class="timeline-company">${proj.duration || 'Internal'}</div>
          <p class="timeline-desc">${proj.description || ''}</p>
          <div class="skills-list" style="margin-top: 1rem;">
            ${(proj.technologies?.split(',') || []).map(tech => `<span class="skill-tag" style="font-size:0.65rem; padding:0.2rem 0.5rem;">${tech.trim()}</span>`).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  </main>

  <footer>
    <p>&copy; ${new Date().getFullYear()} ${name}. All rights reserved.</p>
  </footer>
  <script src="script.js"></script>
</body>
</html>`;

      // 5. README.MD
      const readmeMd = `# Standalone Web Portfolio - ${name}

This package contains the fully generated static site source code for your personal branding web portfolio.

## Contents
* \`index.html\`: Hero, about, work experience, expertise skills grid, contact handles, and working contact form container.
* \`projects.html\`: Project portfolio database grid with interactive client-side category tags filters.
* \`style.css\`: Mobile-responsive variables layout with dynamic \`${accentColor}\` colors.
* \`script.js\`: Standard helper script handling light/dark theme variables swaps and client filters.

## How to Run
Simply double-click \`index.html\` or open this project directory in any code editor (e.g. VS Code, WebStorm) and run via a local server extension (like Live Server).

## Deployment Options
This site is zero-dependency static HTML/CSS/JS and can be hosted immediately on:
1. **GitHub Pages:** Create a repository, upload these files, and enable Pages.
2. **Vercel / Netlify:** Drag-and-drop the directory into the dashboard to deploy instantly for free.
`;

      // Write files in Zip
      folder.file('index.html', indexHtml);
      folder.file('projects.html', projectsHtml);
      folder.file('style.css', styleCss);
      folder.file('script.js', scriptJs);
      folder.file('README.md', readmeMd);

      // Export blob
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `portfolio-${cleanUsername}.zip`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch(err) {
      console.error(err);
      alert('Failed to generate ZIP bundle: ' + err.message);
    } finally {
      setZipLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getPublicLink());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPublicLink = () => {
    if (!profile) return '';
    const host = window.location.origin;
    const identifier = profile.slug || profile.id;
    return `${host}/p/${identifier}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-themeText flex items-center gap-2">
            <Globe className="h-6 w-6 text-themePrimary" />
            Folio AI — Portfolio Builder
          </h1>
          <p className="text-xs text-themeTextSecondary mt-1">
            Build and export responsive web portfolios. Adjust accent shades, write custom bios, and download complete standalone source code.
          </p>
        </div>
        
        <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
          {profilesList.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xxs font-bold text-themeTextSecondary uppercase whitespace-nowrap flex items-center gap-1">
                <FolderOpen className="h-3.5 w-3.5 text-themePrimary" />
                Open Profile:
              </span>
              <select
                value={activeProfileId}
                onChange={(e) => handleProfileSelectInsideFolio(e.target.value)}
                className="p-2 rounded-theme border border-themeBorder bg-themeCard focus:outline-none focus:border-themePrimary text-xs text-themePrimary font-bold cursor-pointer"
              >
                {profilesList.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}

          {profile && (
            <button
              onClick={handleExportZip}
              disabled={zipLoading}
              className="flex items-center gap-2 py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-theme hover-lift transition-all shadow-md shrink-0 cursor-pointer disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {zipLoading ? 'Generating ZIP...' : 'Download Standalone Code (.ZIP)'}
            </button>
          )}
        </div>
      </div>

      {!profile ? (
        <div className="bg-themeCard border border-themeBorder rounded-[24px] p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-xl min-h-[400px]">
          <div className="p-4 bg-themePrimary/5 text-themePrimary rounded-full">
            <Globe className="h-10 w-10 animate-pulse" />
          </div>
          <h3 className="text-sm font-bold text-themeText">No Active Profile Selected</h3>
          <p className="text-xs text-themeTextSecondary max-w-sm leading-relaxed">
            Please choose or create a resume profile in the top navigation bar or select from your saved profiles below to initialize your web portfolio.
          </p>

          {profilesList.length > 0 && (
            <div className="pt-2 w-full max-w-xs space-y-2 text-left">
              <label className="block text-xxs font-bold text-themeTextSecondary uppercase pl-0.5">📂 Switch Active Profile</label>
              <select
                value={activeProfileId}
                onChange={(e) => handleProfileSelectInsideFolio(e.target.value)}
                className="w-full p-2.5 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-xs text-themeText cursor-pointer font-semibold"
              >
                <option value="" disabled>-- Choose a profile --</option>
                {profilesList.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.profession || 'No Title'})</option>
                ))}
              </select>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 animate-in fade-in duration-300">
          
          {/* Left Column: Settings Panel */}
          <div className="lg:col-span-6 bg-themeCard border border-themeBorder rounded-[24px] p-4 sm:p-6 space-y-5 sm:space-y-6 shadow-xl">
            <h2 className="text-sm font-bold text-themeText flex items-center gap-2 border-b border-themeBorder pb-2">
              <Settings className="h-4.5 w-4.5 text-themePrimary" />
              Portfolio Customizer
            </h2>

            {/* Quick Demo Scenarios Loader */}
            <div className="space-y-2 bg-themeBg/50 p-4 border border-themeBorder rounded-theme text-left">
              <label className="block text-[10px] font-black text-themeTextSecondary uppercase tracking-wider pl-0.5">⚡ Load Demo Scenario Template</label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { name: 'Jay', label: '🎮 Jay (Systems)' },
                  { name: 'Tarun', label: '💼 Tarun (Finance)' },
                  { name: 'Priya', label: '🎨 Priya (UI/UX)' },
                  { name: 'Amit', label: '📊 Amit (AI Eng)' },
                  { name: 'Rohan', label: '🚀 Rohan (PM)' }
                ].map(item => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleLoadDemoScenario(item.name)}
                    className="py-1.5 px-3 rounded-full bg-themeCard hover:bg-themePrimary hover:text-white border border-themeBorder text-[10px] font-bold transition-all cursor-pointer hover-lift"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom URL slug */}
            <div className="space-y-1">
              <label className="block text-xxs font-bold text-themeTextSecondary uppercase pl-0.5">Portfolio URL Slug</label>
              <div className="flex rounded-theme border border-themeBorder overflow-hidden bg-themeBg focus-within:border-themePrimary">
                <span className="bg-themeBorder/40 px-3 py-2.5 text-xxs text-themeTextSecondary font-semibold select-none flex items-center">
                  /p/
                </span>
                <input
                  type="text"
                  placeholder={profile.id.slice(0, 8)}
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                  className="w-full p-2.5 bg-transparent focus:outline-none text-xs text-themeText"
                />
              </div>
            </div>

            {/* Accent Color picker */}
            <div className="space-y-1.5">
              <label className="block text-xxs font-bold text-themeTextSecondary uppercase pl-0.5">Accent Color Colorway</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-10 h-10 border border-themeBorder bg-transparent rounded-theme cursor-pointer"
                />
                <span className="text-xs font-mono font-bold text-themeText uppercase bg-themeBg py-2 px-3 border border-themeBorder rounded-theme">
                  {accentColor}
                </span>
              </div>
            </div>

            {/* Layout Theme Buttons */}
            <div className="space-y-2">
              <label className="block text-xxs font-bold text-themeTextSecondary uppercase pl-0.5">Layout Theme</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFolioTheme('bento')}
                  className={`p-3.5 rounded-theme border text-xs font-bold leading-normal transition-all flex flex-col items-center gap-2 cursor-pointer ${
                    folioTheme === 'bento' ? 'border-themePrimary bg-themePrimary/5 text-themePrimary' : 'border-themeBorder bg-themeBg/40 text-themeTextSecondary hover:text-themeText'
                  }`}
                >
                  <LayoutGrid className="h-5 w-5" />
                  <span>Bento Dashboard</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFolioTheme('terminal')}
                  className={`p-3.5 rounded-theme border text-xs font-bold leading-normal transition-all flex flex-col items-center gap-2 cursor-pointer ${
                    folioTheme === 'terminal' ? 'border-themePrimary bg-themePrimary/5 text-themePrimary' : 'border-themeBorder bg-themeBg/40 text-themeTextSecondary hover:text-themeText'
                  }`}
                >
                  <Terminal className="h-5 w-5" />
                  <span>Cyber Terminal</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFolioTheme('executive')}
                  className={`p-3.5 rounded-theme border text-xs font-bold leading-normal transition-all flex flex-col items-center gap-2 cursor-pointer ${
                    folioTheme === 'executive' ? 'border-themePrimary bg-themePrimary/5 text-themePrimary' : 'border-themeBorder bg-themeBg/40 text-themeTextSecondary hover:text-themeText'
                  }`}
                >
                  <Briefcase className="h-5 w-5" />
                  <span>Modern Executive</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFolioTheme('glass')}
                  className={`p-3.5 rounded-theme border text-xs font-bold leading-normal transition-all flex flex-col items-center gap-2 cursor-pointer ${
                    folioTheme === 'glass' ? 'border-themePrimary bg-themePrimary/5 text-themePrimary' : 'border-themeBorder bg-themeBg/40 text-themeTextSecondary hover:text-themeText'
                  }`}
                >
                  <Globe className="h-5 w-5" />
                  <span>Clean Glassmorphism</span>
                </button>
              </div>
            </div>

            {/* Custom Narrative Overrides */}
            <div className="space-y-4 border-t border-themeBorder pt-4">
              <h3 className="text-xs font-bold text-themeText flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-themePrimary" />
                Portfolio Content & Bio Override
              </h3>
              
              <div className="space-y-1.5">
                <label className="block text-xxs font-bold text-themeTextSecondary uppercase pl-0.5">Professional Title Override</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder={profile.profession}
                  className="w-full p-3 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-xs text-themeText"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xxs font-bold text-themeTextSecondary uppercase pl-0.5">Tagline Override</label>
                <input
                  type="text"
                  value={customTagline}
                  onChange={(e) => setCustomTagline(e.target.value)}
                  placeholder={profile.tagline || 'Tagline'}
                  className="w-full p-3 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-xs text-themeText"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xxs font-bold text-themeTextSecondary uppercase pl-0.5">Biography Override</label>
                <textarea
                  rows={4}
                  value={customBio}
                  onChange={(e) => setCustomBio(e.target.value)}
                  placeholder={profile.bio || 'Provide a professional overview...'}
                  className="w-full p-3 rounded-theme border border-themeBorder bg-themeBg focus:outline-none focus:border-themePrimary text-xs text-themeText"
                />
              </div>

              {/* Project descriptions overrides */}
              {customProjects.length > 0 && (
                <div className="space-y-3 pt-2">
                  <label className="block text-xxs font-bold text-themeTextSecondary uppercase pl-0.5 flex items-center gap-1">
                    <AlignLeft className="h-3.5 w-3.5" />
                    Project Showcase Case-Studies overrides
                  </label>
                  <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                    {customProjects.map((proj, idx) => (
                      <div key={idx} className="p-3 bg-themeBg border border-themeBorder rounded-theme space-y-1.5">
                        <span className="text-[10px] font-bold text-themePrimary">{proj.title || `Project #${idx + 1}`}</span>
                        <textarea
                          rows={2}
                          value={proj.description}
                          onChange={(e) => {
                            const updated = [...customProjects];
                            updated[idx].description = e.target.value;
                            setCustomProjects(updated);
                          }}
                          placeholder="Project description case-study text..."
                          className="w-full p-2 rounded border border-themeBorder bg-themeCard focus:outline-none focus:border-themePrimary text-[11px] text-themeText"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Toggle Toggles */}
            <div className="space-y-3 border-t border-themeBorder pt-4">
              <label className="block text-xxs font-bold text-themeTextSecondary uppercase pl-0.5">Section Toggles</label>
              <div className="flex items-center justify-between text-xs font-semibold text-themeText">
                <span>Display Social Handles</span>
                <input
                  type="checkbox"
                  checked={showSocials}
                  onChange={(e) => setShowSocials(e.target.checked)}
                  className="w-4 h-4 text-themePrimary bg-themeBg border-themeBorder rounded cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-themeText">
                <span>Display GitHub Projects Showcase</span>
                <input
                  type="checkbox"
                  checked={showProjects}
                  onChange={(e) => setShowProjects(e.target.checked)}
                  className="w-4 h-4 text-themePrimary bg-themeBg border-themeBorder rounded cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-themeText">
                <span>Enable Contact Form Card</span>
                <input
                  type="checkbox"
                  checked={showContactForm}
                  onChange={(e) => setShowContactForm(e.target.checked)}
                  className="w-4 h-4 text-themePrimary bg-themeBg border-themeBorder rounded cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={handleSaveFolioSettings}
              disabled={saving}
              className="w-full py-3 bg-themePrimary hover:bg-themePrimaryDark text-white text-xs font-black rounded-theme shadow-md hover-lift transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {saving ? 'Saving configurations...' : 'Apply & Save Portfolio'}
            </button>
          </div>
          
          {/* Right Column: Live Links and Mock Preview Card */}
          <div className="lg:col-span-6 space-y-6">
            {/* Public Link Box */}
            <div className="bg-themeCard border border-themeBorder rounded-[24px] p-6 space-y-4 shadow-xl text-left">
              <h3 className="text-xs font-black text-themeTextSecondary uppercase tracking-widest pl-0.5">Your Public Website Link</h3>
              
              <div className="flex rounded-theme border border-themeBorder overflow-hidden bg-themeBg">
                <input
                  type="text"
                  readOnly
                  value={getPublicLink()}
                  className="w-full py-2.5 px-3 bg-transparent text-xs text-themeText font-mono outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="bg-themeBorder/40 hover:bg-themeBorder/60 px-4 py-2.5 text-xs font-bold text-themeText flex items-center gap-1 cursor-pointer transition-colors border-l border-themeBorder"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-green-500 font-extrabold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Clipboard className="h-4 w-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex justify-start">
                <a
                  href={getPublicLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-5 bg-themePrimary/10 border border-themePrimary/20 text-themePrimary hover:bg-themePrimary hover:text-white transition-all duration-300 font-extrabold text-xs rounded-theme flex items-center gap-1.5"
                >
                  <Eye className="h-4 w-4" />
                  View Public Web Portfolio
                </a>
              </div>
            </div>

            {/* Visual preview box representing the chosen layout */}
            <div className="bg-themeCard border border-themeBorder rounded-[24px] p-6 shadow-xl space-y-4">
              <h3 className="text-xs font-black text-themeTextSecondary uppercase tracking-widest pl-0.5">Theme Layout Mapping Mock</h3>
              
              <div className="border border-themeBorder/60 rounded-theme bg-themeBg/40 p-6 flex flex-col justify-between min-h-[300px] text-center items-center relative overflow-hidden">
                {folioTheme === 'bento' && (
                  <div className="space-y-4 w-full">
                    <div className="grid grid-cols-3 gap-3 w-full">
                      <div className="col-span-2 bg-themeCard border border-themeBorder rounded-theme p-4 h-24 flex items-center justify-center font-bold text-xs" style={{ borderLeftColor: accentColor, borderLeftWidth: 4 }}>Bio & Details</div>
                      <div className="bg-themeCard border border-themeBorder rounded-theme p-4 h-24 flex items-center justify-center font-bold text-xs">Profile</div>
                      <div className="bg-themeCard border border-themeBorder rounded-theme p-4 h-20 flex items-center justify-center font-bold text-xs">Skills</div>
                      <div className="col-span-2 bg-themeCard border border-themeBorder rounded-theme p-4 h-20 flex items-center justify-center font-bold text-xs">Projects</div>
                    </div>
                    <span className="text-[10px] text-themeTextSecondary block mt-3 font-bold uppercase tracking-wider">Theme Selected: Bento Dashboard Grid Layout</span>
                  </div>
                )}

                {folioTheme === 'terminal' && (
                  <div className="space-y-3 w-full text-left font-mono bg-black/80 p-5 rounded-theme text-green-400 border border-green-500/20 leading-relaxed text-xs min-h-[220px]">
                    <div>&gt; initialize portfolio --theme cyber-terminal</div>
                    <div className="text-white">&gt; loading profile: {profile.name || 'Candidate'}</div>
                    <div>&gt; profession: {customTitle || profile.profession || 'Engineer'}</div>
                    <div className="text-yellow-400">&gt; skills: [{skills.slice(0, 4).join(', ')}]</div>
                    <div>&gt; loading social handles: {showSocials ? 'active' : 'disabled'}</div>
                    <div>&gt; contacts: {profile.contact_email || 'anonymous@domain.io'}</div>
                    <div className="animate-pulse text-green-400 mt-2">_</div>
                    <span className="text-[10px] text-themeTextSecondary block mt-6 font-bold font-sans uppercase tracking-wider">Theme Selected: Cyber Hacker Terminal Theme</span>
                  </div>
                )}

                {folioTheme === 'executive' && (
                  <div className="space-y-4 w-full text-left p-2">
                    <div className="flex justify-between items-center border-b border-themeBorder/40 pb-3">
                      <div className="h-3 w-32 bg-themeText rounded"></div>
                      <div className="flex gap-2">
                        <div className="h-2 w-6 bg-themeBorder rounded"></div>
                        <div className="h-2 w-6 bg-themeBorder rounded"></div>
                      </div>
                    </div>
                    <div className="space-y-2 p-2">
                      <div className="h-4 w-48 bg-themeText rounded" style={{ backgroundColor: accentColor }}></div>
                      <div className="h-2.5 w-full bg-themeTextSecondary/40 rounded"></div>
                      <div className="h-2.5 w-5/6 bg-themeTextSecondary/40 rounded"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="h-16 border border-themeBorder rounded-theme p-3 bg-themeCard/60 flex items-center justify-center font-bold text-[10px]">Work History</div>
                      <div className="h-16 border border-themeBorder rounded-theme p-3 bg-themeCard/60 flex items-center justify-center font-bold text-[10px]">Education</div>
                    </div>
                    <span className="text-[10px] text-themeTextSecondary text-center block mt-3 font-bold uppercase tracking-wider">Theme Selected: Modern Corporate Executive layout</span>
                  </div>
                )}

                {folioTheme === 'glass' && (
                  <div className="space-y-4 w-full relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-blue-500/10 rounded-theme -z-10 animate-pulse"></div>
                    <div className="p-6 bg-themeCard/40 border border-white/5 rounded-theme shadow-lg backdrop-blur-md max-w-sm mx-auto space-y-3">
                      <div className="w-12 h-12 bg-white/10 rounded-full mx-auto flex items-center justify-center font-black text-white" style={{ border: `2px solid ${accentColor}` }}>
                        {profile.name?.slice(0, 1).toUpperCase()}
                      </div>
                      <div className="h-3 w-28 bg-white rounded mx-auto"></div>
                      <div className="h-2 w-48 bg-white/60 rounded mx-auto"></div>
                      <div className="flex justify-center gap-1.5 pt-2">
                        <span className="h-5 w-12 rounded bg-white/10 text-[9px] font-bold text-white flex items-center justify-center">skills</span>
                        <span className="h-5 w-12 rounded bg-white/10 text-[9px] font-bold text-white flex items-center justify-center">projects</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-themeTextSecondary block mt-3 font-bold uppercase tracking-wider">Theme Selected: Clean Glassmorphism Layout</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

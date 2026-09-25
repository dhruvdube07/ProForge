/**
 * Dynamic UI Typography Engine
 * Provides real-time switching of typography personalities across the entire ProfileForge app.
 */

export const UI_FONT_MODES = [
  {
    id: 'executive',
    name: 'Executive Pro',
    category: 'SaaS Modern',
    badge: 'Recommended',
    headingFont: 'Plus Jakarta Sans',
    bodyFont: 'Plus Jakarta Sans',
    desc: 'Silicon Valley tech aesthetic. Crisp, highly legible, authoritative precision.',
    sample: 'High-impact product strategy & executive leadership',
    previewGlyph: 'Aa'
  },
  {
    id: 'futuristic',
    name: 'Futuristic Neo',
    category: 'Geometric Tech',
    badge: 'Neo-Grotesque',
    headingFont: 'Space Grotesk',
    bodyFont: 'Outfit',
    desc: 'Striking geometry, wide apertures, sleek sci-fi elegance.',
    sample: 'Autonomous AI architectures & neural pipelines',
    previewGlyph: 'Øx'
  },
  {
    id: 'studio',
    name: 'Studio Avant-Garde',
    category: 'Creative Editorial',
    badge: 'Distinct Flair',
    headingFont: 'Syne',
    bodyFont: 'Plus Jakarta Sans',
    desc: 'Architectural display headers with luxury editorial character.',
    sample: 'Bespoke design systems & aesthetic direction',
    previewGlyph: 'S&'
  },
  {
    id: 'tech',
    name: 'Tech Terminal',
    category: 'Developer Grade',
    badge: 'Code & Metrics',
    headingFont: 'Space Grotesk',
    bodyFont: 'Space Grotesk',
    desc: 'Precision monospace accents, engineering focus, terminal crispness.',
    sample: 'Low-latency distributed systems & microservices',
    previewGlyph: '>_'
  },
  {
    id: 'bricolage',
    name: 'Bricolage Vibe',
    category: 'Contemporary Grotesque',
    badge: 'Charismatic',
    headingFont: 'Bricolage Grotesque',
    bodyFont: 'DM Sans',
    desc: 'Rich personality, dynamic curves, lively contemporary flair.',
    sample: 'Bold product narratives & brand velocity',
    previewGlyph: 'Bq'
  },
  {
    id: 'swiss',
    name: 'Swiss Minimal',
    category: 'International Style',
    badge: 'Clean Focus',
    headingFont: 'Inter',
    bodyFont: 'Inter',
    desc: 'Disciplined, neutral, pure functional modernism.',
    sample: 'Objective clarity & focused typography',
    previewGlyph: 'Ii'
  }
];

export const THEME_DEFAULT_FONTS = {
  luna: 'futuristic',
  moon: 'studio',
  solara: 'executive',
  aurora: 'bricolage',
  nebula: 'studio',
  cyber: 'tech',
  glacier: 'futuristic',
  vulcan: 'executive',
  forest: 'bricolage',
  monochrome: 'swiss'
};

export const getStoredUiFont = () => {
  return localStorage.getItem('pf_ui_font_mode') || 'executive';
};

export const setUiFont = (mode) => {
  const valid = UI_FONT_MODES.some(m => m.id === mode);
  const targetMode = valid ? mode : 'executive';
  
  localStorage.setItem('pf_ui_font_mode', targetMode);
  document.documentElement.setAttribute('data-font-mode', targetMode);
  
  // Toggle class on documentElement for styling
  UI_FONT_MODES.forEach(m => {
    document.documentElement.classList.remove(`font-mode-${m.id}`);
  });
  document.documentElement.classList.add(`font-mode-${targetMode}`);

  // Broadcast event so UI re-renders reactively across all tabs and components
  window.dispatchEvent(new CustomEvent('pfUiFontChanged', { detail: { mode: targetMode } }));
  return targetMode;
};

export const initUiFont = () => {
  const current = getStoredUiFont();
  setUiFont(current);
};

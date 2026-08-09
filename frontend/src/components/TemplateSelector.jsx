import React, { useState } from 'react';
import { LayoutGrid, X, Check } from 'lucide-react';

const layoutBases = ['modern', 'classic', 'creative', 'executive', 'minimalist', 'vibrant gradient', 'bordered slate'];

const colorSchemes = [
  { name: 'Teal Forest', primary: '#0D9488', secondary: '#14B8A6', accent: '#F59E0B', bg: '#F0FDF4', text: '#1F2937', border: '#E5E7EB' },
  { name: 'Royal Navy', primary: '#1E3A8A', secondary: '#3B82F6', accent: '#93C5FD', bg: '#EFF6FF', text: '#1E293B', border: '#DBEAFE' },
  { name: 'Charcoal Minimal', primary: '#1E293B', secondary: '#64748B', accent: '#0F172A', bg: '#FFFFFF', text: '#334155', border: '#F1F5F9' },
  { name: 'Sunset Gradient', primary: '#EA580C', secondary: '#F97316', accent: '#EAB308', bg: '#FFF7ED', text: '#1E293B', border: '#FFEDD5' },
  { name: 'Slate Bordered', primary: '#475569', secondary: '#64748B', accent: '#3B82F6', bg: '#F8FAFC', text: '#0F172A', border: '#CBD5E1' },
  { name: 'Creative Amethyst', primary: '#6D28D9', secondary: '#8B5CF6', accent: '#10B981', bg: '#F5F3FF', text: '#1F2937', border: '#EDE9FE' },
  { name: 'Plum Gold', primary: '#581C87', secondary: '#7E22CE', accent: '#EAB308', bg: '#FAF5FF', text: '#1F2937', border: '#F3E8FF' },
  { name: 'Vintage Sepia', primary: '#451A03', secondary: '#78350F', accent: '#B45309', bg: '#FFFBEB', text: '#1C1917', border: '#FEF3C7' },
  { name: 'Emerald Premium', primary: '#064E3B', secondary: '#059669', accent: '#F59E0B', bg: '#ECFDF5', text: '#0F2922', border: '#D1FAE5' },
  { name: 'Nordic Frost', primary: '#0369A1', secondary: '#0284C7', accent: '#0D9488', bg: '#F0F9FF', text: '#1F2937', border: '#E0F2FE' },
  { name: 'Cyberpunk Pink', primary: '#DB2777', secondary: '#2563EB', accent: '#06B6D4', bg: '#FDF2F8', text: '#0F172A', border: '#FCE7F3' },
  { name: 'Earthy Olive', primary: '#3F6212', secondary: '#4D7C0F', accent: '#854D0E', bg: '#F7FEE7', text: '#1F2937', border: '#ECFDF5' },
  { name: 'Crimson Bold', primary: '#991B1B', secondary: '#B91C1C', accent: '#D97706', bg: '#FFF7ED', text: '#1F2937', border: '#FFEDD5' },
  { name: 'Rose Grace', primary: '#9D174D', secondary: '#C2185B', accent: '#CA8A04', bg: '#FFF1F2', text: '#1F2937', border: '#FFE4E6' },
  { name: 'Steel Tech', primary: '#0F172A', secondary: '#1E293B', accent: '#3B82F6', bg: '#F8FAFC', text: '#0F172A', border: '#CBD5E1' }
];

const generateTemplatesLibrary = () => {
  const lib = [];
  layoutBases.forEach((layout) => {
    colorSchemes.forEach((scheme) => {
      const id = `${layout}-${scheme.name.toLowerCase().replace(/ /g, '-')}`;
      const name = `${scheme.name} ${layout.charAt(0).toUpperCase() + layout.slice(1)}`;
      const icon = layout === 'modern' ? '⚡' : layout === 'classic' ? '📄' : layout === 'creative' ? '🎨' : layout === 'executive' ? '💼' : layout === 'minimalist' ? '◽' : layout === 'vibrant gradient' ? '🌅' : '🗂️';
      
      lib.push({
        id,
        name,
        desc: `Bespoke ${scheme.name} styling with a ${layout} structure layout.`,
        icon,
        category: layout === 'executive' || layout === 'modern' ? 'Corporate & Executive' : layout === 'creative' || layout === 'vibrant gradient' ? 'Creative & Startup' : layout === 'classic' || layout === 'bordered slate' ? 'Luxury & Vintage' : 'Minimalist & Nordic',
        layout
      });
    });
  });
  return lib;
};

export default function TemplateSelector({ value = 'modern-teal-forest', onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const templates = generateTemplatesLibrary();

  // Render top 3 directly in selection bar
  const visibleIds = ['modern-teal-forest', 'classic-royal-navy', 'creative-plum-gold'];
  const visibleTemplates = templates.filter(t => visibleIds.includes(t.id));
  
  // Custom fallback checks for backward compatibility
  const activeTemplate = templates.find(t => t.id === value?.toLowerCase()) || 
                         templates.find(t => t.id.startsWith(value?.toLowerCase())) ||
                         templates[0];

  // Resolve color scheme from value (safely fallback to active template's color scheme)
  const currentColorMatch = colorSchemes.find(c => {
    const idSnippet = c.name.toLowerCase().replace(/ /g, '-');
    return value?.toLowerCase().endsWith(idSnippet);
  }) || colorSchemes[0];

  // Group templates by category
  const categories = [...new Set(templates.map(t => t.category))];

  const handleColorChange = (newColorName) => {
    const colorId = newColorName.toLowerCase().replace(/ /g, '-');
    // Combine active template layout with the selected color scheme
    onChange(`${activeTemplate.layout}-${colorId}`);
  };

  return (
    <div className="space-y-4 text-left">
      
      {/* 1. Resume Template selection */}
      <div className="space-y-2">
        <label className="block text-[10px] font-bold text-themeTextSecondary uppercase tracking-widest pl-1">
          Resume Template Layout (100+ styles)
        </label>
        
        <div className="grid grid-cols-2 gap-2">
          {visibleTemplates.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => onChange(tpl.id)}
              className={`p-2.5 text-left rounded-theme border text-[10px] transition-all duration-300 hover-lift cursor-pointer ${
                value?.toLowerCase() === tpl.id
                  ? 'border-themePrimary bg-themePrimary/10 text-themePrimary font-bold ring-1 ring-themePrimary'
                  : 'border-themeBorder bg-themeCard text-themeTextSecondary hover:border-themePrimary'
              }`}
            >
              <div className="flex items-center gap-1 font-bold truncate">
                <span>{tpl.icon}</span>
                <span>{tpl.name.split(' ')[0]}</span>
              </div>
            </button>
          ))}

          {/* "+ 100 More" Selector Button */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className={`p-2.5 text-center rounded-theme border border-dashed text-[10px] transition-all duration-300 hover-lift cursor-pointer flex items-center justify-center gap-1 font-bold ${
              !visibleIds.includes(value?.toLowerCase())
                ? 'border-themePrimary bg-themePrimary/15 text-themePrimary ring-1 ring-themePrimary'
                : 'border-themeBorder text-themePrimary bg-themeBg hover:bg-themePrimary hover:text-white'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span className="truncate">
              {!visibleIds.includes(value?.toLowerCase()) ? activeTemplate.name.split(' ').slice(0, 2).join(' ') : '+ 100 More'}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Color Palette override selector */}
      <div className="space-y-2">
        <label className="block text-[10px] font-bold text-themeTextSecondary uppercase tracking-widest pl-1">
          Customize Palette Theme
        </label>
        <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1 scroll-premium border border-themeBorder rounded-theme p-2 bg-themeBg/50">
          {colorSchemes.map((c) => {
            const isActive = currentColorMatch.name === c.name;
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => handleColorChange(c.name)}
                className={`p-2 rounded-theme border text-[9px] transition-all duration-300 hover-lift cursor-pointer flex items-center justify-between gap-1.5 text-left font-bold ${
                  isActive
                    ? 'border-themePrimary bg-themePrimary/10 text-themeText ring-1 ring-themePrimary'
                    : 'border-themeBorder bg-themeCard text-themeTextSecondary hover:border-themePrimary'
                }`}
              >
                <span className="truncate">{c.name}</span>
                <div className="flex gap-0.5 flex-shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: c.primary }} />
                  <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: c.secondary }} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* CATALOG POPUP MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-themeCard border border-themeBorder rounded-[24px] w-full max-w-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 text-left flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-themeBorder pb-3 flex-shrink-0">
              <div>
                <h3 className="text-base font-bold text-themeText flex items-center gap-2">
                  <LayoutGrid className="h-4.5 w-4.5 text-themePrimary" />
                  Select Resume Style (105 Available Templates)
                </h3>
                <p className="text-xxs text-themeTextSecondary mt-0.5">Choose a layout base template format.</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-themeBg text-themeTextSecondary hover:text-themeText transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body - Scrollable Categories */}
            <div className="overflow-y-auto pr-1 space-y-6 flex-1 py-2 scroll-premium">
              {categories.map((category) => (
                <div key={category} className="space-y-2">
                  <h4 className="text-xxs font-bold text-themePrimary uppercase tracking-widest pl-1">
                    {category}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {templates
                      .filter((t) => t.category === category)
                      .map((tpl) => (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => {
                            onChange(tpl.id);
                            setIsOpen(false);
                          }}
                          className={`p-3 text-left rounded-theme border transition-all duration-300 flex items-center gap-3 cursor-pointer w-full relative group ${
                            value?.toLowerCase() === tpl.id
                              ? 'border-themePrimary bg-themePrimary/10 text-themeText ring-1 ring-themePrimary'
                              : 'border-themeBorder bg-themeCard text-themeTextSecondary hover:border-themePrimary'
                          }`}
                        >
                          <span className="text-xl p-1.5 bg-themeBg border border-themeBorder rounded-theme flex items-center justify-center w-10 h-10 flex-shrink-0">
                            {tpl.icon}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="font-extrabold text-xs text-themeText flex items-center gap-1">
                              {tpl.name}
                              {value?.toLowerCase() === tpl.id && <Check className="h-3 w-3 text-themePrimary flex-shrink-0" />}
                            </div>
                            <div className="text-[10px] text-themeTextSecondary mt-0.5 leading-normal truncate group-hover:text-clip group-hover:whitespace-normal">
                              {tpl.desc}
                            </div>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

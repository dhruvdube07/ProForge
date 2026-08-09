import React, { useState } from 'react';
import { Type, X, Check } from 'lucide-react';

const fontsList = [
  // --- Sans-Serif (40 fonts) ---
  { id: 'inter', name: 'Inter Style', category: 'Sans-Serif', desc: 'Modern & crisp sans-serif' },
  { id: 'poppins', name: 'Poppins Rounded', category: 'Sans-Serif', desc: 'Friendly, creative & rounded' },
  { id: 'roboto', name: 'Roboto Clean', category: 'Sans-Serif', desc: 'Symmetrical, clean, highly readable' },
  { id: 'open sans', name: 'Open Sans', category: 'Sans-Serif', desc: 'Versatile, balanced, classic' },
  { id: 'montserrat', name: 'Montserrat Bold', category: 'Sans-Serif', desc: 'Geometric, strong & modern' },
  { id: 'outfit', name: 'Outfit Clean', category: 'Sans-Serif', desc: 'Minimalist, sleek, geometric curves' },
  { id: 'lato', name: 'Lato Neutral', category: 'Sans-Serif', desc: 'Warm, corporate sans-serif style' },
  { id: 'nunito', name: 'Nunito Curved', category: 'Sans-Serif', desc: 'Soft rounded sans-serif' },
  { id: 'rubik', name: 'Rubik Blocky', category: 'Sans-Serif', desc: 'Thick rounded digital font' },
  { id: 'heebo', name: 'Heebo Tech', category: 'Sans-Serif', desc: 'Slightly blocky tech typography' },
  { id: 'work sans', name: 'Work Sans', category: 'Sans-Serif', desc: 'Optimized for user interfaces' },
  { id: 'dm sans', name: 'DM Sans', category: 'Sans-Serif', desc: 'Low contrast geometric' },
  { id: 'plus jakarta sans', name: 'Plus Jakarta', category: 'Sans-Serif', desc: 'Modern startup aesthetic' },
  { id: 'urbanist', name: 'Urbanist Geometric', category: 'Sans-Serif', desc: 'Avant-garde editorial sans' },
  { id: 'cabin', name: 'Cabin Sans', category: 'Sans-Serif', desc: 'Humanist, clean curves' },
  { id: 'raleway', name: 'Raleway Classy', category: 'Sans-Serif', desc: 'Thin lines, high-society style' },
  { id: 'quicksand', name: 'Quicksand Soft', category: 'Sans-Serif', desc: 'Comfortable rounded lettering' },
  { id: 'assistant', name: 'Assistant Simple', category: 'Sans-Serif', desc: 'Minimalist clean interface font' },
  { id: 'manrope', name: 'Manrope Pro', category: 'Sans-Serif', desc: 'Geometric modern workhorse' },
  { id: 'kanit', name: 'Kanit Bold', category: 'Sans-Serif', desc: 'Slightly formal, thick lines' },
  { id: 'ubuntu', name: 'Ubuntu Tech', category: 'Sans-Serif', desc: 'Techy curved typeface' },
  { id: 'arimo', name: 'Arimo Neo', category: 'Sans-Serif', desc: 'Excellent readability fallback' },
  { id: 'signika', name: 'Signika Graphic', category: 'Sans-Serif', desc: 'Warm, low-contrast curves' },
  { id: 'josefin sans', name: 'Josefin Elegant', category: 'Sans-Serif', desc: 'Art deco geometric layout' },
  { id: 'comfortaa', name: 'Comfortaa Rounded', category: 'Sans-Serif', desc: 'Ultra-round circle letters' },
  { id: 'questrial', name: 'Questrial Circle', category: 'Sans-Serif', desc: 'Simple geometric circles' },
  { id: 'varela round', name: 'Varela Round', category: 'Sans-Serif', desc: 'Highly readable rounded text' },
  { id: 'albert sans', name: 'Albert Modern', category: 'Sans-Serif', desc: 'Nordic functional design' },
  { id: 'spline sans', name: 'Spline Clean', category: 'Sans-Serif', desc: 'Slick digital styling' },
  { id: 'figtree', name: 'Figtree Friendly', category: 'Sans-Serif', desc: 'Clean, approachable typeface' },
  { id: 'readex pro', name: 'Readex Pro', category: 'Sans-Serif', desc: 'Low-contrast geometric sans' },
  { id: 'lexend', name: 'Lexend Read', category: 'Sans-Serif', desc: 'Engineered for reading comfort' },
  { id: 'fira sans', name: 'Fira Sans', category: 'Sans-Serif', desc: 'Technical & readable typeface' },
  { id: 'pt sans', name: 'PT Sans', category: 'Sans-Serif', desc: 'Universal sans-serif style' },
  { id: 'source sans 3', name: 'Source Sans', category: 'Sans-Serif', desc: 'Adobe standards for UI' },
  { id: 'mulish', name: 'Mulish Geometric', category: 'Sans-Serif', desc: 'Minimalist neutral sans-serif' },
  { id: 'barlow', name: 'Barlow Condensed', category: 'Sans-Serif', desc: 'Slightly tall, clean headers' },
  { id: 'karla', name: 'Karla Clean', category: 'Sans-Serif', desc: 'Approachable geometric quirks' },
  { id: 'hind', name: 'Hind Bold', category: 'Sans-Serif', desc: 'Monolinear UI typography' },
  { id: 'teko', name: 'Teko Condensed', category: 'Sans-Serif', desc: 'Tall, blocky corporate headers' },

  // --- Serif (35 fonts) ---
  { id: 'lora', name: 'Lora Editorial', category: 'Serif', desc: 'Elegant, scholarly, premium serif' },
  { id: 'playfair display', name: 'Playfair Display', category: 'Serif', desc: 'Elegant, high-contrast serif' },
  { id: 'merriweather', name: 'Merriweather', category: 'Serif', desc: 'Sturdy, readable digital serif' },
  { id: 'pt serif', name: 'PT Serif', category: 'Serif', desc: 'Formal, traditional serif style' },
  { id: 'georgia', name: 'Georgia Classic', category: 'Serif', desc: 'Standard business serif font' },
  { id: 'garamond', name: 'Garamond Fine', category: 'Serif', desc: 'Historic, editorial book typeface' },
  { id: 'crimson text', name: 'Crimson Text', category: 'Serif', desc: 'Classic literature typography' },
  { id: 'bitter', name: 'Bitter Slab', category: 'Serif', desc: 'Slab-serif optimized for screens' },
  { id: 'cinzel', name: 'Cinzel Roman', category: 'Serif', desc: 'Roman stone-carved capitals' },
  { id: 'noto serif', name: 'Noto Serif', category: 'Serif', desc: 'Highly legible universal serif' },
  { id: 'cormorant garamond', name: 'Cormorant', category: 'Serif', desc: 'High-luxury, sharp serif details' },
  { id: 'eb garamond', name: 'EB Garamond', category: 'Serif', desc: 'Noble Renaissance style book serif' },
  { id: 'cardo', name: 'Cardo Scholarly', category: 'Serif', desc: 'Classic old-style academic font' },
  { id: 'domine', name: 'Domine Editorial', category: 'Serif', desc: 'Robust digital news style' },
  { id: 'dm serif display', name: 'DM Serif', category: 'Serif', desc: 'High impact display serif' },
  { id: 'playfair', name: 'Playfair Classic', category: 'Serif', desc: 'Traditional editorial layout' },
  { id: 'libre baskerville', name: 'Libre Baskerville', category: 'Serif', desc: 'Classic English serif revival' },
  { id: 'arvo', name: 'Arvo Slab', category: 'Serif', desc: 'Geometric blocky slab serif' },
  { id: 'zilla slab', name: 'Zilla Slab', category: 'Serif', desc: 'Tech-slab with curved edges' },
  { id: 'tinos', name: 'Tinos Serif', category: 'Serif', desc: 'Compact business reading style' },
  { id: 'alfa slab one', name: 'Alfa Slab One', category: 'Serif', desc: 'Ultra-black blocky slab serif' },
  { id: 'poly', name: 'Poly Serif', category: 'Serif', desc: 'Short, clean classic serif' },
  { id: 'prata', name: 'Prata Elegant', category: 'Serif', desc: 'Teardrop terminals, luxury style' },
  { id: 'alice', name: 'Alice Vintage', category: 'Serif', desc: 'Quirky editorial vintage serif' },
  { id: 'quattrocento', name: 'Quattrocento', category: 'Serif', desc: 'Classic architectural serif' },
  { id: 'vollkorn', name: 'Vollkorn Sturdy', category: 'Serif', desc: 'Sturdy, heavy-duty digital serif' },
  { id: 'neuton', name: 'Neuton Serif', category: 'Serif', desc: 'Clean, narrow, Dutch style serif' },
  { id: 'noto serif georgian', name: 'Noto Georgian', category: 'Serif', desc: 'Scholarly international serif' },
  { id: 'charis sil', name: 'Charis SIL', category: 'Serif', desc: 'Readable book-printing standard' },
  { id: 'gentium book plus', name: 'Gentium Book', category: 'Serif', desc: 'Warm old-style book typeface' },
  { id: 'faustina', name: 'Faustina Serif', category: 'Serif', desc: 'Slightly slanted modern serif' },
  { id: 'fraunces', name: 'Fraunces Retro', category: 'Serif', desc: 'Retro, high-contrast creative serif' },
  { id: 'spectral', name: 'Spectral Tech', category: 'Serif', desc: 'Sleek, screen-first digital serif' },
  { id: 'sanchez', name: 'Sanchez Slab', category: 'Serif', desc: 'Friendly rounded slab-serif' },
  { id: 'petrona', name: 'Petrona Sharp', category: 'Serif', desc: 'Sharp, thin high-prestige serif' },

  // --- Monospace & Tech (15 fonts) ---
  { id: 'fira code', name: 'Fira Code', category: 'Monospace', desc: 'Developer font with clean lines' },
  { id: 'source code pro', name: 'Source Code Pro', category: 'Monospace', desc: 'Adobe standard coding style' },
  { id: 'courier prime', name: 'Courier Prime', category: 'Monospace', desc: 'True typewriter classic look' },
  { id: 'inconsolata', name: 'Inconsolata Mono', category: 'Monospace', desc: 'Beautiful, sleek developer mono' },
  { id: 'roboto mono', name: 'Roboto Mono', category: 'Monospace', desc: 'Clean, technical, screen-first' },
  { id: 'share tech mono', name: 'Share Tech Mono', category: 'Monospace', desc: 'Retro-futuristic arcade styling' },
  { id: 'space mono', name: 'Space Mono', category: 'Monospace', desc: 'Eccentric geometric tech coding' },
  { id: 'ibm plex mono', name: 'IBM Plex Mono', category: 'Monospace', desc: 'Corporate tech monospace look' },
  { id: 'pt mono', name: 'PT Monospace', category: 'Monospace', desc: 'Structured formal monospace' },
  { id: 'jetbrains mono', name: 'JetBrains Mono', category: 'Monospace', desc: 'Engineered for developer reading' },
  { id: 'anonymous pro', name: 'Anonymous Pro', category: 'Monospace', desc: 'Classic typewriter style code' },
  { id: 'nova mono', name: 'Nova Mono', category: 'Monospace', desc: 'Highly stylized display mono' },
  { id: 'major mono display', name: 'Major Mono', category: 'Monospace', desc: 'Abstract minimalist geometry' },
  { id: 'cutive mono', name: 'Cutive Typewriter', category: 'Monospace', desc: 'Vintage mechanical typewriter' },
  { id: 'vt323', name: 'VT323 Pixel', category: 'Monospace', desc: 'Classic 80s arcade terminal' },

  // --- Creative / Display (15 fonts) ---
  { id: 'pacifico', name: 'Pacifico Script', category: 'Creative/Display', desc: 'Brush script retro casual look' },
  { id: 'great vibes', name: 'Great Vibes', category: 'Creative/Display', desc: 'Elegant high-society calligraphy' },
  { id: 'sacramento', name: 'Sacramento Thin', category: 'Creative/Display', desc: 'Handwritten wireframe cursive' },
  { id: 'lobster', name: 'Lobster Bold', category: 'Creative/Display', desc: 'Bold vintage advertising script' },
  { id: 'fredoka', name: 'Fredoka Bubble', category: 'Creative/Display', desc: 'Friendly bold bubble style' },
  { id: 'righteous', name: 'Righteous Art Deco', category: 'Creative/Display', desc: 'Art-deco geometric display' },
  { id: 'shadows into light', name: 'Shadows Light', category: 'Creative/Display', desc: 'Neat personal handwriting' },
  { id: 'caveat', name: 'Caveat Hand', category: 'Creative/Display', desc: 'Natural quick note handwriting' },
  { id: 'dancing script', name: 'Dancing Script', category: 'Creative/Display', desc: 'Casual bouncy script typeface' },
  { id: 'indie flower', name: 'Indie Flower', category: 'Creative/Display', desc: 'Carefree handwriting font' },
  { id: 'satisfy', name: 'Satisfy Elegant', category: 'Creative/Display', desc: 'Rich luxury script lettering' },
  { id: 'amatic sc', name: 'Amatic Hand', category: 'Creative/Display', desc: 'Tall hand-drawn capital letters' },
  { id: 'permanent marker', name: 'Permanent Marker', category: 'Creative/Display', desc: 'Thick bold marker signing style' },
  { id: 'concert one', name: 'Concert One', category: 'Creative/Display', desc: 'Rounded display poster font' },
  { id: 'kaushan script', name: 'Kaushan Script', category: 'Creative/Display', desc: 'Expressive raw brush strokes' }
];

export default function FontSelector({ value = 'inter', onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const visibleFonts = fontsList.slice(0, 3);
  const activeFont = fontsList.find(f => f.id === value?.toLowerCase()) || fontsList[0];
  const categories = [...new Set(fontsList.map(f => f.category))];

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-themeTextSecondary uppercase tracking-wider">
        Font Style Typography
      </label>
      
      <div className="grid grid-cols-2 gap-2">
        {visibleFonts.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => onChange(f.id)}
            style={{ fontFamily: f.id }}
            className={`p-2.5 text-center rounded-theme border text-xs transition-all duration-300 hover-lift cursor-pointer ${
              value?.toLowerCase() === f.id
                ? 'border-themePrimary bg-themePrimary/10 text-themePrimary font-bold ring-1 ring-themePrimary'
                : 'border-themeBorder bg-themeCard text-themeTextSecondary hover:border-themePrimary'
            }`}
          >
            {f.name.split(' ')[0]}
          </button>
        ))}

        {/* "+ 100 More" Selector Button */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`p-2.5 text-center rounded-theme border border-dashed text-[10px] transition-all duration-300 hover-lift cursor-pointer flex items-center justify-center gap-1 font-bold ${
            !visibleFonts.some(f => f.id === value?.toLowerCase())
              ? 'border-themePrimary bg-themePrimary/15 text-themePrimary'
              : 'border-themeBorder text-themePrimary bg-themeBg hover:bg-themePrimary hover:text-white'
          }`}
        >
          <Type className="h-3.5 w-3.5" />
          <span>{!visibleFonts.some(f => f.id === value?.toLowerCase()) ? activeFont.name.split(' ')[0] : '+ 100 More'}</span>
        </button>
      </div>

      {/* CATALOG POPUP MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-themeCard border border-themeBorder rounded-[24px] w-full max-w-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 text-left flex flex-col max-h-[90vh]">
            
            <div className="flex justify-between items-center border-b border-themeBorder pb-3 flex-shrink-0">
              <div>
                <h3 className="text-base font-bold text-themeText flex items-center gap-2">
                  <Type className="h-4.5 w-4.5 text-themePrimary" />
                  Select Font Typography (100+ Google Fonts)
                </h3>
                <p className="text-xxs text-themeTextSecondary mt-0.5">Choose a bespoke font to elevate the professionalism of your resume.</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-themeBg text-themeTextSecondary hover:text-themeText transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable category list */}
            <div className="overflow-y-auto pr-1 space-y-6 flex-1 py-2 scroll-premium">
              {categories.map((category) => (
                <div key={category} className="space-y-2">
                  <h4 className="text-xxs font-bold text-themePrimary uppercase tracking-widest pl-1">
                    {category}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {fontsList
                      .filter((f) => f.category === category)
                      .map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => {
                            onChange(f.id);
                            setIsOpen(false);
                          }}
                          style={{ fontFamily: f.id }}
                          className={`p-3 text-left rounded-theme border transition-all duration-300 flex items-center gap-3 cursor-pointer w-full relative ${
                            value?.toLowerCase() === f.id
                              ? 'border-themePrimary bg-themePrimary/10 text-themeText ring-1 ring-themePrimary'
                              : 'border-themeBorder bg-themeCard text-themeTextSecondary hover:border-themePrimary'
                          }`}
                        >
                          <span className="text-lg p-1.5 bg-themeBg border border-themeBorder rounded-theme flex items-center justify-center w-9 h-9 flex-shrink-0 text-themePrimary font-bold">
                            Aa
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="font-extrabold text-xs text-themeText flex items-center gap-1">
                              {f.name}
                              {value?.toLowerCase() === f.id && <Check className="h-3 w-3 text-themePrimary flex-shrink-0" />}
                            </div>
                            <div className="text-[10px] text-themeTextSecondary mt-0.5 leading-normal font-sans truncate">
                              {f.desc}
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

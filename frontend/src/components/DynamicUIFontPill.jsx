import React, { useState, useRef, useEffect } from 'react';
import { Type, Check, Sparkles, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useDynamicUI } from '../hooks/useDynamicUI';

export default function DynamicUIFontPill() {
  const { uiFontMode, activeFontMode, fontModes, changeUiFont } = useDynamicUI();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Dynamic Font Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-themeBorder bg-themeCard/80 hover:bg-themeCard text-themeText text-xs font-semibold backdrop-blur-md transition-all duration-300 hover:border-themePrimary/50 hover:shadow-sm cursor-pointer group"
        title="Change Dynamic UI Typography Mode"
        aria-label="UI Typography Engine"
      >
        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-themePrimary/15 text-themePrimary text-[10px] font-bold group-hover:scale-110 transition-transform">
          Aa
        </span>
        <span className="hidden sm:inline font-heading font-medium tracking-tight">
          {activeFontMode.name}
        </span>
        <ChevronDown className={`h-3 w-3 text-themeTextSecondary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[calc(100vw-1.5rem)] max-w-sm sm:w-96 rounded-2xl glass-panel p-3.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 text-left border border-themeBorder/80">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-themeBorder">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-themePrimary/15 text-themePrimary">
                <Type className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-heading font-bold text-themeText flex items-center gap-1.5">
                  Dynamic UI Typography
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-themePrimary/20 text-themePrimary font-mono uppercase tracking-wider">
                    Live Engine
                  </span>
                </h4>
                <p className="text-[10px] text-themeTextSecondary">
                  Instantly morphs typography and layout across the entire interface
                </p>
              </div>
            </div>
          </div>

          {/* List of Personalities */}
          <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1 scroll-premium">
            {fontModes.map((mode) => {
              const isSelected = uiFontMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => {
                    changeUiFont(mode.id);
                    setIsOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all duration-200 flex items-start gap-2.5 cursor-pointer relative group ${
                    isSelected
                      ? 'border-themePrimary bg-themePrimary/10 shadow-sm ring-1 ring-themePrimary/40'
                      : 'border-themeBorder/60 bg-themeBg/40 hover:bg-themeCard hover:border-themePrimary/30'
                  }`}
                >
                  {/* Distinct Glyph Badge */}
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 transition-transform group-hover:scale-105 ${
                      isSelected
                        ? 'bg-themePrimary text-white shadow-sm'
                        : 'bg-themeCard text-themePrimary border border-themeBorder'
                    }`}
                    style={{ fontFamily: mode.headingFont }}
                  >
                    {mode.previewGlyph}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className="text-xs font-bold text-themeText truncate"
                        style={{ fontFamily: mode.headingFont }}
                      >
                        {mode.name}
                      </span>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-themeBg border border-themeBorder text-themeTextSecondary">
                          {mode.category}
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-themePrimary text-white flex items-center justify-center">
                            <Check className="h-2.5 w-2.5" />
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-[10px] text-themeTextSecondary line-clamp-1 mt-0.5">
                      {mode.desc}
                    </p>

                    <div
                      className="text-[11px] text-themeText/80 font-medium truncate mt-1 pt-1 border-t border-themeBorder/30"
                      style={{ fontFamily: mode.bodyFont }}
                    >
                      "{mode.sample}"
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="mt-2.5 pt-2 border-t border-themeBorder/60 flex items-center justify-between text-[10px] text-themeTextSecondary px-1">
            <span className="flex items-center gap-1 font-mono text-[9px]">
              <Sparkles className="h-3 w-3 text-themePrimary" />
              Dynamic optical kerning active
            </span>
            <span className="font-mono text-[9px] opacity-75">
              CSS Token Driven
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

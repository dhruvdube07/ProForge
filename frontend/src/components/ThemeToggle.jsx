import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('pf_theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const useDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    
    setIsDark(useDark);
    if (useDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('pf_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('pf_theme', 'light');
    }
    window.dispatchEvent(new Event('pfThemeModeChanged'));
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-full border border-themeBorder bg-themeCard/80 hover:bg-themeCard text-themeText hover:border-themePrimary/50 shadow-sm backdrop-blur-md transition-all duration-300 hover-lift cursor-pointer flex items-center justify-center group"
      aria-label="Toggle theme mode"
      title={isDark ? "Switch to Radiant Light Mode" : "Switch to Slate Dark Mode"}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Sun className="h-4.5 w-4.5 text-amber-400 group-hover:rotate-45 group-hover:scale-110 transition-all duration-300" />
        ) : (
          <Moon className="h-4.5 w-4.5 text-themePrimary group-hover:-rotate-12 group-hover:scale-110 transition-all duration-300" />
        )}
      </div>
    </button>
  );
}

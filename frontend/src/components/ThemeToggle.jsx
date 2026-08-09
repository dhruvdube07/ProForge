import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('pf_theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const useDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    
    setIsDark(useDark);
    if (useDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pf_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pf_theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-theme glass-panel hover-lift text-themePrimary hover:bg-themePrimaryLight hover:text-white transition-all duration-300"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-5 w-5 animate-pulse" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}

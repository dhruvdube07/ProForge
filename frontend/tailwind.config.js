/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,誠,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class', // Toggle dark theme via class 'dark'
  theme: {
    extend: {
      colors: {
        themePrimary: 'var(--color-primary)',
        themePrimaryLight: 'var(--color-primary-light)',
        themePrimaryDark: 'var(--color-primary-dark)',
        themeSecondary: 'var(--color-secondary)',
        themeBg: 'var(--color-bg)',
        themeCard: 'var(--color-card)',
        themeText: 'var(--color-text)',
        themeTextSecondary: 'var(--color-text-secondary)',
        themeBorder: 'var(--color-border)',
      },
      borderRadius: {
        'theme': 'var(--radius-custom, 12px)'
      },
      fontFamily: {
        sans: ['var(--font-ui-sans)', 'Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['var(--font-ui-heading)', 'Plus Jakarta Sans', 'sans-serif'],
        display: ['var(--font-ui-display)', 'Outfit', 'sans-serif'],
        mono: ['var(--font-ui-mono)', 'JetBrains Mono', 'Fira Code', 'monospace'],
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        syne: ['Syne', 'sans-serif'],
        tech: ['Space Grotesk', 'sans-serif'],
        bricolage: ['Bricolage Grotesque', 'sans-serif'],
        dmsans: ['DM Sans', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        openSans: ['Open Sans', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
        lora: ['Lora', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'float-reverse': 'floatReverse 10s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'shimmer-sweep': 'shimmer 2.5s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-15px) scale(1.03)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(15px) scale(0.97)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.08)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      }
    },
  },
  plugins: [],
}

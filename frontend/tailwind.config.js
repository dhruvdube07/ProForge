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
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        openSans: ['Open Sans', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}

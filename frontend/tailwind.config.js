/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef4ff',
          100: '#dae7ff',
          200: '#b9d1ff',
          300: '#8ab1ff',
          400: '#5a8bff',
          500: '#2f63f6', // main gov blue
          600: '#1f4bd8',
          700: '#193bab',
          800: '#17318a',
          900: '#182c6f',
        },
        success: { 500: '#1aa768', 100: '#e2f6ec' },
        warning: { 500: '#e08a1e', 100: '#fdf0dc' },
        danger:  { 500: '#e0413f', 100: '#fbe2e2' },
        surface: '#f4f6fb',
      },
      fontFamily: {
        sans: ['"Noto Sans Thai"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        card: '0 2px 10px 0 rgba(23, 49, 138, 0.06)',
        cardHover: '0 8px 24px 0 rgba(23, 49, 138, 0.12)',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0, transform: 'translateY(4px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
      animation: {
        fadeIn: 'fadeIn .25s ease-out',
      },
    },
  },
  plugins: [],
}

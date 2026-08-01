/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        accent: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        secondary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
          950: '#500724',
        },
        background: {
          light: '#f8fafc',
          dark: '#0a0f1e',
          'dark-secondary': '#111827',
          'dark-tertiary': '#1e293b',
        },
        surface: {
          light: '#ffffff',
          dark: '#111827',
          'dark-glass': 'rgba(17,24,39,0.6)',
        },
        text: {
          primary: {
            light: '#0f172a',
            dark: '#f8fafc',
          },
          secondary: {
            light: '#475569',
            dark: '#94a3b8',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'var(--font-fira-code)', 'monospace'],
      },
      boxShadow: {
        'glow-primary': '0 0 30px rgba(139, 92, 246, 0.35)',
        'glow-accent': '0 0 30px rgba(34, 211, 238, 0.35)',
        'glow-secondary': '0 0 30px rgba(244, 114, 182, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'gradient-shift': 'gradientShift 15s ease infinite',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'spin-slow': 'spinSlow 12s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        spinSlow: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      zIndex: {
        modal: '1000',
        toast: '1100',
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  
  // Enable dark mode using class strategy
  darkMode: 'class',
  
  theme: {
    extend: {
      // Color palette from PRD
      colors: {
        // Primary colors
        primary: {
          50: '#E6F0FF',
          100: '#CCE0FF',
          200: '#99C2FF',
          300: '#66A3FF',
          400: '#3385FF',
          500: '#0A84FF', // Primary blue
          600: '#0077FF',
          700: '#0066E6',
          800: '#0055CC',
          900: '#003399',
          950: '#001A4D',
        },
        
        // Accent colors (orange)
        accent: {
          50: '#FFF3E6',
          100: '#FFE0CC',
          200: '#FFCC99',
          300: '#FFB366',
          400: '#FF9500', // Accent orange
          500: '#E68600',
          600: '#CC7000',
          700: '#995500',
          800: '#663A00',
          900: '#331D00',
        },
        
        // Background colors
        background: {
          light: '#F7F9FC',
          dark: '#111111',
        },
        
        // Surface colors
        surface: {
          light: '#FFFFFF',
          dark: '#1E1E1E',
        },
        
        // Text colors
        text: {
          primary: {
            light: '#111111',
            dark: '#EBEBEB',
          },
          secondary: {
            light: '#5F5F5F',
            dark: '#A0A0A0',
          },
        },
        
        // Border colors
        border: {
          light: '#E2E8F0',
          dark: '#2D2D2D',
        },
      },
      
      // Typography from PRD
      fontFamily: {
        sans: ['Inter', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'var(--font-fira-code)', 'monospace'],
      },
      
      // Font sizes from PRD
      fontSize: {
        'heading-xl': ['2.5rem', { lineHeight: '1.2', fontWeight: '600' }],
        'heading-lg': ['1.75rem', { lineHeight: '1.3', fontWeight: '500' }],
        'heading-md': ['1.5rem', { lineHeight: '1.4', fontWeight: '500' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'code': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
      },
      
      // Spacing system (4px baseline grid)
      spacing: {
        '0': '0',
        '1': '0.25rem', // 4px
        '2': '0.5rem',  // 8px
        '3': '0.75rem', // 12px
        '4': '1rem',    // 16px
        '5': '1.25rem', // 20px
        '6': '1.5rem',  // 24px
        '8': '2rem',    // 32px
        '10': '2.5rem', // 40px
        '12': '3rem',   // 48px
        '16': '4rem',   // 64px
        '20': '5rem',   // 80px
        '24': '6rem',   // 96px
      },
      
      // Border radius
      borderRadius: {
        'sm': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      
      // Box shadows
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
      
      // Animation durations
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      
      // Keyframes for animations
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      
      // Transition timing
      transitionDuration: {
        'fast': '150ms',
        'normal': '200ms',
        'slow': '300ms',
      },
      
      // Z-index scale
      zIndex: {
        '0': '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        'modal': '1000',
        'toast': '1100',
      },
    },
  },
  
  plugins: [],
};
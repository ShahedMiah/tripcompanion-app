/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // WAYFARE Glassmorphism Design System
        // Translucent, layered, ethereal aesthetics
        // Inspired by: iOS Control Centre, Stripe Dashboard, Modern Fintech

        // Primary: Deep ocean blue
        primary: {
          50: 'rgba(30, 58, 95, 0.05)',
          100: 'rgba(30, 58, 95, 0.1)',
          200: 'rgba(30, 58, 95, 0.2)',
          300: 'rgba(30, 58, 95, 0.4)',
          400: '#2D4A6F',
          500: '#1E3A5F',
          600: '#162D4A',
          700: '#0F2035',
          800: '#081420',
          900: '#040A10',
          DEFAULT: '#1E3A5F',
        },

        // Violet: Soft purple accent
        violet: {
          50: 'rgba(124, 58, 237, 0.05)',
          100: 'rgba(124, 58, 237, 0.1)',
          200: 'rgba(124, 58, 237, 0.2)',
          300: 'rgba(124, 58, 237, 0.4)',
          400: '#8B5CF6',
          500: '#7C3AED',
          600: '#6D28D9',
          700: '#5B21B6',
          800: '#4C1D95',
          900: '#3B0F7A',
          DEFAULT: '#7C3AED',
        },

        // Aurora: Cyan/teal accent for highlights
        aurora: {
          50: 'rgba(6, 182, 212, 0.05)',
          100: 'rgba(6, 182, 212, 0.1)',
          200: 'rgba(6, 182, 212, 0.2)',
          300: 'rgba(6, 182, 212, 0.4)',
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
          700: '#0E7490',
          DEFAULT: '#06B6D4',
        },

        // Glass surface colours
        glass: {
          white: 'rgba(255, 255, 255, 0.1)',
          'white-md': 'rgba(255, 255, 255, 0.15)',
          'white-lg': 'rgba(255, 255, 255, 0.25)',
          dark: 'rgba(0, 0, 0, 0.1)',
          'dark-md': 'rgba(0, 0, 0, 0.2)',
          'dark-lg': 'rgba(0, 0, 0, 0.4)',
          border: 'rgba(255, 255, 255, 0.2)',
          'border-light': 'rgba(255, 255, 255, 0.1)',
          'border-strong': 'rgba(255, 255, 255, 0.3)',
        },

        // Surface colours for layered depth
        surface: {
          base: '#0A1628',
          elevated: '#0F1D32',
          overlay: 'rgba(15, 29, 50, 0.8)',
        },

        // Semantic with glass tints
        success: {
          DEFAULT: '#10B981',
          glass: 'rgba(16, 185, 129, 0.2)',
        },
        warning: {
          DEFAULT: '#F59E0B',
          glass: 'rgba(245, 158, 11, 0.2)',
        },
        error: {
          DEFAULT: '#EF4444',
          glass: 'rgba(239, 68, 68, 0.2)',
        },
        info: {
          DEFAULT: '#3B82F6',
          glass: 'rgba(59, 130, 246, 0.2)',
        },
      },
      fontFamily: {
        sans: ['System'],
      },
      borderRadius: {
        'glass': '24px',
        'glass-sm': '16px',
        'glass-lg': '32px',
      },
      boxShadow: {
        // Soft glow shadows for glass effect
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glass-sm': '0 4px 16px rgba(0, 0, 0, 0.2)',
        'glass-lg': '0 12px 48px rgba(0, 0, 0, 0.4)',
        'glass-glow': '0 0 40px rgba(124, 58, 237, 0.3)',
        'glass-glow-cyan': '0 0 40px rgba(6, 182, 212, 0.3)',
        'glass-inset': 'inset 0 1px 1px rgba(255, 255, 255, 0.1)',
        'none': 'none',
      },
      backdropBlur: {
        'glass': '20px',
        'glass-sm': '10px',
        'glass-lg': '40px',
      },
    },
  },
  plugins: [],
};

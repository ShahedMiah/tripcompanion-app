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
        // MINIMAL BRUTALIST Design System
        // Raw, honest, anti-corporate aesthetic

        // Core palette - high contrast, no compromise
        black: '#000000',
        white: '#FFFFFF',

        // Accent: Electric Yellow - bold, attention-grabbing
        accent: {
          DEFAULT: '#FACC15',
          hover: '#EAB308',
          muted: '#FEF9C3',
        },

        // Danger: Raw Red
        danger: {
          DEFAULT: '#EF4444',
          hover: '#DC2626',
          muted: '#FEE2E2',
        },

        // Grays - minimal, functional
        gray: {
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          500: '#737373',
          700: '#404040',
          900: '#171717',
        },
      },
      fontFamily: {
        sans: ['System'],
        mono: ['Courier'],
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #000000',
        'brutal-sm': '2px 2px 0px 0px #000000',
        'brutal-lg': '6px 6px 0px 0px #000000',
        'brutal-accent': '4px 4px 0px 0px #FACC15',
        'brutal-white': '4px 4px 0px 0px #FFFFFF',
      },
    },
  },
  plugins: [],
};

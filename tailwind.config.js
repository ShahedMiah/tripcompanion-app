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
        // WAYFARE Brand Identity
        // A sophisticated travel brand with warmth and adventure

        // Primary: Deep Teal - evokes ocean depths, adventure, trust
        primary: {
          50: '#F0FDFC',
          100: '#CCFBF6',
          200: '#99F6EC',
          300: '#5EEAD9',
          400: '#2DD4BF',
          500: '#0D9488', // Main brand color
          600: '#0F766E',
          700: '#115E59',
          800: '#134E4A',
          900: '#1A3B38',
          950: '#0D2826',
        },

        // Secondary: Warm Sand - evokes beaches, maps, warmth
        sand: {
          50: '#FEFDFB',
          100: '#FDF8F0',
          200: '#F9EDDC',
          300: '#F3DEC2',
          400: '#E8C899',
          500: '#D4A574', // Accent
          600: '#C08B54',
          700: '#A06E3C',
          800: '#7D5530',
          900: '#5C3F24',
        },

        // Tertiary: Sunset Coral - energy, excitement, memorable moments
        coral: {
          50: '#FFF5F3',
          100: '#FFE8E4',
          200: '#FFD5CD',
          300: '#FFB5A6',
          400: '#FF8A73',
          500: '#F06449', // Highlight
          600: '#D94B31',
          700: '#B53921',
          800: '#93301E',
          900: '#7A2C1E',
        },

        // Neutral: Slate with warm undertones
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },

        // Semantic colors with brand personality
        success: '#059669', // Emerald for confirmations
        warning: '#D97706', // Amber for alerts
        error: '#DC2626',   // Red for errors
        info: '#0891B2',    // Cyan for info
      },
      fontFamily: {
        sans: ['System'],
        display: ['System'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 30px -5px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 40px -10px rgba(13, 148, 136, 0.4)',
      },
    },
  },
  plugins: [],
};

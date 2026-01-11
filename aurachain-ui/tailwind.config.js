/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Clean professional look
        mono: ['JetBrains Mono', 'monospace'], // For data/tech elements
        heading: ['DM Sans', 'sans-serif'], // For main titles
      },
      colors: {
        primary: {
          DEFAULT: '#4A90E2', // Warm Blue
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#4A90E2',
          600: '#3B82F6',
          700: '#2563EB',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        accent: {
          teal: '#14B8A6',   // Success
          amber: '#F59E0B',  // Warning/Processing
          coral: '#EF4444',  // Error
          slate: '#64748B',  // Neutral
        },
        // Light mode semantic backgrounds
        light: {
          bg: '#FFFFFF',
          surface: '#F8FAFC',
          elevated: '#F1F5F9',
          border: '#E2E8F0',
        },
        // Dark mode semantic backgrounds
        dark: {
          bg: '#0A0A0A',     // True Black
          surface: '#1A1A1A', // Dark Charcoal
          elevated: '#2A2A2A', // Medium Charcoal
          border: '#334155',
        }
      },
      animation: {
        'slide-in': 'slideIn 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        }
      }
    },
  },
  plugins: [],
}
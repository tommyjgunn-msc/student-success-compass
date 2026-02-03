/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary palette - warm, approachable
        compass: {
          50: '#fdf8f3',
          100: '#faeee0',
          200: '#f4dbc1',
          300: '#ecc298',
          400: '#e2a26b',
          500: '#d9874a',
          600: '#cb6f3f',
          700: '#a95636',
          800: '#874632',
          900: '#6d3b2b',
          950: '#3a1c14',
        },
        // Accent - teal for growth/support
        growth: {
          50: '#effefb',
          100: '#c8fff4',
          200: '#91feea',
          300: '#53f5dc',
          400: '#20e3c9',
          500: '#07c7b0',
          600: '#03a091',
          700: '#077f76',
          800: '#0b645f',
          900: '#0e534f',
          950: '#003432',
        },
        // Semantic colors
        surface: {
          DEFAULT: '#fefdfb',
          secondary: '#f9f6f1',
          tertiary: '#f0ebe3',
        },
        ink: {
          DEFAULT: '#2c2416',
          secondary: '#5c5347',
          tertiary: '#8a8278',
          muted: '#b8b2a8',
        },
        // Traffic light system
        signal: {
          green: '#16a34a',
          'green-bg': '#dcfce7',
          yellow: '#ca8a04',
          'yellow-bg': '#fef9c3',
          red: '#dc2626',
          'red-bg': '#fee2e2',
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
      },
    },
  },
  plugins: [],
}

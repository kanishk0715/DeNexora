/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
      },
      letterSpacing: {
        ledger: '0.08em',
      },
      colors: {
        /* Neem / tulsi green — professional AYUSH, not lime */
        forest: {
          50: '#f4f6ef',
          100: '#e4eadc',
          200: '#c9d5bc',
          300: '#9fb496',
          400: '#6d8d6c',
          500: '#4a6d52',
          600: '#3a5843',
          700: '#2c4536',
          800: '#1f3328',
          900: '#16241c',
          950: '#0c1611',
        },
        /* Turmeric / sandalwood gold */
        saffron: {
          50: '#fbf6ea',
          100: '#f4ead0',
          200: '#e6d3a4',
          300: '#d4b56a',
          400: '#c49a45',
          500: '#b0892f',
          600: '#927024',
          700: '#74581d',
          800: '#564216',
          900: '#3b2d10',
        },
        cream: {
          50: '#fbf8f1',
          100: '#f3ece0',
          200: '#e5d6c0',
          300: '#d2bc96',
        },
        /* Warm umber ink */
        ink: {
          50: '#f8f5f0',
          100: '#efe8de',
          200: '#ddd2c4',
          300: '#c4b5a4',
          400: '#9a8876',
          500: '#736557',
          600: '#584c42',
          700: '#3f362f',
          800: '#2a241f',
          900: '#1a1612',
        },
        copper: {
          50: '#f8efe9',
          100: '#edd9cc',
          500: '#a35c2a',
          700: '#7a3f1c',
        },
        ayush: {
          primary: '#2c4536',
          secondary: '#927024',
          accent: '#a35c2a',
          gold: '#c49a45',
        },
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(28, 23, 18, 0.08), 0 1px 2px -1px rgba(28, 23, 18, 0.06)',
        'card-hover': '0 12px 24px -8px rgba(31, 51, 40, 0.18)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        parchment: 'linear-gradient(180deg, #fbf8f1 0%, #f4f6ef 45%, #f3ece0 100%)',
      },
    },
  },
  plugins: [],
};

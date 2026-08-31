/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        ledger: '0.08em',
      },
      colors: {
        forest: {
          50: '#eef4fb',
          100: '#d9e8f6',
          200: '#b3d0ec',
          300: '#7aafdb',
          400: '#3d8ac4',
          500: '#2563a8',
          600: '#1d4e89',
          700: '#173e6c',
          800: '#133456',
          900: '#0f2842',
        },
        saffron: {
          50: '#f7f1ec',
          100: '#eadbd0',
          200: '#d4b8a0',
          300: '#c49a7a',
          400: '#b07d5a',
          500: '#8f6246',
          600: '#734e38',
          700: '#573b2b',
        },
        cream: {
          50: '#ffffff',
          100: '#f4f6f9',
          200: '#e7ebf1',
        },
        ink: {
          500: '#64748b',
          700: '#334155',
          900: '#0f172a',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 40, 66, 0.05), 0 8px 24px rgba(15, 40, 66, 0.06)',
      },
    },
  },
  plugins: [],
};

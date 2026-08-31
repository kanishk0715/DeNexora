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
          50: '#eef6f1',
          100: '#d5eadc',
          200: '#add4bb',
          300: '#75b490',
          400: '#3d8a62',
          500: '#1f6b47',
          600: '#16553d',
          700: '#124433',
          800: '#0f3629',
          900: '#0c2b21',
        },
        saffron: {
          50: '#fef6ee',
          100: '#fde8d4',
          200: '#f9cc9e',
          300: '#f4a85c',
          400: '#ee8a2e',
          500: '#e07016',
          600: '#c45c26',
          700: '#9a4518',
        },
        cream: {
          50: '#fffdf9',
          100: '#faf6f0',
          200: '#f0e6d8',
        },
        ink: {
          500: '#6b5e52',
          700: '#3f342c',
          900: '#1c1410',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(22, 85, 61, 0.05), 0 8px 24px rgba(22, 85, 61, 0.08)',
      },
    },
  },
  plugins: [],
};

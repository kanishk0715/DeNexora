/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
      },
      colors: {
        forest: {
          50: '#eef6f2',
          100: '#d5e9de',
          200: '#a8d0bb',
          300: '#6eae8f',
          400: '#3d8a68',
          500: '#1f6b4d',
          600: '#16553d',
          700: '#143d32',
          800: '#0f2f27',
          900: '#0b221c',
        },
        saffron: {
          50: '#fdf6ee',
          100: '#f8e6d1',
          200: '#f0c89a',
          300: '#e8b86d',
          400: '#d9923c',
          500: '#c45c26',
          600: '#a8481c',
          700: '#863716',
        },
        cream: {
          50: '#fdfbf7',
          100: '#f7f1e8',
          200: '#efe4d2',
        },
        ink: {
          500: '#57534e',
          700: '#3f3a36',
          900: '#1c1917',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(20, 61, 50, 0.06), 0 12px 32px rgba(20, 61, 50, 0.06)',
        lift: '0 18px 40px rgba(20, 61, 50, 0.14)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.6s ease-out both',
      },
    },
  },
  plugins: [],
};

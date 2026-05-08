/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef3f9',
          100: '#d5e1f0',
          200: '#aec5e3',
          300: '#7fa2d0',
          400: '#4a7ab8',
          500: '#223959',
          600: '#1d3150',
          700: '#1a2d47',
          800: '#14233a',
          900: '#0e1a2d',
        },
        soft: {
          blue: '#9ACEE2',
          'blue-light': '#b8dded',
        },
        accent: {
          DEFAULT: '#1FAB78',
          light: '#25c98d',
          dark: '#178b60',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

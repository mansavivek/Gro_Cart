/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Public Sans', 'sans-serif'],
        display: ['Public Sans', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#34A853',
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        'background-light': '#f8f6f6',
        'background-dark': '#221610',
        'gro-green': '#2e8b57',
        'gro-orange': '#f37021',
      },
      borderRadius: {
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}

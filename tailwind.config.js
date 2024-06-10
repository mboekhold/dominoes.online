/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: [],
  theme: {
    extend: {
      keyframes: {
        slideInFromRight: {
          '0%': { transform: 'translateX(100%)'},
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        slideInFromRight: 'slideInFromRight 1s ease-out',
      },
    },
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: [],
  theme: {
    extend: {
      colors: {
        'custom-dark': '#16161e',
        'custom-dark-2': '#1b1b24',
        'custom-dark-3': '#22222b',
      }
    },
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: [],
  theme: {
    extend: {
      colors: {
        // Background
        'night-dark': '#16161e',
        // Foreground
        'night-dark-2': '#1b1b24',
        // Buttons, Inputs, etc.
        'night-dark-3': '#22222b',
      }
    },
  },
  plugins: [],
}


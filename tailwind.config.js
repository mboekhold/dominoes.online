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
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-15deg)' },
          '50%': { transform: 'rotate(15deg)' },
        },
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out 7',
      }
    },
    plugins: [],
  }
}
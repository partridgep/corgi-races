/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'corgi-red-50': '#fcebde',
        'corgi-red-100': '#f7decc',
        'corgi-red-200': '#eaba94',
        'corgi-red-400': '#e68714',
        'corgi-red': '#c36e1c',
        'corgi-red-dark': '#c36e1c',
        'secondary-200': '#2d8bb6',
        'secondary': '#1E5C79',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
  darkMode: ['selector'],
}


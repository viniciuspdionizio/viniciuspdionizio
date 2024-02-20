/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')


module.exports = {
  content: ["./src/**/*.{html,js}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'background': colors.blue['900'],
        'foreground': '#ddd',
        'primary': colors.indigo['600'],
        'primary-hover': colors.indigo['400'],
      },
    },
  },
  plugins: [],
}


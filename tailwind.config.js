/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')


module.exports = {
  content: ["./src/**/*.{html,js}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        mono: ['Kode Mono', 'monospace'],
        handwriting: ['Dancing Script', 'cursive'],
      },
      colors: {
        'dark-bg': '#090514',      // Fundo escuro premium (tom roxo bem sutil)
        'dark-card': '#120d24',    // Fundo dos cards escuros
        'dark-border': '#221a3b',  // Bordas sutis
        'primary': '#8b5cf6',      // Roxo/violeta vibrante
        'primary-hover': '#a78bfa',
        'accent': '#06b6d4',       // Ciano elétrico para detalhes
        'foreground': '#f3f4f6',   // Texto principal quase branco
        'muted': '#9ca3af',        // Texto secundário cinza
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
      }
    },
  },
  plugins: [],
}


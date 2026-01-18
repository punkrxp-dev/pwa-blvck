/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./contexts/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'punk-black': '#000000',
        'punk-white': '#FFFFFF',
        'punk-steel': '#A8A8A8',
        'punk-gold': '#D4AF37',
      },
      backgroundImage: {
        'punk-gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F2D479 50%, #D4AF37 100%)',
      }
    },
  },
  plugins: [],
}


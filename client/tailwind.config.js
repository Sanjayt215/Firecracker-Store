/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fire-red': '#DC2626',
        'fire-orange': '#F97316',
        'fire-yellow': '#FBBF24',
      }
    },
  },
  plugins: [],
}




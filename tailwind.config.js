/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blanc': '#FFFFFF',
        'noir': '#000000',
        'vert': '#008000',
        'gris-clair': '#D3D3D3',
      }
    },
  },
  plugins: [],
}
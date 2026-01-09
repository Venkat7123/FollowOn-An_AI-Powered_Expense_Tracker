/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // 👈 This tells Tailwind where to look for class names
  ],
  theme: {
    extend: {}, // You can add custom colors, fonts, etc. here later
  },
  plugins: [],
}

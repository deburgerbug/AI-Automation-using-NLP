/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // ← This ONE line fixes everything!
  theme: {
    extend: {}, // You can add custom colors here if needed
  },
  plugins: [],
}
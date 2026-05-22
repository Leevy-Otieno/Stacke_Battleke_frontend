/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'surface': '#151F32',
        'main': '#0B1120',
      }
    },
  },
  plugins: [],
}
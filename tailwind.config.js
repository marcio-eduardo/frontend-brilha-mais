/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#1e1b4b', // deep indigo from the design
          primary: '#4338ca', // indigo
          secondary: '#3730a3',
          accent: '#fbbf24', // yellow/orange for highlights/trophies
          green: '#22c55e',
          red: '#ef4444',
          gray: '#f3f4f6',
        }
      }
    },
  },
  plugins: [],
}

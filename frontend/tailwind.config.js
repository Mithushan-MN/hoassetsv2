/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
      },
      colors: {
        zinc: {
          850: '#1f1f23',
        },
      },
    },
  },
  plugins: [],
}
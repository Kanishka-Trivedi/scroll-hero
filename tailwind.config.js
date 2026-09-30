/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        trailGreen: '#45db7d',
        roadDark: '#1e1e1e',
        trackBg: '#d1d1d1',
        bgDark: '#121212',
      },
    },
  },
  plugins: [],
};

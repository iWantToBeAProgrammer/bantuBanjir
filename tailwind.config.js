/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  daisyui: {
    themes: ["aqua"]
  },

  theme: {
    extend: {
      backgroundImage: {
        'bg-hero': "url('/assets/images/bg-hero.jpg')"
      }
    },
  },
  plugins: [require('daisyui')],
}
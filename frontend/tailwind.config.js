/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './public/index.html',
    './src/**/*.{js,jsx,ts,tsx}',


  ],
  theme: {
    extend: {

    },

    container: {
      padding: {
        md: "10rem",
      }
    }
  },
  plugins: [],
}


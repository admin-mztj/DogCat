/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Fredoka', 'sans-serif'],
        body: ['Nunito', 'sans-serif']
      },
      colors: {
        primary: '#F97316',
        secondary: '#FB923C',
        'cat-primary': '#FFB347',
        'dog-primary': '#8B4513'
      }
    }
  },
  plugins: []
};

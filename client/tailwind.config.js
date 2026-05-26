/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sidebar: '#0052CC',
        'sidebar-dark': '#003884',
        'sidebar-hover': '#0747A6',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        hueso: '#faf9f7',
        nieve: '#ffffff',
        tinta: '#1b1a18',
        suave: '#8b857d',
        borde: '#ebe7e2',
        acento: '#3f6c7a',
        'acento-claro': '#eaf1f3',
        dia: '#b57a35',
        'dia-claro': '#fbf3e7',
        noche: '#4a4e7c',
        'noche-claro': '#eeeef7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

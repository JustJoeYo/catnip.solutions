/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        popclr: '#080c45',
        mainclr: '#060a36',
        textclr: '#b3b3b3',
        outlineclr: '#808080',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}

const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      vulcan: '#111720',
      mirage: {
        100:'#192030',
        200:'#151A29'
      },
      red: '#FA2F5B',
      green: '#00FF86',
      black: colors.black,
      white: colors.white,
      gray: "#828DA7",
      purple:'#8226CE',
      orange: '#FB9D63'
    },
  },
  plugins: [],
};

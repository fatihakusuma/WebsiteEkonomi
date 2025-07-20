module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pink-pastel-light': '#FFC2D1',
        'pink-pastel-lighter': '#FFE5EC',
        'pink-pastel-strong': '#FF8FAB',
        'pink-pastel-medium': '#FFB3C6',
        'pink-primary': '#FF0A54',
        'pink-secondary': '#FF477E',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
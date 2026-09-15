/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#050505",
          dark: "#0B0D0B",
          darker: "#063B1D",
          green: "#16A34A",
          greenLight: "#19C763",
          greenDeep: "#0A5428",
          surface: "#FBFBFA",
          card: "#F6F7F5",
          border: "#E5EAE5"
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Manrope', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    }
  },
  plugins: []
}

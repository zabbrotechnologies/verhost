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
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        mono: ['"Space Grotesk"', 'monospace'],
        tech: ['"Space Grotesk"', 'sans-serif']
      },
      letterSpacing: {
        'tightest': '-0.04em',
        'tighter': '-0.03em',
        'tight': '-0.015em',
        'normal': '0em',
        'wide': '0.04em',
        'wider': '0.08em',
        'widest': '0.15em',
        'mega': '0.22em'
      }
    }
  },
  plugins: []
}

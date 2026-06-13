/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./index.tsx",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./views/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'], // Dark Mode
        brutal: ['Space Grotesk', 'sans-serif'], // Light Mode
      },
      animation: {
        'nebula-float': 'nebula 20s infinite alternate',
        'twinkle': 'twinkle 4s infinite ease-in-out',
      },
      keyframes: {
        nebula: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '100%': { transform: 'translate(30px, -20px) scale(1.1)' },
        },
        twinkle: {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 1 },
        }
      },
      colors: {
        // LIGHT MODE PALETTE
        'pop-yellow': '#FFD600',
        'pop-purple': '#D6BCFA',
        'pop-green': '#9AE6B4',
        'pop-blue': '#90CDF4',
        'pop-pink': '#FEB2B2',
        
        // DARK MODE PALETTE (Nebula inspired)
        'space-black': '#050508',
        'nebula-gold': '#d4a353',
        'nebula-teal': '#2dd4bf',
        'nebula-void': '#0f172a',
        
        // Legacy names
        'neo-yellow': '#FFD600',
        'neo-purple': '#D6BCFA',
        'neo-green': '#9AE6B4',
        'neo-rose': '#FEB2B2',
        'neo-blue': '#90CDF4',
        linkedin: {
          800: '#0a66c2',
          700: '#004182'
        }
      }
    }
  },
  plugins: [],
}

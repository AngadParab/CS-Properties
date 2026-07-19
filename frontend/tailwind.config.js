/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1C1C1C',       // Soft Jet Black
          gold: '#C5A880',       // Muted Ochre / Warm Tan Accent
          goldDark: '#765C3B',   // High-Contrast Ochre for light backgrounds
          bg: '#F4F3EF',         // Warm Sand Background
          surface: '#FFFFFF',    // Crisp White Cards
          text: {
            primary: '#1C1C1C',  // Soft Jet Black
            muted: '#8E8C84',    // Ghost Grey / Muted Taupe
          },
          charcoal: '#272727',   // Dark Charcoal for intense contrast
          sandDark: '#EFECE6',   // Secondary Off-White/Sand
          success: '#10B981',    // Success Green
          error: '#EF4444',      // Error Red
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        syne: ['Syne', 'sans-serif'],
      }
    },
  },
  plugins: [],
}



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
          navy: '#1E3A8A',      // Primary Navy Blue
          gold: '#F59E0B',      // Secondary Gold/Amber
          bg: '#F8FAFC',        // Neutral Background (slate-50)
          surface: '#FFFFFF',   // Card & Form Container White
          text: {
            primary: '#0F172A', // Dark Slate for main text
            muted: '#64748B',   // Muted Slate for secondary text
          },
          success: '#10B981',   // Success Emerald
          error: '#EF4444',     // Error Red
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}



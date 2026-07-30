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
          DEFAULT: '#3B82F6',
          dark: '#1D4ED8',
          tint: 'rgba(59, 130, 246, 0.15)',
          light: '#60A5FA'
        },
        bg: '#070B14',
        card: '#0F172A',
        border: '#1E293B',
        text: {
          DEFAULT: '#F8FAFC',
          mid: '#94A3B8',
          low: '#64748B'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif']
      }
    },
  },
  plugins: [],
}

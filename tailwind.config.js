/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          orange: '#E27D24',
          'orange-light': '#FDF2E9',
        },
        neutral: {
          'slate-50': '#F8FAFC',
          'slate-100': '#F1F5F9',
          'slate-150': '#F8FAFC',
          'slate-200': '#E2E8F0',
          'slate-300': '#CBD5E1',
          'slate-400': '#94A3B8',
          'slate-500': '#64748B',
          'slate-700': '#1E293B',
          'slate-900': '#0F172A',
        }
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "sans-serif"],
      }
    },
  },
  plugins: [],
}

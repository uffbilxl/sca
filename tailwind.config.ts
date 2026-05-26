/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: {
          base: '#090909',
          2: '#111111',
          3: '#181818',
          4: '#202020',
          5: '#282828',
        },
        border: {
          1: '#1e1e1e',
          2: '#2a2a2a',
          3: '#363636',
        },
        text: {
          1: '#f5f5f5',
          2: '#999999',
          3: '#555555',
          4: '#333333',
        },
        accent: {
          DEFAULT: '#5b8df5',
          hover: '#4a7ae0',
          bg: 'rgba(91,141,245,0.1)',
          border: 'rgba(91,141,245,0.25)',
        },
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        md: '8px',
        lg: '10px',
        xl: '14px',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0', transform: 'translateY(4px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

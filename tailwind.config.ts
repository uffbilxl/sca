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
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg: {
          base: '#FAF8F4',
          2: '#F0EDE8',
          3: '#E8E4DC',
          4: '#E0DBD1',
          5: '#D8D3C9',
        },
        border: {
          1: '#D8D4CC',
          2: '#C4BFB5',
          3: '#9B9685',
        },
        text: {
          1: '#141414',
          2: '#4A4A4A',
          3: '#6B6B6B',
          4: '#9B9B9B',
        },
        accent: {
          DEFAULT: '#141414',
          hover: '#3a3a3a',
          bg: 'rgba(20,20,20,0.06)',
          border: 'rgba(20,20,20,0.2)',
        },
      },
      borderRadius: {
        sm: '0px',
        DEFAULT: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        '3xl': '0px',
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

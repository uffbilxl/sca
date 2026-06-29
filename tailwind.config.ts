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
        sans: ['var(--font-geist-sans)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'Courier New', 'monospace'],
      },
      colors: {
        bg: {
          base: '#08090a',
          2: '#111214',
          3: '#161a20',
          4: '#1a1d23',
          5: '#1e222a',
        },
        border: {
          1: '#1e2024',
          2: '#252830',
          3: '#363b46',
        },
        text: {
          1: '#f1f2f4',
          2: '#a8b0c0',
          3: '#6b7280',
          4: '#4b5263',
        },
        accent: {
          DEFAULT: '#6366f1',
          hover: '#4f52d4',
          bg: 'rgba(99,102,241,0.1)',
          border: 'rgba(99,102,241,0.25)',
        },
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        md: '8px',
        lg: '10px',
        xl: '14px',
        '2xl': '20px',
      },
      transitionTimingFunction: {
        precision: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

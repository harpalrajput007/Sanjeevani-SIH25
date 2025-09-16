/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        herbal: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#2F855A',
          700: '#15803d',
          800: '#166534',
        },
        earthy: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          500: '#a0616a',
          600: '#7B4B2A',
          700: '#633a1e',
        },
        cream: {
          50: '#FDF6E3',
          100: '#fef3c7',
        }
      },
      backgroundImage: {
        'pharma-gradient': 'linear-gradient(135deg, #1E3A8A 0%, #4338CA 50%, #14B8A6 100%)',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
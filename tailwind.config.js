// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#0A0A0A',
        'primary': '#00FFFF',
        'secondary': '#4C2882',
        'neutral': '#F5F5F5',
      },
      fontFamily: {
        monument: ['Monument Extended', 'sans-serif'],
        satoshi: ['Satoshi', 'sans-serif'],
      },
      backdropBlur: {
        'xl': '24px',
      },
      // --- TAMBAHKAN BLOK INI ---
      keyframes: {
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      animation: {
        gradient: 'gradient 8s linear infinite'
      },
      // --- AKHIR BLOK ---
    },
  },
  plugins: [],
}
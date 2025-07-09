/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Mencakup semua file React kita
  ],
  theme: {
    extend: {
      colors: {
        // Palet Warna dari Dokumen Desain
        'background': '#0A0A0A',
        'primary': '#00FFFF',    // Cyan Elektrik
        'secondary': '#4C2882',  // Ungu Amethyst Gelap
        'neutral': '#F5F5F5',    // Putih Pudar
      },
      fontFamily: {
        // Font Kustom dari Dokumen Desain
        monument: ['Monument Extended', 'sans-serif'],
        satoshi: ['Satoshi', 'sans-serif'],
      },
      // Efek untuk Glassmorphism & Header
      backdropBlur: {
        'xl': '24px',
      }
    },
  },
  plugins: [],
}
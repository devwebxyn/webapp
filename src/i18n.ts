import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
  // Mengaktifkan backend untuk memuat file terjemahan dari folder public
  .use(HttpApi)
  // Mendeteksi bahasa pengguna dan menyimpan pilihan ke localStorage
  .use(LanguageDetector)
  // Mengirim instance i18n ke react-i18next
  .use(initReactI18next)
  // Inisialisasi i18next
  .init({
    // Bahasa default jika bahasa browser tidak tersedia
    fallbackLng: 'id',
    // Bahasa default
    lng: 'id',
    // Namespace default
    ns: ['translation'],
    defaultNS: 'translation',
    
    // Aktifkan mode debug hanya saat development
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // Tidak diperlukan untuk React
    },

    // Konfigurasi untuk LanguageDetector
    detection: {
      // Urutan pendeteksian: localStorage, lalu bahasa browser
      order: ['localStorage', 'navigator'],
      // Simpan pilihan bahasa pengguna di localStorage
      caches: ['localStorage'],
    },

    // Konfigurasi untuk i18next-http-backend
    backend: {
      // Path ke file terjemahan Anda
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

export default i18n;
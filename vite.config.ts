import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import type { ViteDevServer } from 'vite';

const securityHeaders = () => ({
  name: 'security-headers',
  configureServer(server: ViteDevServer) {
    server.middlewares.use((_req, res, next) => {
      // Mengizinkan pop-up dan embedder untuk Google Sign-In & Drive
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
      res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none'); // Diperlukan untuk beberapa fungsi Google
      
      res.setHeader(
        'Content-Security-Policy',
        [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' https://accounts.google.com https://apis.google.com https://www.gstatic.com",
          
          // --- PERBAIKAN UTAMA ADA DI SINI ---
          // Menambahkan domain Google Drive dan Docs ke frame-src
          "frame-src 'self' https://accounts.google.com https://content.googleapis.com https://drive.google.com https://docs.google.com",
          
          // Menambahkan font-src dan memastikan koneksi lain tetap diizinkan
          "connect-src 'self' https://*.googleapis.com https://*.google.com https://zqnwoavdkzmdqfgvdjce.supabase.co",
          "style-src 'self' 'unsafe-inline'",
          "img-src * 'self' data:",
          "font-src 'self' data:", // Mengizinkan font dari domain sendiri
        ].join('; ')
      );
      next();
    });
  },
});

export default defineConfig({
  plugins: [react(), securityHeaders()],
});
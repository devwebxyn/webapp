import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import type { ViteDevServer } from 'vite';

const securityHeaders = () => ({
  name: 'security-headers',
  configureServer(server: ViteDevServer) {
    server.middlewares.use((_req, res, next) => {
      // --- PERBAIKAN: Mengizinkan pop-up berkomunikasi dengan aman ---
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
      // --- PERBAIKAN: Mengatur COEP menjadi 'unsafe-none' untuk mengatasi masalah GSI ---
      res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
      
      res.setHeader(
        'Content-Security-Policy',
        [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' https://accounts.google.com https://apis.google.com https://www.gstatic.com",
          "frame-src 'self' https://accounts.google.com https://content.googleapis.com",
          // --- PERBAIKAN: Menambahkan semua domain yang diperlukan Google ---
          "connect-src 'self' https://www.googleapis.com https://content.googleapis.com https://oauth2.googleapis.com https://apis.google.com https://www.google.com https://zqnwoavdkzmdqfgvdjce.supabase.co",
          "style-src 'self' 'unsafe-inline'",
          "img-src * 'self' data:",
        ].join('; ')
      );
      next();
    });
  },
});

export default defineConfig({
  plugins: [react(), securityHeaders()],
});
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import type { ViteDevServer } from 'vite';

// Fungsi untuk menambahkan header keamanan
const securityHeaders = () => ({
  name: 'security-headers',
  configureServer(server: ViteDevServer) {
    server.middlewares.use((_req, res, next) => {
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
      res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
      res.setHeader(
        'Content-Security-Policy',
        [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' https://accounts.google.com https://apis.google.com https://www.gstatic.com",
          "frame-src 'self' https://accounts.google.com https://content.googleapis.com",
          // --- PERBAIKAN DI SINI: Menambahkan URL Supabase Anda ---
          "connect-src 'self' https://www.googleapis.com https://zqnwoavdkzmdqfgvdjce.supabase.co",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https://*.googleusercontent.com",
        ].join('; ')
      );
      next();
    });
  },
});

export default defineConfig({
  plugins: [react(), securityHeaders()],
});
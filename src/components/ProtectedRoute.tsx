import React from 'react';
import { Navigate } from 'react-router-dom';

// Definisikan tipe props untuk komponen ini
interface ProtectedRouteProps {
  children: React.ReactNode; // children adalah komponen halaman yang ingin kita lindungi
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // --- SIMULASI STATUS LOGIN ---
  // Di aplikasi nyata, nilai ini akan datang dari context, Redux, atau state management lain
  // setelah pengguna berhasil login.
  // Untuk sekarang, kita buat 'false' untuk melihat efeknya.
  const isLoggedIn = false; 

  if (!isLoggedIn) {
    // Jika pengguna belum login, alihkan mereka ke halaman utama ('/')
    // Komponen <Navigate> dari react-router-dom akan melakukan pengalihan.
    return <Navigate to="/" replace />;
  }

  // Jika pengguna sudah login, tampilkan halaman yang diminta (children).
  return <>{children}</>;
};
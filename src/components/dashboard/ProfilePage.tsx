// src/pages/dashboard/ProfilePage.tsx
import React from 'react';

export const ProfilePage: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="font-monument text-2xl text-white">Profil Pengguna</h1>
      <p className="text-neutral-400 mt-2">
        Fitur untuk mengedit profil Anda secara lengkap akan segera hadir di sini.
        Untuk saat ini, Anda bisa menggunakan pop-up pengaturan dari ikon roda gigi di pojok kanan atas.
      </p>
    </div>
  );
};
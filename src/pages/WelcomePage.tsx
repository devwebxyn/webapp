import React from 'react';
import { Link } from 'react-router-dom';
import { VscCheckAll } from 'react-icons/vsc';

export const WelcomePage: React.FC = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <VscCheckAll size={64} className="text-green-400" />
      <h1 className="mt-6 font-monument text-4xl text-white">Verifikasi Berhasil!</h1>
      <p className="mt-2 text-lg text-neutral-300">Akun Anda telah berhasil diverifikasi. Selamat datang di CloudNest.</p>
      <Link
        to="/login"
        className="mt-8 rounded-md bg-primary px-6 py-3 font-bold text-background transition-colors hover:bg-primary/80"
      >
        Lanjut ke Halaman Login
      </Link>
    </div>
  );
};
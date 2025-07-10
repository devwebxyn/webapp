import React from 'react';
import { Link } from 'react-router-dom';
import { VscMailRead } from 'react-icons/vsc';

export const PasswordResetSentPage: React.FC = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <VscMailRead size={64} className="mx-auto text-primary" />
        <h1 className="mt-6 font-monument text-3xl text-white">Silakan Periksa Email Anda</h1>
        <p className="mt-4 max-w-sm text-neutral-300">
            Jika email Anda terdaftar, kami telah mengirimkan tautan untuk membuat password baru.
        </p>
        <Link
          to="/login"
          className="mt-8 rounded-md bg-primary px-6 py-3 font-bold text-background transition-colors hover:bg-primary/80"
        >
          Kembali ke Login
        </Link>
    </div>
  );
};
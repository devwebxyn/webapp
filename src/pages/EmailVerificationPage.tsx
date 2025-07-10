import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { VscMail } from 'react-icons/vsc';

export const EmailVerificationPage: React.FC = () => {
  const location = useLocation();
  // Mengambil email dari state navigasi, atau menampilkan teks default jika tidak ada
  const email = location.state?.email || 'email Anda';
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fungsi untuk mengirim ulang email verifikasi
  const handleResend = async () => {
    setLoading(true);
    setMessage('');
    
    if (email === 'email Anda') {
        setMessage('Tidak dapat mengirim ulang, email tidak ditemukan.');
        setLoading(false);
        return;
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });

    if (error) {
      setMessage(`Gagal mengirim ulang: ${error.message}`);
    } else {
      setMessage('Email verifikasi baru telah berhasil dikirim!');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 text-center">
      <div className="max-w-md">
        <VscMail size={64} className="mx-auto text-primary" />
        <h1 className="mt-6 font-monument text-3xl text-white">Verifikasi Email Anda</h1>
        <p className="mt-4 text-neutral-300">
          Kami telah mengirimkan tautan verifikasi ke alamat email:
          <br />
          <strong className="text-white">{email}</strong>
        </p>
        <p className="mt-2 text-sm text-neutral-400">
            Silakan periksa kotak masuk (dan folder spam) Anda untuk melanjutkan.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button 
            onClick={handleResend} 
            disabled={loading} 
            className="text-sm font-semibold text-primary transition-opacity hover:opacity-80 disabled:text-neutral-500"
          >
            {loading ? 'Mengirim...' : 'Kirim Ulang Email Verifikasi'}
          </button>
        </div>
        {message && <p className="mt-4 text-sm text-green-400">{message}</p>}
      </div>
    </div>
  );
};
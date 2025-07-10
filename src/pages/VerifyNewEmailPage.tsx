// src/pages/VerifyNewEmailPage.tsx

import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { VscCheck, VscError, VscLoading } from 'react-icons/vsc';

export const VerifyNewEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Sedang memverifikasi token Anda...');

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Token verifikasi tidak ditemukan di URL. Silakan coba lagi dari email Anda.');
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('confirm-email-addition', {
          body: { token },
        });

        if (error) throw new Error(error.message);
        
        // Ambil pesan sukses dari respons fungsi
        setMessage(data.message || 'Email Anda berhasil diverifikasi dan ditambahkan!');
        setStatus('success');

      } catch (error: any) {
        setStatus('error');
        // Ambil pesan error dari respons fungsi jika ada
        const errorMessage = error.context?.json?.error || error.message || 'Terjadi kesalahan.';
        setMessage(errorMessage);
      }
    };

    verifyToken();
  }, [searchParams]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center p-4">
      {status === 'loading' && <VscLoading size={64} className="animate-spin text-primary" />}
      {status === 'success' && <VscCheck size={64} className="text-green-400" />}
      {status === 'error' && <VscError size={64} className="text-red-400" />}

      <h1 className="mt-6 font-monument text-3xl text-white">
        {status === 'loading' && 'Memproses Verifikasi...'}
        {status === 'success' && 'Verifikasi Berhasil!'}
        {status === 'error' && 'Verifikasi Gagal'}
      </h1>
      <p className="mt-4 max-w-sm text-neutral-300">
        {message}
      </p>
      {status !== 'loading' && (
        <Link
          to="/dashboard"
          className="mt-8 rounded-md bg-primary px-6 py-3 font-bold text-background transition-colors hover:bg-primary/80"
        >
          Kembali ke Dashboard
        </Link>
      )}
    </div>
  );
};
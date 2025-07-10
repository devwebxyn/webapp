import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { VscMail } from 'react-icons/vsc';
import { supabase } from '../supabaseClient';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) throw error;
      setMessage('Jika email Anda terdaftar, link reset password telah dikirim.');
    } catch (error: any) {
      setError(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 text-white">
      <motion.div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 p-8 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <h2 className="font-monument text-2xl uppercase text-white">Lupa Password</h2>
          <p className="mt-2 text-sm text-neutral-400">
            Masukkan email Anda dan kami akan mengirimkan link untuk mereset password Anda.
          </p>
        </div>
        <form onSubmit={handlePasswordReset} className="mt-8 space-y-4">
          <div className="relative">
            <VscMail className="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-500" />
            <input type="email" placeholder="Email terdaftar Anda" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-md border border-white/10 bg-white bg-opacity-10 p-3 pl-10 text-white placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          {message && <p className="text-center text-sm text-green-400">{message}</p>}
          {error && <p className="text-center text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-md bg-primary py-3 font-bold text-black transition-colors hover:bg-primary/80 disabled:bg-neutral-600">
            {loading ? 'Mengirim...' : 'Kirim Link Reset'}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-neutral-400">
          Ingat password Anda? <Link to="/login" className="font-bold text-primary hover:underline">Kembali ke Login</Link>
        </p>
      </motion.div>
    </div>
  );
};
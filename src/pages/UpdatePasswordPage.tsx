import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { VscKey, VscEye, VscEyeClosed } from 'react-icons/vsc';

export const UpdatePasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setMessage('Sesi pemulihan aktif. Anda dapat membuat password baru sekarang.');
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleUpdatePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage('Password berhasil diperbarui! Anda akan diarahkan ke halaman login dalam 3 detik.');
      setTimeout(() => navigate('/login'), 3000);
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
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <h2 className="font-monument text-2xl uppercase text-white">Buat Password Baru</h2>
          <p className="mt-2 text-sm text-neutral-400">Masukkan password baru yang kuat untuk akun Anda.</p>
        </div>
        <form onSubmit={handleUpdatePassword} className="mt-8 space-y-4">
          <div className="relative">
            <VscKey className="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-500" />
            <input type={showPassword ? "text" : "password"} placeholder="Password Baru (min. 6 karakter)" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-md border border-white/10 bg-white bg-opacity-10 p-3 pl-10 text-white placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-500 hover:text-white">
              {showPassword ? <VscEyeClosed /> : <VscEye />}
            </button>
          </div>
          {message && <p className="text-center text-sm text-green-400">{message}</p>}
          {error && <p className="text-center text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-md bg-primary py-3 font-bold text-black transition-colors hover:bg-primary/80 disabled:bg-neutral-600">
            {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
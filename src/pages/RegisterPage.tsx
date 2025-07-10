import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { VscKey, VscMail, VscPerson, VscEye, VscEyeClosed } from 'react-icons/vsc';
import { supabase } from '../supabaseClient';
import { NebulaBackground } from '../components/NebulaBackground';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State untuk toggle
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: `${window.location.origin}/setup-account`,
        },
      });
      if (error) throw error;
      navigate('/auth/email-verification', { state: { email: email } });
    } catch (error: any) {
      setError(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 text-white">
      <motion.div
        className="w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 shadow-xl md:grid md:grid-cols-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative hidden items-center justify-center p-12 md:flex">
          <div className="absolute inset-0 z-0">
            <NebulaBackground />
          </div>
          <div className="relative z-10 text-center">
            <Link to="/" className="font-monument text-4xl font-bold text-white">CloudNest</Link>
            <p className="mt-4 text-lg text-neutral-300">Buat akun Anda dan mulai amankan jejak digital Anda hari ini.</p>
          </div>
        </div>
        <div className="p-8 md:p-12">
          <h2 className="font-monument text-2xl uppercase text-white">Buat Akun Baru</h2>
          <p className="mt-2 text-neutral-400">Hanya perlu beberapa detik.</p>
          <form onSubmit={handleRegister} className="mt-8 space-y-4">
            <div className="relative">
              <VscPerson className="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-500" />
              <input type="text" placeholder="Nama Lengkap" value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-md border border-white/10 bg-white bg-opacity-10 p-3 pl-10 text-white placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="relative">
              <VscMail className="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-500" />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-md border border-white/10 bg-white bg-opacity-10 p-3 pl-10 text-white placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            {/* --- PERBAIKAN DI SINI --- */}
            <div className="relative">
              <VscKey className="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-500" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password (min. 6 karakter)" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="w-full rounded-md border border-white/10 bg-white bg-opacity-10 p-3 pl-10 pr-10 text-white placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-500 hover:text-white"
              >
                {showPassword ? <VscEyeClosed /> : <VscEye />}
              </button>
            </div>
            {message && <p className="text-center text-sm text-green-400">{message}</p>}
            {error && <p className="text-center text-sm text-red-500">{error}</p>}
            <button type="submit" disabled={loading} className="w-full rounded-md bg-primary py-3 font-bold text-black transition-colors hover:bg-primary/80 disabled:bg-neutral-600">
              {loading ? 'Memproses...' : 'Buat Akun'}
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-neutral-400">
            Sudah punya akun? <Link to="/login" className="font-bold text-primary hover:underline">Login di sini</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { VscKey, VscMail, VscEye, VscEyeClosed } from 'react-icons/vsc';
import { FaGithub, FaGoogle } from 'react-icons/fa';

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 text-white">
      <motion.div
        className="w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 shadow-xl md:grid md:grid-cols-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Kiri */}
        <div className="hidden items-center justify-center bg-primary/10 p-12 md:flex">
          <div className="text-center">
            <Link to="/" className="font-monument text-4xl font-bold text-white">CloudNest</Link>
            <p className="mt-4 text-lg text-neutral-300">Selamat datang kembali. Masuk untuk mengakses brankas digital Anda.</p>
          </div>
        </div>

        {/* Kanan */}
        <div className="p-8 md:p-12">
          <h2 className="font-monument text-2xl uppercase text-white">Login</h2>
          <p className="mt-2 text-neutral-400">Silakan masukkan detail akun Anda.</p>

          <div className="mt-8 space-y-4">
            {/* Email */}
            <div className="relative">
              <VscMail className="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-500" />
              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-md border border-white/10 bg-white bg-opacity-10 p-3 pl-10 text-white placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <VscKey className="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full rounded-md border border-white/10 bg-white bg-opacity-10 p-3 pl-10 text-white placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-500 hover:text-white"
              >
                {showPassword ? <VscEyeClosed /> : <VscEye />}
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end">
            <a href="#" className="text-xs text-primary hover:underline">Lupa Password?</a>
          </div>

          <button className="mt-8 w-full rounded-md bg-primary py-3 font-bold text-black transition-colors hover:bg-primary/80">
            Login
          </button>

          <div className="relative my-8 flex items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="mx-4 text-xs text-neutral-500">ATAU LANJUTKAN DENGAN</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          {/* Social */}
          <div className="flex gap-4">
            <button className="flex w-full items-center justify-center gap-2 rounded-md border border-white/20 py-2.5 text-white transition-colors hover:bg-white/10">
              <FaGithub /> GitHub
            </button>
            <button className="flex w-full items-center justify-center gap-2 rounded-md border border-white/20 py-2.5 text-white transition-colors hover:bg-white/10">
              <FaGoogle /> Google
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-neutral-400">
            Belum punya akun?{' '}
            <Link to="/register" className="font-bold text-primary hover:underline">Daftar di sini</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

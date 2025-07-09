import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  VscKey,
  VscMail,
  VscPerson,
  VscEye,
  VscEyeClosed,
} from 'react-icons/vsc';

export const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 text-white">
      <motion.div
        className="w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 shadow-xl md:grid md:grid-cols-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Branding */}
        <div className="hidden items-center justify-center bg-primary/10 p-12 md:flex">
          <div className="text-center">
            <Link to="/" className="font-monument text-4xl font-bold text-white">
              CloudNest
            </Link>
            <p className="mt-4 text-lg text-neutral-300">
              Buat akun Anda dan mulai amankan jejak digital Anda hari ini.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-8 md:p-12">
          <h2 className="font-monument text-2xl uppercase text-white">Buat Akun Baru</h2>
          <p className="mt-2 text-neutral-400">Hanya perlu beberapa detik.</p>

          <div className="mt-8 space-y-4">
            {/* Nama */}
            <div className="relative">
              <VscPerson className="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Nama Lengkap"
                className="w-full rounded-md border border-white/10 bg-white bg-opacity-10 p-3 pl-10 text-white placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

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
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="w-full rounded-md border border-white/10 bg-white bg-opacity-10 p-3 pl-10 pr-10 text-white placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                {showPassword ? <VscEyeClosed /> : <VscEye />}
              </button>
            </div>
          </div>

          {/* Checkbox dengan centang */}
          <div className="mt-6 flex items-start gap-3">
            <button
              type="button"
              onClick={() => setAgreed(!agreed)}
              className={`h-5 w-5 flex items-center justify-center rounded-sm border transition-all ${
                agreed
                  ? 'bg-primary border-primary text-black'
                  : 'bg-neutral-800 border-neutral-500'
              }`}
            >
              {agreed && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <span className="text-xs text-neutral-400">
              Saya setuju dengan{' '}
              <a href="/legal" className="text-primary hover:underline" target="_blank">
                Syarat & Ketentuan
              </a>{' '}
              dan{' '}
              <a href="/legal" className="text-primary hover:underline" target="_blank">
                Kebijakan Privasi
              </a>
              .
            </span>
          </div>

          {/* Tombol Submit */}
          <button className="mt-8 w-full rounded-md bg-primary py-3 font-bold text-black transition-colors hover:bg-primary/80">
            Buat Akun
          </button>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-neutral-400">
            Sudah punya akun?{' '}
            <Link to="/login" className="font-bold text-primary hover:underline">
              Login di sini
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

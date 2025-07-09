import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VscSignIn, VscPersonAdd, VscChromeClose } from 'react-icons/vsc';
// Impor 'Link' untuk navigasi
import { Link } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel Modal */}
          <motion.div
            className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900/80 p-8"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-neutral-500 transition-colors hover:text-white"
            >
              <VscChromeClose size={24} />
            </button>
            
            <h2 className="text-center font-monument text-2xl text-white">
              Selamat Datang di CloudNest
            </h2>
            <p className="mt-2 text-center font-satoshi text-neutral-400">
              Silakan masuk untuk melanjutkan atau daftar jika Anda pengguna baru.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* --- PERUBAHAN DI SINI: Menggunakan Link untuk Login --- */}
              <Link
                to="/login"
                onClick={onClose}
                className="group flex flex-col items-center justify-center rounded-lg border border-primary/50 bg-primary/10 p-6 text-center transition-all duration-300 hover:border-primary hover:bg-primary/20"
              >
                <VscSignIn size={40} className="mb-3 text-primary transition-transform group-hover:scale-110" />
                <span className="font-satoshi text-lg font-bold text-white">Login</span>
                <span className="text-xs text-neutral-400">Sudah punya akun</span>
              </Link>

              {/* --- PERUBAHAN DI SINI: Menggunakan Link untuk Register --- */}
              <Link
                to="/register"
                onClick={onClose}
                className="group flex flex-col items-center justify-center rounded-lg border border-white/20 bg-white/5 p-6 text-center transition-all duration-300 hover:border-white/50 hover:bg-white/10"
              >
                <VscPersonAdd size={40} className="mb-3 text-neutral-300 transition-transform group-hover:scale-110" />
                <span className="font-satoshi text-lg font-bold text-white">Register</span>
                <span className="text-xs text-neutral-400">Pengguna baru</span>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
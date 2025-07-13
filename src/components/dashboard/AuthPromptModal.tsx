import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VscPlug } from 'react-icons/vsc';
import { useGoogleDrive } from '../../hooks/useGoogleDrive';

interface AuthPromptModalProps {
  isOpen: boolean;
}

export const AuthPromptModal: React.FC<AuthPromptModalProps> = ({ isOpen }) => {
  const { signIn } = useGoogleDrive();
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <motion.div
            className="relative z-10 w-full max-w-lg rounded-2xl border border-primary/20 bg-zinc-900 p-8 text-center shadow-2xl shadow-primary/10"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/50 bg-primary/10 text-primary">
              <VscPlug size={32} />
            </div>
            <h2 className="mt-6 font-monument text-2xl text-white">
              Brankas Belum Tertaut
            </h2>
            <p className="mt-2 text-neutral-300">
              Untuk melihat ringkasan penyimpanan dan mengakses fitur ini, Anda perlu menautkan akun Google Drive Anda terlebih dahulu.
            </p>
            <button
              onClick={signIn}
              className="mt-8 inline-block rounded-md bg-primary px-8 py-3 font-bold text-background transition-colors hover:bg-primary/80"
            >
              Tautkan Akun Sekarang
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
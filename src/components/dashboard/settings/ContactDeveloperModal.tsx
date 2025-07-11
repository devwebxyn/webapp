import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VscChromeClose, VscSend } from 'react-icons/vsc';

interface ContactDeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorDetails: string;
}

export const ContactDeveloperModal: React.FC<ContactDeveloperModalProps> = ({ isOpen, onClose, errorDetails }) => {
  const [userEmail, setUserEmail] = useState('');

  const developerEmail = 'mesakzitumpul@gmail.com';
  const subject = encodeURIComponent('Laporan Error - CloudNest Google Drive');
  
  const handleSendEmail = () => {
    const body = encodeURIComponent(
      `Halo Developer CloudNest,\n\nSaya mengalami kendala saat menautkan akun Google Drive.\n\nDetail Error:\n${errorDetails}\n\nEmail saya untuk dihubungi kembali:\n${userEmail}\n\nTerima kasih.`
    );
    // Ini akan membuka aplikasi email default pengguna
    window.location.href = `mailto:${developerEmail}?subject=${subject}&body=${body}`;
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative z-10 w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-900 p-8 shadow-xl"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-neutral-500 hover:text-white"><VscChromeClose size={24} /></button>
            <h2 className="font-monument text-2xl text-white">Hubungi Developer</h2>
            <p className="mt-2 text-neutral-400">Kirim detail error berikut ke tim kami untuk penanganan lebih lanjut.</p>
            
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-neutral-300">Detail Error (Otomatis)</label>
                <textarea
                  readOnly
                  value={errorDetails}
                  className="mt-1 w-full h-24 resize-none rounded-md border border-white/10 bg-black/30 p-2 text-sm text-neutral-400"
                />
              </div>
              <div>
                <label htmlFor="user-email" className="text-sm font-semibold text-neutral-300">Email Anda</label>
                <input
                  id="user-email"
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Masukkan email Anda agar kami bisa membalas"
                  className="mt-1 w-full rounded-md border border-white/10 bg-white/5 p-3 text-white placeholder:text-neutral-500 focus:border-primary focus:ring-primary"
                />
              </div>
              <button
                onClick={handleSendEmail}
                disabled={!userEmail}
                className="w-full flex items-center justify-center gap-2 rounded-md bg-primary py-3 font-bold text-background transition-colors hover:bg-primary/80 disabled:bg-neutral-600"
              >
                <VscSend /> Kirim Laporan via Email
              </button>
            </div>
            <p className="mt-3 text-center text-xs text-neutral-500">
                Tindakan ini akan membuka aplikasi email default Anda.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
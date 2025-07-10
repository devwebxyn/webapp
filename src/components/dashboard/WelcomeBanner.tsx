import React from 'react';
import { motion, type Variants } from 'framer-motion'; // <-- Impor Variants
import { VscCloud, VscFile, VscFolder } from 'react-icons/vsc';

// Terapkan tipe Variants di sini
const iconVariants: Variants = {
  float: (i: number) => ({
    y: [0, -5, 0, 5, 0],
    transition: {
      duration: 5 + i * 2,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  }),
};

// Pastikan props 'userName' diterima
interface WelcomeBannerProps {
    userName?: string;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ userName }) => {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900 to-blue-900/30 p-8 text-center md:p-12">
      {/* Ilustrasi 2D Animasi */}
      <motion.div variants={iconVariants} custom={1} animate="float" className="absolute top-1/4 left-1/4 opacity-10"><VscFile size={40} /></motion.div>
      <motion.div variants={iconVariants} custom={2} animate="float" className="absolute top-1/2 right-1/4 opacity-10"><VscFolder size={40} /></motion.div>
      <motion.div variants={iconVariants} custom={3} animate="float" className="absolute bottom-1/4 left-1/3 opacity-20"><VscCloud size={60} /></motion.div>

      {/* Konten Teks */}
      <div className="relative z-10">
        <h1 className="text-2xl font-bold text-white md:text-3xl">
          🎉 Selamat Datang Kembali, <span className="text-primary">{userName || 'Pengguna'}</span>!
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-neutral-300">
          CloudNest siap membantu Anda menyimpan, mengelola, dan membagikan file Anda dengan aman dan cepat.
        </p>
      </div>
    </div>
  );
};
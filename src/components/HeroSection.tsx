import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Scene } from './Scene'; // Impor Scene

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export const HeroSection: React.FC = () => {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden p-4 md:p-8">
      {/* Latar belakang 3D sekarang dirender oleh Scene */}
      <div className="absolute inset-0 z-0">
         <Scene />
      </div>
      
      {/* Konten teks */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={itemVariants}
          className="font-monument text-4xl font-bold uppercase leading-tight text-neutral md:text-5xl lg:text-6xl"
        >
          Ruang Digital Anda. <br />
          <span className="text-primary">Ditenagai oleh AI.</span>
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="mt-6 max-w-2xl font-satoshi text-lg text-neutral/80"
        >
          Amankan semua file, foto, dan arsip media sosial Anda di satu tempat. Biarkan AI cerdas kami mengaturnya untuk Anda.
        </motion.p>
        <motion.div
          variants={itemVariants}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <button className="transform rounded-md border border-primary/50 bg-primary/10 px-6 py-3 font-satoshi text-sm uppercase tracking-wider text-neutral backdrop-blur-sm transition-all duration-300 hover:bg-primary/20 hover:shadow-primary/50">
            [ Mulai Gratis ]
          </button>
          <button className="transform rounded-md px-6 py-3 font-satoshi text-sm uppercase tracking-wider text-neutral/60 transition-colors duration-300 hover:text-neutral">
            [ Pelajari Fitur ]
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};
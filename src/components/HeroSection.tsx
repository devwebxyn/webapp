// src/components/HeroSection.tsx

import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Scene } from './Scene';
import { Link } from 'react-router-dom';
import RotatingText from './RotatingText';
import GradientText from './GradientText'; // Impor komponen GradientText

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
      {/* Latar belakang 3D */}
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
        {/* --- PERUBAHAN DI SINI: MENGGUNAKAN GRADIENTTEXT --- */}
        <motion.div variants={itemVariants}>
          <GradientText className="font-monument text-4xl font-bold uppercase leading-tight md:text-5xl lg:text-6xl">
            Ruang Digital Anda. <br /> Ditenagai oleh AI.
          </GradientText>
        </motion.div>
        
        {/* Tombol CTA */}
        <motion.div
          variants={itemVariants}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <Link to="/register" className="transform rounded-md border border-primary/50 bg-primary/10 px-6 py-3 font-satoshi text-sm uppercase tracking-wider text-neutral backdrop-blur-sm transition-all duration-300 hover:bg-primary/20 hover:shadow-primary/50">
            [ Mulai Gratis ]
          </Link>
          <Link to="/features" className="transform rounded-md px-6 py-3 font-satoshi text-sm uppercase tracking-wider text-neutral/60 transition-colors duration-300 hover:text-neutral">
            [ Pelajari Fitur ]
          </Link>
        </motion.div>

        {/* RotatingText di bawah tombol */}
        <motion.div 
          variants={itemVariants} 
          className="mt-12 flex items-center justify-center gap-3 font-monument text-2xl uppercase text-neutral/80 md:text-3xl"
        >
            <span>Amankan</span>
            <RotatingText
              texts={["semua file", "setiap foto", "semua arsip"]}
              mainClassName="text-primary"
              rotationInterval={2500}
            />
            <span>Anda.</span>
        </motion.div>

      </motion.div>
    </section>
  );
};
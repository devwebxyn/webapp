import React from 'react';
import { motion } from 'framer-motion';
import { HeroSection } from '../components/HeroSection';
import { FeatureGrid } from '../components/FeatureGrid';
import { LogoCloud } from '../components/LogoCloud';

export const HomePage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <FeatureGrid />

      {/* Bagian "Mengapa Synapse" tetap di Halaman Utama */}
      <motion.div
        className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h2 className="font-monument text-3xl uppercase text-primary">
          Mengapa CloudNest?
        </h2>
        <p className="mt-6 font-satoshi text-lg leading-relaxed text-neutral-300">
          Di era digital, jejak kehidupan kita tersebar di berbagai platform: file di laptop, foto di Google Drive, kenangan di Instagram, dan ide di aplikasi catatan. CloudNest lahir dari sebuah gagasan sederhana: bagaimana jika semua fragmen digital ini bisa disatukan dalam satu ruang pribadi yang cerdas dan aman?
        </p>
        <p className="mt-4 font-satoshi text-lg leading-relaxed text-neutral-300">
          Ini bukan sekadar penyimpanan. Dengan memanfaatkan AI, CloudNest tidak hanya menyimpan, tetapi juga memahami data Anda. Ia mengubah arsip yang kacau menjadi sebuah jurnal digital yang terorganisir, dapat dicari, dan penuh makna, memberikan Anda kendali penuh atas warisan digital Anda.
        </p>
      </motion.div>
      
      <LogoCloud />

      {/* Bagian CTA Final */}
      <motion.div 
        className="relative z-10 mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8"
        // ... (properti motion)
      >
        <h2 className="font-monument text-3xl uppercase text-neutral-100 md:text-4xl">
          Hidup Digital Anda, <br/> Diatur dengan Sempurna.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl font-satoshi text-lg text-neutral-400">
          Berhenti khawatir kehilangan data. Mulai arsipkan kenangan Anda dengan cerdas hari ini.
        </p>
        <div className="mt-8">
          <button className="transform rounded-md border border-primary/50 bg-primary/10 px-8 py-4 font-satoshi text-base uppercase tracking-wider text-neutral backdrop-blur-sm transition-all duration-300 hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/20">
            [ Amankan Kenangan Anda ]
          </button>
        </div>
      </motion.div>
    </>
  );
};
import React from 'react';
import { motion, type Variants } from 'framer-motion';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Varian animasi untuk kartu
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
};

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <motion.div
      className="group rounded-xl border border-white/10 bg-neutral-900/50 p-6 backdrop-blur-sm"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="flex flex-col items-start">
        {/* --- BAGIAN YANG DIPERBAIKI --- */}
        {/* Kita bungkus ikon dalam div dan atur ukurannya di sini */}
        <div className="mb-4 text-primary transition-colors duration-300 group-hover:text-white text-[32px]">
          {icon}
        </div>
        {/* --- AKHIR BAGIAN YANG DIPERBAIKI --- */}
        
        <h3 className="mb-2 font-monument text-lg uppercase text-neutral-100">
          {title}
        </h3>
        <p className="font-satoshi text-sm text-neutral-400">
          {description}
        </p>
      </div>
    </motion.div>
  );
};
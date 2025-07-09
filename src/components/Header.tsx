import React, { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { VscMenu, VscChromeClose } from 'react-icons/vsc';
import { Link } from 'react-router-dom';
import { AuthModal } from './AuthModal'; // <-- Impor AuthModal

// Daftar link navigasi baru
const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Tentang Proyek', href: '/about-project' },
  { name: 'Tentang Developer', href: '/about-developer' },
  { name: 'Coba AI Kami', href: '/try-ai' }, // Ganti '#' dengan link yang sesuai
];

const menuVariants: Variants = {
  hidden: { opacity: 0, y: -20, transition: { duration: 0.2, ease: 'easeOut' } },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeIn' } },
};

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk modal

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4 md:px-8">
          <Link to="/" className="font-monument text-2xl font-bold text-neutral">
            CloudNest
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {/* Navigasi Desktop */}
            <nav>
              <ul className="flex items-center space-x-8">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="font-satoshi text-sm uppercase tracking-wider text-neutral/80 transition-colors duration-300 hover:text-primary">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Tombol Masuk untuk Desktop */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="rounded-md border border-primary/50 bg-primary/10 px-4 py-2 text-sm font-bold uppercase text-primary transition-colors hover:bg-primary/20"
            >
              Masuk
            </button>
          </div>

          {/* Tombol Hamburger untuk Mobile */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-md p-2 text-neutral-300 transition-colors hover:bg-white/10 hover:text-primary"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <VscChromeClose size={24} /> : <VscMenu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Panel Menu Mobile */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="absolute left-0 w-full border-t border-white/10 bg-background/95 p-4 md:hidden"
              variants={menuVariants} initial="hidden" animate="visible" exit="hidden"
            >
              <nav>
                <ul className="flex flex-col items-center space-y-4">
                  {navLinks.map((link) => (
                    <li key={link.name}>
                      <Link to={link.href} className="font-satoshi text-base uppercase tracking-wider text-neutral-300" onClick={() => setIsMenuOpen(false)}>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                  {/* Tombol Masuk untuk Mobile */}
                   <li className="w-full pt-4">
                      <button 
                        onClick={() => { setIsModalOpen(true); setIsMenuOpen(false); }}
                        className="w-full rounded-md border border-primary/50 bg-primary/10 px-4 py-3 text-sm font-bold uppercase text-primary"
                      >
                        Masuk / Daftar
                      </button>
                   </li>
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Render Modal di sini */}
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
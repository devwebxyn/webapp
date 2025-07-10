import React, { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AuthModal } from './AuthModal';
import { VscMenu, VscChromeClose } from 'react-icons/vsc';

// Daftar link navigasi sekarang statis (tidak lagi menggunakan 't()')
const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Tentang Proyek', href: '/about-project' },
  { name: 'Tentang Developer', href: '/about-developer' },
  { name: 'Coba AI Kami', href: '/try-ai' },
];

const menuVariants: Variants = {
  hidden: { opacity: 0, height: 0, transition: { duration: 0.2, ease: 'easeOut' } },
  visible: { opacity: 1, height: 'auto', transition: { duration: 0.2, ease: 'easeIn' } },
};

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4 md:px-8">
          <Link to="/" className="font-monument text-2xl font-bold text-neutral">
            CloudNest
          </Link>
          
          <div className="hidden items-center gap-4 md:flex">
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
            {/* Tombol LanguageSelector telah dihapus */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="rounded-md bg-primary px-4 py-2 text-sm font-bold uppercase text-background transition-colors hover:bg-cyan-300"
            >
              Masuk
            </button>
          </div>

          <div className="flex items-center md:hidden">
            {/* Tombol Hamburger untuk Mobile */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="rounded-md p-2 text-neutral-300 transition-colors hover:bg-white/10 hover:text-primary" aria-label="Toggle menu">
              {isMenuOpen ? <VscChromeClose size={24} /> : <VscMenu size={24} />}
            </button>
          </div>
        </div>
        
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="absolute left-0 w-full border-t border-white/10 bg-background/95 p-4 md:hidden"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
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
                   <li className="w-full pt-4">
                      <button 
                        onClick={() => { setIsModalOpen(true); setIsMenuOpen(false); }}
                        className="w-full rounded-md bg-primary px-4 py-3 text-sm font-bold uppercase text-background transition-colors hover:bg-cyan-300"
                      >
                        Masuk / Daftar
                      </button>
                   </li>
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Modal tetap ada dan berfungsi */}
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
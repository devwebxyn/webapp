import React from 'react';
import { motion } from 'framer-motion';

const navLinks = [
  { name: 'FITUR', href: '#' },
  { name: 'KEAMANAN', href: '#' },
  { name: 'GITHUB', href: '#' },
  { name: 'LOGIN', href: '#' },
];

export const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4 md:px-8">
        <div className="font-monument text-2xl font-bold text-neutral">
          Cloudnest
        </div>
        <nav className="hidden md:flex">
          <ul className="flex items-center space-x-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="font-satoshi text-sm uppercase tracking-wider text-neutral/80 transition-colors duration-300 hover:text-primary"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </motion.header>
  );
};
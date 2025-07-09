import React from 'react';
import { Link } from 'react-router-dom';

// Daftar link baru dengan path yang sesuai
const footerLinks = [
  { name: 'Status', path: '/status' },
  { name: 'Keamanan', path: '/security' },
  { name: 'Legal', path: '/legal' },
];

export const Footer: React.FC = () => {
  return (
    <footer className="mx-auto max-w-7xl border-t border-white/10 px-4 py-8 text-neutral-400 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <Link to="/" className="font-monument text-lg text-neutral-100">
          CloudNest
        </Link>
        <nav className="flex flex-wrap gap-x-6 gap-y-4">
          {footerLinks.map((link) => (
            // Menggunakan komponen Link untuk navigasi internal
            <Link key={link.name} to={link.path} className="text-sm transition-colors hover:text-primary">
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 md:flex-row md:items-center">
        <p className="text-xs text-neutral-500">
          Sebuah Konsep oleh Samuelindra Bastian
        </p>
        <p className="text-xs text-neutral-500">
          &copy; 2025 CloudNest
        </p>
      </div>
    </footer>
  );
};
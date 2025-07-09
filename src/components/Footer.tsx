import React from 'react';

export const Footer: React.FC = () => {
  const links = ['Status', 'Keamanan', 'GitHub', 'Legal'];

  return (
    <footer className="mx-auto max-w-7xl border-t border-white/10 px-4 py-8 text-neutral-400 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div className="font-monument text-lg text-neutral-100">
          Cloudnest
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-4">
          {links.map((link) => (
            <a key={link} href="#" className="text-sm transition-colors hover:text-primary">
              {link}
            </a>
          ))}
        </nav>
      </div>
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 md:flex-row md:items-center">
        <p className="text-xs text-neutral-500">
          Sebuah Konsep oleh Samuelindra Bastian
        </p>
        <p className="text-xs text-neutral-500">
          &copy; 2025 Synapse
        </p>
      </div>
    </footer>
  );
};
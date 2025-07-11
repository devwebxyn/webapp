// src/components/dashboard/DashboardHeader.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { VscSignOut, VscGear, VscSettings } from 'react-icons/vsc';
import { motion, AnimatePresence } from 'framer-motion';
import { type User } from '@supabase/supabase-js';

interface DashboardHeaderProps {
  user: User | null;
  onSettingsClick: () => void; // Callback untuk membuka modal pengaturan
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user, onSettingsClick }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Menutup dropdown saat mengklik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-zinc-900/80 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
        <nav className="flex items-center gap-6">
          <Link to="/dashboard" className="font-monument text-xl font-bold text-white">CloudNest</Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link to="/dashboard" className="text-sm font-semibold tracking-wide text-neutral-300 transition-colors hover:text-primary">
            Beranda
            </Link>
            <Link to="/storage/private" className="text-sm font-semibold tracking-wide text-neutral-300 transition-colors hover:text-primary">
              Private Storage
            </Link>
            <Link to="/storage/shared" className="text-sm font-semibold tracking-wide text-neutral-300 transition-colors hover:text-primary">
              Shared Storage
            </Link>
          </div>
        </nav>
        <div className="relative flex items-center gap-4" ref={dropdownRef}>
          <span className="hidden text-sm text-neutral-400 sm:block">{user?.email || '...'}</span>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="rounded-full p-2 text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Pengaturan"
          >
            <VscGear size={20} />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full right-0 mt-2 w-48 rounded-lg border border-white/10 bg-zinc-800 shadow-xl"
              >
                <ul>
                  <li>
                    <button
                      onClick={() => {
                        onSettingsClick();
                        setIsDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-neutral-200 hover:bg-primary/20"
                    >
                      <VscSettings />
                      Pengaturan
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/20"
                    >
                      <VscSignOut />
                      Logout
                    </button>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
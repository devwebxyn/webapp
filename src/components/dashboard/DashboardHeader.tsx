// src/components/dashboard/DashboardHeader.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
  VscSignOut,
  VscSettings,
  VscAccount,
  VscShield,
  VscChevronDown,
  VscDeviceMobile,
  VscMenu,
  VscChromeClose
} from 'react-icons/vsc';
import { type User } from '@supabase/supabase-js';

// --- TIPE PROPS DIPERBARUI ---
interface DashboardHeaderProps {
  user: User | null;
  // Untuk menu navigasi utama (DashboardLayout)
  onMainMenuClick?: () => void;
  isMainMenuOpen?: boolean;
  // Untuk sidebar penyimpanan (StorageLayout)
  onStorageMenuClick?: () => void;
  isStorageMenuOpen?: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  user, 
  onMainMenuClick, 
  isMainMenuOpen,
  onStorageMenuClick,
  isStorageMenuOpen
}) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState('');

  useEffect(() => {
    const timerId = setInterval(() => {
      const jakartaTime = new Date().toLocaleTimeString('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      setTime(jakartaTime);
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const handleLogout = async () => {
    if (window.google) {
      const token = window.gapi.client.getToken();
      if (token) {
        window.google.accounts.oauth2.revoke(token.access_token, () => {});
      }
    }
    await supabase.auth.signOut();
    localStorage.removeItem('googleDriveLinked');
    localStorage.removeItem('appFolderId');
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-zinc-900/80 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
        <nav className="flex items-center gap-4">
          {/* --- LOGIKA HAMBURGER BARU --- */}
          {/* Tampilkan tombol menu untuk Storage Sidebar */}
          {onStorageMenuClick && (
             <div className="md:hidden">
               <button onClick={onStorageMenuClick} className="p-2 text-neutral-300">
                  {isStorageMenuOpen ? <VscChromeClose size={24} /> : <VscMenu size={24} />}
               </button>
             </div>
          )}

          <Link to="/dashboard" className="font-monument text-xl font-bold text-white">
            CloudNest
          </Link>
          
          {/* Navigasi Desktop tetap sama */}
          <div className="hidden items-center gap-6 md:flex">
            <Link to="/dashboard" className="text-sm font-semibold tracking-wide text-neutral-300 transition-colors hover:text-primary">Beranda</Link>
            <Link to="/storage/private/overview" className="text-sm font-semibold tracking-wide text-neutral-300 transition-colors hover:text-primary">My Google Drive</Link>
            <Link to="/dashboard/share" className="text-sm font-semibold tracking-wide text-neutral-300 transition-colors hover:text-primary">Shared</Link>
          </div>
        </nav>

        {/* Bagian Kanan */}
        <div className="flex items-center gap-2">
          {/* Tampilkan tombol menu untuk Main Nav */}
          {onMainMenuClick && (
            <div className="md:hidden">
              <button onClick={onMainMenuClick} className="p-2 text-neutral-300">
                {isMainMenuOpen ? <VscChromeClose size={24} /> : <VscMenu size={24} />}
              </button>
            </div>
          )}

          <div className="hidden sm:flex items-center gap-2 text-neutral-400">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="font-mono text-sm">{time} (WIB)</span>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 rounded-full p-2 text-neutral-300 transition-colors hover:bg-white/10 hover:text-white">
              <img src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.email}`} alt="Avatar" className="h-8 w-8 rounded-full object-cover" />
              <VscChevronDown className={`transition-transform hidden sm:block ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-full right-0 mt-2 w-56 rounded-lg border border-white/10 bg-zinc-800 shadow-xl">
                  <ul className="py-2">
                    <li><Link to="/dashboard/profile" onClick={() => setIsDropdownOpen(false)} className="flex w-full items-center gap-3 px-4 py-2 text-sm text-neutral-200 hover:bg-primary/20"><VscAccount /> Profil Saya</Link></li>
                    <li><Link to="/dashboard/security" onClick={() => setIsDropdownOpen(false)} className="flex w-full items-center gap-3 px-4 py-2 text-sm text-neutral-200 hover:bg-primary/20"><VscShield /> Keamanan</Link></li>
                    <li><Link to="/dashboard/devices" onClick={() => setIsDropdownOpen(false)} className="flex w-full items-center gap-3 px-4 py-2 text-sm text-neutral-200 hover:bg-primary/20"><VscDeviceMobile /> Perangkat Saya</Link></li>
                    <li><Link to="/dashboard/integrations" onClick={() => setIsDropdownOpen(false)} className="flex w-full items-center gap-3 px-4 py-2 text-sm text-neutral-200 hover:bg-primary/20"><VscSettings /> Integrasi</Link></li>
                    <li><hr className="my-2 border-white/10" /><button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20"><VscSignOut /> Logout</button></li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};
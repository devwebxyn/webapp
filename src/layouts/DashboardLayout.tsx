// src/layouts/DashboardLayout.tsx

import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { DashboardFooter } from '../components/dashboard/DashboardFooter';
import { useAuth } from '../components/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';

export const DashboardLayout: React.FC = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State untuk menu utama

  return (
    <div className="flex min-h-screen flex-col bg-black">
        <DashboardHeader 
          user={user} 
          onMainMenuClick={() => setIsMenuOpen(!isMenuOpen)} // Teruskan fungsi toggle
          isMainMenuOpen={isMenuOpen} // Teruskan state
        />
        
        {/* Panel Menu Mobile untuk Navigasi Utama */}
        <AnimatePresence>
          {isMenuOpen && (
              <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden md:hidden border-b border-white/10"
              >
                  <nav className="flex flex-col gap-1 p-4">
                      <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block rounded-md px-4 py-2 text-base font-semibold text-neutral-300 hover:bg-white/10 hover:text-primary">Beranda</Link>
                      <Link to="/storage/private/overview" onClick={() => setIsMenuOpen(false)} className="block rounded-md px-4 py-2 text-base font-semibold text-neutral-300 hover:bg-white/10 hover:text-primary">My Google Drive</Link>
                      <Link to="/dashboard/share" onClick={() => setIsMenuOpen(false)} className="block rounded-md px-4 py-2 text-base font-semibold text-neutral-300 hover:bg-white/10 hover:text-primary">Shared</Link>
                  </nav>
              </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-grow">
            <Outlet />
        </main>
        
        <DashboardFooter />
    </div>
  );
};
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { VscSignOut } from 'react-icons/vsc';
import { type User } from '@supabase/supabase-js';

// --- PERBAIKAN 1: Definisikan interface untuk props ---
// Beritahu TypeScript bahwa komponen ini akan menerima prop 'user'
// yang tipenya bisa User atau null.
interface DashboardHeaderProps {
  user: User | null;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-zinc-900/80 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
        <nav className="flex items-center gap-6">
          <Link to="/dashboard" className="font-monument text-xl font-bold text-white">CloudNest</Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link to="/storage/private" className="text-sm font-semibold tracking-wide text-neutral-300 transition-colors hover:text-primary">
              Private Storage
            </Link>
            <Link to="/storage/shared" className="text-sm font-semibold tracking-wide text-neutral-300 transition-colors hover:text-primary">
              Shared Storage
            </Link>
          </div>
        </nav>
        <div className="flex items-center gap-4">
          {/* --- PERBAIKAN 2: Gunakan prop 'user' untuk menampilkan email --- */}
          <span className="hidden text-sm text-neutral-400 sm:block">{user?.email || '...'}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-neutral-300 transition-colors hover:border-red-500/50 hover:bg-red-500/20 hover:text-red-400"
          >
            <VscSignOut />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
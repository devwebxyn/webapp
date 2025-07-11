import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../AuthContext';
// Impor ikon baru untuk integrasi
import { VscAccount, VscDashboard, VscShield, VscVm, VscPlug } from 'react-icons/vsc';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: <VscDashboard /> },
  { to: '/dashboard/profile', label: 'Profil Pengguna', icon: <VscAccount /> },
  { to: '/dashboard/security', label: 'Keamanan', icon: <VscShield /> },
  // --- TAMBAHKAN BARIS INI ---
  { to: '/dashboard/integrations', label: 'Brankas Fondasi', icon: <VscPlug /> },
  { to: '/dashboard/devices', label: 'Perangkat', icon: <VscVm /> },
];

export const DashboardSidebar: React.FC = () => {
  const { user } = useAuth();

  return (
    <aside className="w-64 flex-shrink-0 border-r border-white/10 bg-zinc-900 p-6 hidden md:flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <img
          src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.user_metadata?.full_name || user?.email}`}
          alt="Avatar"
          className="h-12 w-12 rounded-full border-2 border-primary/50 object-cover"
        />
        <div>
          <p className="font-bold text-white truncate">{user?.user_metadata?.full_name || user?.email}</p>
          <p className="text-xs text-neutral-400">Premium User</p>
        </div>
      </div>
      <nav className="flex flex-col gap-2">
        {navLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/dashboard'} 
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/20 text-primary'
                  : 'text-neutral-400 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
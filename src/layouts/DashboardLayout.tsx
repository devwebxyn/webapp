import React from 'react'; // Hapus useState
import { Outlet } from 'react-router-dom';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { DashboardFooter } from '../components/dashboard/DashboardFooter';
// Hapus import SettingsModal
import { useAuth } from '../components/AuthContext';

export const DashboardLayout: React.FC = () => {
  const { user } = useAuth();
  // Hapus state isSettingsOpen

  return (
    <div className="flex min-h-screen flex-col bg-black">
        {/* Hapus prop onSettingsClick, karena sudah tidak dipakai */}
        <DashboardHeader user={user} />
        
        <main className="flex-grow">
            <Outlet />
        </main>
        
        <DashboardFooter />
        
        {/* Hapus komponen SettingsModal dari sini */}
    </div>
  );
};
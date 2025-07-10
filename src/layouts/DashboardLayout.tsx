// src/layouts/DashboardLayout.tsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { DashboardFooter } from '../components/dashboard/DashboardFooter';
import { SettingsModal } from '../components/dashboard/SettingsModal';
import { useAuth } from '../components/AuthContext';

export const DashboardLayout: React.FC = () => {
  const { user } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-black">
        {/* Header ini akan memanggil setIsSettingsOpen(true) saat ikon gear diklik */}
        <DashboardHeader user={user} onSettingsClick={() => setIsSettingsOpen(true)} />
        
        <main className="flex-grow">
            {/* Outlet akan merender halaman seperti DashboardPage */}
            <Outlet />
        </main>
        
        <DashboardFooter />
        
        {/* Modal hanya muncul jika isSettingsOpen bernilai true */}
        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};
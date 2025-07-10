import React from 'react';
import { useAuth } from '../components/AuthContext';
import { WelcomeBanner } from '../components/dashboard/WelcomeBanner';
import { StatsCards } from '../components/dashboard/StatsCards';
import { QuickActions } from '../components/dashboard/QuickActions';
import { SecurityTip } from '../components/dashboard/SecurityTip';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Data dummy untuk statistik, bisa diganti dengan data asli nanti
  const stats = {
    totalFiles: 1240,
    storageUsed: 15.7,
    folders: 83,
    accountType: 'Premium',
  };

  return (
    <div className="p-4 md:p-8">
      {/* 1. Menampilkan banner selamat datang */}
      <WelcomeBanner userName={user?.user_metadata?.full_name || user?.email} />
      
      {/* 2. Menampilkan kartu-kartu statistik */}
      <StatsCards stats={stats} />
      
      {/* 3. Menampilkan tombol aksi cepat */}
      <QuickActions />
      
      {/* 4. Menampilkan tips keamanan */}
      <SecurityTip />
    </div>
  );
};
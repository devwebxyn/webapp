import React from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { DashboardFooter } from '../components/dashboard/DashboardFooter';
import { useAuth } from '../components/AuthContext'; // 1. Impor hook useAuth

export const DashboardLayout: React.FC = () => {
  const { user } = useAuth(); // 2. Ambil data 'user' dari context

  return (
    <div className="flex min-h-screen flex-col bg-black">
        {/* 3. Kirim 'user' sebagai prop ke DashboardHeader */}
        <DashboardHeader user={user} />
        <main className="flex-grow">
            <Outlet />
        </main>
        <DashboardFooter />
    </div>
  );
};
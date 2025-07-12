import React from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { StorageSidebar } from '../components/dashboard/StorageSidebar';
import { useAuth } from '../components/AuthContext';

export const StorageLayout: React.FC = () => {
    const { user } = useAuth();
    
    return (
        <div className="flex flex-col h-screen bg-black">
            <DashboardHeader user={user} />
            <div className="flex flex-grow overflow-hidden">
                <StorageSidebar />
                <main className="flex-grow overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
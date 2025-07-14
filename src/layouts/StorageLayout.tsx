// src/layouts/StorageLayout.tsx

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import StorageSidebar from '../components/dashboard/StorageSidebar';
import { useAuth } from '../components/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';

export const StorageLayout: React.FC = () => {
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex flex-col h-screen bg-black">
            <DashboardHeader 
                user={user} 
                onStorageMenuClick={toggleSidebar} 
                isStorageMenuOpen={isSidebarOpen}
            />
            <div className="flex flex-grow overflow-hidden relative">
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleSidebar}
                            className="fixed inset-0 bg-black/60 z-40 md:hidden"
                        />
                    )}
                </AnimatePresence>

                <StorageSidebar isOpen={isSidebarOpen} />
                
                <main className="flex-grow overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
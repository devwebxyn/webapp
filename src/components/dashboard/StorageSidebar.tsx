// src/components/dashboard/StorageSidebar.tsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useGoogleDrive } from '../../hooks/useGoogleDrive';
import {
    VscHome,
    VscCloud,
    VscTrash,
    VscHistory,
    VscStarFull as VscStar,
    VscServerProcess
} from 'react-icons/vsc';

interface StorageSidebarProps {
  isOpen: boolean;
}

const StorageSidebar: React.FC<StorageSidebarProps> = ({ isOpen }) => {
    const { storageQuota, isLoading } = useGoogleDrive();

    const formatBytes = (bytes: number, decimals = 2) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    const usage = storageQuota?.usage ? parseInt(storageQuota.usage) : 0;
    const limit = storageQuota?.limit ? parseInt(storageQuota.limit) : 1;
    const usagePercentage = limit > 0 ? (usage / limit) * 100 : 0;

    const usageFormatted = formatBytes(usage);
    const limitFormatted = storageQuota?.limit ? formatBytes(limit) : 'N/A';

    const getProgressBarColor = () => {
        if (usagePercentage > 90) return 'bg-red-500';
        if (usagePercentage > 70) return 'bg-yellow-500';
        return 'bg-primary';
    };

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-3 p-2 rounded-md hover:bg-white/10 transition-colors ${
            isActive ? 'bg-primary text-background font-bold' : ''
        }`;

    return (
        <aside 
            className={`
                fixed top-0 left-0 h-full bg-zinc-900 text-neutral-300 w-64 p-4 flex flex-col border-r border-white/10
                transform transition-transform duration-300 ease-in-out z-50
                md:relative md:transform-none md:z-auto
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
        >
            <nav className="flex-grow overflow-y-auto">
                <ul className="space-y-1">
                    <li><NavLink to="/storage/private/overview" className={navLinkClass}><VscHome /> Ringkasan</NavLink></li>
                    <li><NavLink to="/storage/private" className={navLinkClass}><VscCloud /> File Saya</NavLink></li>
                    <li><NavLink to="/dashboard/share" className={navLinkClass}><VscStar /> Dibagikan</NavLink></li>
                    <li><NavLink to="/storage/private/inbox" className={navLinkClass}><VscHistory /> Inbox</NavLink></li>
                    <li><NavLink to="/storage/private/trash" className={navLinkClass}><VscTrash /> Sampah</NavLink></li>
                </ul>
            </nav>

            <div className="mt-auto pt-4 border-t border-white/10">
                {isLoading && !storageQuota ? (
                     <div className="animate-pulse">
                        <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                        <div className="h-2 bg-white/10 rounded w-full mb-2"></div>
                        <div className="h-3 bg-white/10 rounded w-1/2"></div>
                    </div>
                ) : storageQuota ? (
                    <div className="text-sm">
                        <p className="font-semibold text-white mb-2 flex items-center gap-2"><VscServerProcess /> Kuota Penyimpanan</p>
                        <div className="w-full bg-white/10 rounded-full h-2.5 mb-2 overflow-hidden">
                           <div className={`${getProgressBarColor()} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${usagePercentage}%` }}></div>
                        </div>
                        <p className="text-neutral-400">{usageFormatted} dari {limitFormatted} digunakan</p>
                    </div>
                ) : (
                    <p className="text-sm text-neutral-500">Gagal memuat kuota.</p>
                )}
            </div>
        </aside>
    );
};

export default StorageSidebar;
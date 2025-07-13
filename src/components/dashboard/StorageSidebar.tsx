import React from 'react';
import { NavLink } from 'react-router-dom';
import { useGoogleDrive } from '../../hooks/useGoogleDrive';
import { VscCheck, VscFile, VscMail, VscTrash } from 'react-icons/vsc';

const navItems = [
  { to: '/storage/private/overview', label: 'Overview', icon: <VscCheck /> },
  { to: '/storage/private', label: 'My Files', icon: <VscFile /> },
  { to: '/storage/private/inbox', label: 'Inbox', icon: <VscMail /> },
  { to: '/storage/private/trash', label: 'Trash', icon: <VscTrash /> },
];

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export const StorageSidebar: React.FC = () => {
  const { storageQuota } = useGoogleDrive();

  const usagePercentage = storageQuota
    ? (storageQuota.usage / storageQuota.limit) * 100
    : 0;

  return (
    <aside className="hidden md:flex w-64 flex-shrink-0 flex-col bg-zinc-900/50 border-r border-white/10 p-6">
      <nav className="flex-grow">
        <ul className="space-y-2">
          {navItems.map(item => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/storage/private'}
                className={({ isActive }) =>
                  `flex w-full items-center gap-3 rounded-md p-3 text-left text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-primary/20 text-primary'
                      : 'text-neutral-300 hover:bg-white/5'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Storage Bar */}
      {storageQuota && (
        <div className="mt-auto">
          <h4 className="text-sm font-bold text-white mb-2">Penyimpanan</h4>
          <div className="w-full bg-black/30 rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full"
              style={{ width: `${usagePercentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-neutral-400 mt-2">
            {formatBytes(storageQuota.usage)} dari {formatBytes(storageQuota.limit)} digunakan
          </p>
        </div>
      )}
    </aside>
  );
};
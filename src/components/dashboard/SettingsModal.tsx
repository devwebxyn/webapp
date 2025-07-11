import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Impor ikon baru
import { VscChromeClose, VscAccount, VscShield, VscVm, VscPlug } from 'react-icons/vsc'; 
import { ProfileSettings } from './settings/ProfileSettings';
import { SecuritySettings } from './settings/SecuritySettings';
import { DeviceSettings } from './settings/DeviceSettings';
// Impor halaman integrasi yang sudah kita buat
import { IntegrationsPage } from './settings/IntegrationsPage'; 

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Tambahkan 'integrations' ke dalam tipe ActiveTab
type ActiveTab = 'profile' | 'security' | 'devices' | 'integrations';

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('profile');

  // Tambahkan item baru untuk Brankas Fondasi
  const sidebarItems = [
    { id: 'profile', label: 'Profil Pengguna', icon: <VscAccount /> },
    { id: 'security', label: 'Keamanan', icon: <VscShield /> },
    { id: 'integrations', label: 'Brankas Fondasi', icon: <VscPlug /> },
    { id: 'devices', label: 'Perangkat', icon: <VscVm /> },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          
          <motion.div
            className="relative z-10 flex h-[80vh] w-full max-w-4xl flex-col rounded-2xl border border-white/10 bg-zinc-900 shadow-xl"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <header className="flex shrink-0 items-center justify-between border-b border-white/10 p-4">
              <h2 className="font-monument text-xl text-white">Pengaturan</h2>
              <button onClick={onClose} className="text-neutral-500 transition-colors hover:text-white">
                <VscChromeClose size={24} />
              </button>
            </header>

            <div className="flex flex-grow overflow-hidden">
              {/* Sidebar */}
              <aside className="w-1/4 shrink-0 border-r border-white/10 p-4">
                <nav>
                  <ul className="space-y-2">
                    {sidebarItems.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => setActiveTab(item.id as ActiveTab)}
                          className={`flex w-full items-center gap-3 rounded-md p-3 text-left text-sm transition-colors ${
                            activeTab === item.id ? 'bg-primary/20 text-primary' : 'text-neutral-300 hover:bg-white/5'
                          }`}
                        >
                          {item.icon}
                          <span className="font-semibold">{item.label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </aside>

              {/* Konten */}
              <main className="w-3/4 overflow-y-auto p-8">
                {activeTab === 'profile' && <ProfileSettings />}
                {activeTab === 'security' && <SecuritySettings />}
                {/* TAMBAHKAN KONDISI UNTUK MERENDER HALAMAN INTEGRASI */}
                {activeTab === 'integrations' && <IntegrationsPage />}
                {activeTab === 'devices' && <DeviceSettings />}
              </main>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
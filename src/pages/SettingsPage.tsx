import React, { useState } from 'react';
import { VscAccount, VscShield, VscVm, VscPlug } from 'react-icons/vsc';
import { motion } from 'framer-motion';

// Impor semua komponen pengaturan yang sudah ada
import { ProfileSettings } from '../components/dashboard/settings/ProfileSettings';
import { SecuritySettings } from '../components/dashboard/settings/SecuritySettings';
import { DeviceSettings } from '../components/dashboard/settings/DeviceSettings';
import { IntegrationsPage } from '../components/dashboard/settings/IntegrationsPage';

type ActiveTab = 'profile' | 'security' | 'integrations' | 'devices';

const settingItems = [
  { id: 'profile', label: 'Profil Pengguna', icon: <VscAccount /> },
  { id: 'security', label: 'Keamanan', icon: <VscShield /> },
  { id: 'integrations', label: 'Brankas Fondasi', icon: <VscPlug /> },
  { id: 'devices', label: 'Perangkat', icon: <VscVm /> },
];

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'integrations':
        return <IntegrationsPage />;
      case 'devices':
        return <DeviceSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-monument text-3xl text-white mb-8">Pengaturan</h1>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Sidebar Pengaturan */}
            <motion.aside 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="w-full md:w-1/4 lg:w-1/5 shrink-0"
            >
              <nav className="bg-zinc-900/50 border border-white/10 rounded-xl p-4">
                <ul className="space-y-1">
                  {settingItems.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => setActiveTab(item.id as ActiveTab)}
                          className={`w-full flex items-center gap-3 rounded-md p-3 text-left text-sm font-semibold transition-colors ${
                            activeTab === item.id 
                              ? 'bg-primary/20 text-primary' 
                              : 'text-neutral-300 hover:bg-white/5'
                          }`}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </button>
                      </li>
                  ))}
                </ul>
              </nav>
            </motion.aside>

            {/* Konten Pengaturan */}
            <motion.main 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="w-full md:w-3/4 lg:w-4/5"
            >
              <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 md:p-8 min-h-[60vh]">
                {renderContent()}
              </div>
            </motion.main>
        </div>
    </div>
  );
};
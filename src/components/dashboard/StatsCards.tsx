import React from 'react';
import { motion } from 'framer-motion';
import { VscFile, VscCloudUpload, VscFolder, VscVm } from 'react-icons/vsc';

const cardData = [
  { icon: <VscFile />, title: 'Total File', key: 'totalFiles', unit: '' },
  { icon: <VscCloudUpload />, title: 'Penyimpanan Terpakai', key: 'storageUsed', unit: ' GB' },
  { icon: <VscFolder />, title: 'Total Folder', key: 'folders', unit: '' },
  { icon: <VscVm />, title: 'Status Akun', key: 'accountType', unit: '' },
];

export const StatsCards: React.FC<{ stats: any }> = ({ stats }) => {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cardData.map((item, index) => (
        <motion.div
          key={item.title}
          className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900 p-5 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 * index }}
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-white/5 p-2 text-primary">{item.icon}</div>
            <p className="text-sm font-medium text-neutral-400">{item.title}</p>
          </div>
          <p className="mt-4 text-2xl font-semibold text-white">
            {stats[item.key]}
            <span className="text-base font-normal text-neutral-500">{item.unit}</span>
          </p>
        </motion.div>
      ))}
    </div>
  );
};
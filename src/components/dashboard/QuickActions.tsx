import React from 'react';
import { motion } from 'framer-motion';
import { VscCloudUpload, VscNewFolder, VscLink } from 'react-icons/vsc';

const actions = [
    { icon: <VscCloudUpload size={20} />, label: 'Upload File' },
    { icon: <VscNewFolder size={20} />, label: 'Buat Folder' },
    { icon: <VscLink size={20} />, label: 'Bagikan File' },
];

export const QuickActions: React.FC = () => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-white">Aksi Cepat</h3>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {actions.map((action, _index) => (
          <motion.button
            key={action.label}
            className="flex items-center justify-center gap-3 rounded-lg bg-white/5 p-4 text-center font-medium text-neutral-200 transition-colors hover:bg-primary hover:text-black"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {action.icon}
            {action.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
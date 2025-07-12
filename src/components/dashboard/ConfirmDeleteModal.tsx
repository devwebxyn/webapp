import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VscTrash } from 'react-icons/vsc';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  isLoading: boolean;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0" onClick={onClose} />
        <motion.div
          className="relative bg-zinc-800 p-8 rounded-lg shadow-xl w-full max-w-md text-center"
          initial={{ scale: 0.9, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
            <VscTrash className="h-6 w-6 text-red-500" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-white">Hapus Item Ini?</h3>
          <p className="mt-2 text-sm text-neutral-400">
            Apakah Anda yakin ingin menghapus <strong className="text-white break-all">"{itemName}"</strong>? Tindakan ini akan memindahkannya ke sampah.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="w-full rounded-md bg-neutral-600 py-2 text-sm font-semibold text-white hover:bg-neutral-500 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full rounded-md bg-red-600 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
            >
              {isLoading ? 'Menghapus...' : 'Ya, Hapus'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
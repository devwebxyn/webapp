import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGoogleDrive } from '../hooks/useGoogleDrive';
import { VscFile, VscFolder, VscLoading, VscTrash, VscReply } from 'react-icons/vsc';
import { ConfirmDeleteModal } from '../components/dashboard/ConfirmDeleteModal';

// Fungsi untuk memformat waktu relatif
const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (diffDays > 0) return `${diffDays} hari yang lalu`;
    const diffHours = Math.floor(diff / (1000 * 60 * 60));
    if (diffHours > 0) return `${diffHours} jam yang lalu`;
    const diffMinutes = Math.floor(diff / (1000 * 60));
    if (diffMinutes > 0) return `${diffMinutes} menit yang lalu`;
    return 'Baru saja';
};

export const TrashPage: React.FC = () => {
  // Mengambil state dan fungsi dari hook useGoogleDrive
  const { trashedFiles, isLoading, listTrash, restoreItem, deleteItemPermanently, isApiReady } = useGoogleDrive();
  
  // State untuk mengelola modal konfirmasi hapus
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string, name: string } | null>(null);

  // Mengambil daftar sampah saat API siap
  useEffect(() => {
    if (isApiReady) {
      listTrash();
    }
  }, [isApiReady, listTrash]);

  // Menangani klik pada tombol hapus
  const handleDeleteClick = (file: { id: string, name: string }) => {
    setItemToDelete(file);
    setIsDeleteModalOpen(true);
  };

  // Menangani konfirmasi hapus
  const handleConfirmDelete = () => {
    if (itemToDelete) {
      deleteItemPermanently(itemToDelete.id, itemToDelete.name).then(() => {
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
      });
    }
  };

  return (
    <div className="p-4 md:p-8">
      {/* Render modal konfirmasi hapus */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.name || ''}
        isLoading={isLoading}
        isPermanent={true} // Tandai ini sebagai hapus permanen
      />
      
      <h1 className="font-monument text-3xl text-white">Sampah</h1>
      <p className="text-neutral-400 mb-8">Item di sini akan dihapus permanen setelah 30 hari.</p>
      
      <div className="overflow-x-auto bg-zinc-900/50 border border-white/10 rounded-xl">
        <table className="w-full text-left">
          <thead className="border-b border-white/10">
            <tr className="text-xs text-neutral-400 uppercase">
              <th className="p-4">Nama</th>
              <th className="p-4">Ukuran</th>
              <th className="p-4">Waktu Dihapus</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={4} className="text-center p-12"><VscLoading className="animate-spin inline-block text-2xl" /></td></tr>
            )}
            {!isLoading && trashedFiles.length === 0 && (
              <tr><td colSpan={4} className="text-center p-12 text-neutral-500">Sampah Anda kosong.</td></tr>
            )}
            {trashedFiles.map(file => (
              <motion.tr key={file.id} className="border-b border-white/5 last:border-b-0" layout>
                <td className="p-4 font-semibold text-white">
                  <div className="flex items-center gap-3">
                    {file.mimeType.includes('folder') ? <VscFolder className="text-primary"/> : <VscFile className="text-neutral-400"/>}
                    <span>{file.name}</span>
                  </div>
                </td>
                <td className="p-4 text-neutral-400">{file.size}</td>
                <td className="p-4 text-neutral-400">{formatRelativeTime(file.modifiedTime!)}</td>
                <td className="p-4 text-right flex justify-end gap-2 text-neutral-400">
                  <button onClick={() => restoreItem(file.id, file.name)} title="Pulihkan" className="p-2 rounded-md hover:bg-green-500/20 hover:text-green-400">
                    <VscReply />
                  </button>
                  <button onClick={() => handleDeleteClick(file)} title="Hapus Permanen" className="p-2 rounded-md hover:bg-red-500/20 hover:text-red-400">
                    <VscTrash />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

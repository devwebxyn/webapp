// src/pages/StoragePage.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGoogleDrive } from '../hooks/useGoogleDrive';
import {
  VscFile, VscFolder, VscCloudUpload, VscLink, VscEye, VscLoading,
  VscLock, VscGlobe, VscSettings, VscArrowRight, VscArrowLeft,
  VscPlug, VscNewFolder, VscTrash,
} from 'react-icons/vsc';
import { FaGoogleDrive } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CreateFolderModal } from '../components/dashboard/settings/CreateFolderModal';
import { UploadDestinationModal } from '../components/dashboard/UploadDestinationModal';
import { ConfirmDeleteModal } from '../components/dashboard/ConfirmDeleteModal';

const FlowchartGuide: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.5, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="text-center py-16 px-4">
      <motion.h1 variants={itemVariants} className="font-monument text-4xl text-white">
        Aktifkan Brankas Google Drive Anda
      </motion.h1>
      <motion.p variants={itemVariants} className="text-neutral-400 max-w-xl mx-auto mt-2 mb-12">
        Ikuti tiga langkah mudah ini untuk menautkan akun Anda dan mulai mengelola file dengan aman.
      </motion.p>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative flex flex-col md:flex-row justify-center items-center gap-8 md:gap-0"
      >
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-800 hidden md:block" />
        <motion.div
          className="absolute top-1/2 left-0 h-0.5 bg-primary hidden md:block"
          initial={{ width: 0 }}
          animate={{ width: '66%' }}
          transition={{ duration: 1.5, delay: 1, ease: 'easeInOut' }}
        />
        {[
          { icon: <VscSettings />, title: "Langkah 1", desc: "Buka Modal Pengaturan melalui foto profil anda di pojok kanan atas." },
          { icon: <VscPlug />, title: "Langkah 2", desc: "Pilih menu \"integrasi\" di dropdown pengaturan." },
          { icon: <FaGoogleDrive className="text-green-400" />, title: "Langkah 3", desc: "Klik tombol \"Tautkan Akun\" dan berikan izin yang diperlukan." },
        ].map((step, i) => (
          <motion.div key={i} variants={itemVariants} className="relative z-10 flex flex-col items-center w-52">
            <div className="w-20 h-20 rounded-full bg-zinc-900 border-2 border-primary/50 flex items-center justify-center">
              {step.icon}
            </div>
            <h3 className="mt-4 font-bold text-white">{step.title}</h3>
            <p className="text-xs text-neutral-400 h-10">{step.desc}</p>
          </motion.div>
        ))}
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
        <Link to="/dashboard/integrations" className="mt-12 bg-primary text-background font-bold px-8 py-3 rounded-md inline-flex items-center gap-3 group">
          Mulai Penautan <VscArrowRight className="transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </div>
  );
};

const FileManager: React.FC = () => {
  const {
    files, isLoading, uploadFile, setFilePermission,
    navigateToFolder, breadcrumbs, createFolder, deleteItem
  } = useGoogleDrive();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string, name: string } | null>(null);

  const handleDeleteClick = (file: { id: string, name: string }) => {
        setItemToDelete(file);
        setIsDeleteModalOpen(true);
    };

  const copyLink = (fileId: string) => {
    navigator.clipboard.writeText(`https://drive.google.com/file/d/${fileId}/view`);
    toast.success('Link berhasil disalin!');
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      deleteItem(itemToDelete.id, itemToDelete.name).then(() => {
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
     });
    }
    };

  return (
    <div>
      <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          itemName={itemToDelete?.name || ''}
          isLoading={isLoading}
      />


      <CreateFolderModal
              isOpen={isCreateFolderModalOpen}
              onClose={() => setIsCreateFolderModalOpen(false)}
              onCreate={createFolder} isLoading={false}      />
      <UploadDestinationModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={uploadFile}
      />

      <div className="flex items-center gap-2 mb-4 text-sm text-neutral-400">
        {breadcrumbs.length > 1 && (
          <>
            <button
              onClick={() => {
                const parent = breadcrumbs[breadcrumbs.length - 2];
                navigateToFolder(parent.id, parent.name);
              }}
              className="p-1 rounded-md hover:bg-white/10 hover:text-primary"
            >
              <VscArrowLeft />
            </button>
            <span>/</span>
          </>
        )}
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.id}>
            <button
              onClick={() => navigateToFolder(crumb.id, crumb.name)}
              className={`hover:text-primary hover:underline ${index === breadcrumbs.length - 1 ? 'text-white font-semibold' : ''}`}
            >
              {crumb.name}
            </button>
            {index < breadcrumbs.length - 1 && <span className="text-neutral-500">/</span>}
          </React.Fragment>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input type="text" placeholder="Cari file..." className="w-full bg-white/5 border border-white/10 rounded-md p-3 pl-4 text-white" />
        <button onClick={() => setIsCreateFolderModalOpen(true)} disabled={isLoading} className="flex items-center justify-center gap-2 bg-white/10 text-white font-bold p-3 rounded-md hover:bg-white/20">
          <VscNewFolder /> Buat Folder
        </button>
        <button onClick={() => setIsUploadModalOpen(true)} disabled={isLoading} className="flex items-center justify-center gap-2 bg-primary text-background font-bold p-3 rounded-md hover:bg-primary/80">
          <VscCloudUpload /> Upload File
        </button>
      </div>

      <div className="overflow-x-auto bg-zinc-900/50 border border-white/10 rounded-xl">
        <table className="w-full text-left">
          <thead className="border-b border-white/10">
            <tr className="text-xs text-neutral-400 uppercase">
              <th className="p-4">Nama</th>
              <th className="p-4">Ukuran</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && files.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center p-12">
                  <VscLoading className="animate-spin text-2xl" />
                </td>
              </tr>
            )}
            {!isLoading && files.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center p-12 text-neutral-500">Folder 'cloudnest' Anda kosong.</td>
              </tr>
            )}
            {files.map(file => (
              <motion.tr key={file.id} className="border-b border-white/5 last:border-b-0 hover:bg-white/5" layout>
                <td className="p-4 font-semibold text-white">
                  {file.mimeType?.includes('folder') ? (
                    <button onClick={() => navigateToFolder(file.id, file.name)} className="flex items-center gap-3 text-primary hover:underline">
                      <VscFolder /> <span>{file.name}</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <VscFile className="text-neutral-400" /> <span>{file.name}</span>
                    </div>
                  )}
                </td>
                <td className="p-4 text-neutral-400">{file.size}</td>
                <td className="p-4">
                  <button onClick={() => setFilePermission(file.id, !file.shared, file.mimeType)} className={`flex items-center gap-2 text-xs px-2 py-1 rounded-full font-semibold ${file.shared ? 'bg-green-500/20 text-green-300' : 'bg-zinc-700 text-neutral-300'}`}>
                    {file.shared ? <VscGlobe /> : <VscLock />} {file.shared ? 'Publik' : 'Privat'}
                  </button>
                </td>
                <td className="p-4 text-right flex justify-end gap-2 text-neutral-400">
                  <button onClick={() => handleDeleteClick(file)} className="p-2 rounded-md hover:bg-red-500/20 hover:text-red-400">
                    <VscTrash />
                  </button>
                  {!!file.webViewLink && (
                    <>
                     <button
                       onClick={() => {
                        if (file.webViewLink) {
                            setPreviewUrl(file.webViewLink.replace('/view', '/preview'));
                        }
                        }}
                         className="p-2 rounded-md hover:bg-white/10 hover:text-primary"
                       >
                        <VscEye />
                      </button>

                      
                      {file.shared && (
                        <button onClick={() => copyLink(file.id)} className="p-2 rounded-md hover:bg-white/10 hover:text-primary">
                          <VscLink />
                        </button>


                      )}
                    </>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {previewUrl && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4" onClick={() => setPreviewUrl(null)}>
          <iframe src={previewUrl} className="w-full max-w-4xl h-5/6 bg-zinc-900 rounded-lg border-0" title="File Preview" />
        </div>
      )}
    </div>
  );
};

export const StoragePage: React.FC = () => {
  const { isLinked, isApiReady } = useGoogleDrive();

  if (!isApiReady) {
    return <div className="flex-grow text-center p-24"><VscLoading className="animate-spin text-primary text-4xl" /></div>;
  }

  if (!isLinked) {
    return (
      <div className="flex-grow flex items-center justify-center p-4 md:p-8">
        <FlowchartGuide />
      </div>
    );
  }

  return (
    <div className="flex flex-grow w-full">
      <main className="flex-grow p-4 md:p-8">
        <FileManager />
      </main>
    </div>
  );
};

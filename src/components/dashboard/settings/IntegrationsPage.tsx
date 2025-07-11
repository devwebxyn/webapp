import React, { useState } from 'react';
import { useGoogleDrive } from '../../../hooks/useGoogleDrive';
import { FaGoogleDrive } from 'react-icons/fa'; // Pastikan FaGoogleDrive diimpor
import { VscCheck, VscPlug, VscLoading } from 'react-icons/vsc';
import { ContactDeveloperModal } from './ContactDeveloperModal';
import { toast } from 'react-toastify';

export const IntegrationsPage: React.FC = () => {
  const { isLinked, isApiReady, linkAccount, unlinkAccount, isLoading } = useGoogleDrive();
  
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [errorDetails, setErrorDetails] = useState('');

  const handleLinkAccount = () => {
    const errorCallback = (error: any) => {
      const details = `Error: ${error.type || 'Unknown'}\nDetails: ${error.details || 'Popup closed or blocked.'}`;
      setErrorDetails(details);
      
      toast.error(
        <div>
            <b>Gagal Menautkan Akun.</b>
            <button 
              className="mt-2 w-full text-left underline text-primary text-sm"
              onClick={() => setIsContactModalOpen(true)}
            >
              Klik di sini untuk menghubungi developer.
            </button>
        </div>, 
        { autoClose: false, closeOnClick: false, toastId: 'link-error' }
      );
    };

    linkAccount(errorCallback);
  };

  return (
    <>
      <ContactDeveloperModal 
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        errorDetails={errorDetails}
      />
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Brankas Fondasi</h2>
        <p className="text-neutral-400 mb-6">Hubungkan layanan cloud pihak ketiga untuk memperluas fungsionalitas CloudNest.</p>
        
        {/* --- KODE YANG DIPERBAIKI ADA DI DALAM DIV INI --- */}
        <div className="p-6 rounded-lg border border-white/10 bg-zinc-900/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Bagian Kiri: Logo dan Info */}
            <div className="flex items-center gap-4">
              <FaGoogleDrive className="text-4xl text-green-400 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-white text-lg">Google Drive</h3>
                <p className="text-sm text-neutral-400">
                  Status: {isLinked ? 
                    <span className="font-semibold text-green-400">Tertaut</span> : 
                    <span className="text-neutral-500">Tidak Tertaut</span>
                  }
                </p>
              </div>
            </div>
            
            {/* Bagian Kanan: Tombol Aksi */}
            <div className="flex-shrink-0">
              {!isApiReady || (isLoading && !isLinked) ? (
                <button disabled className="bg-neutral-600 text-background font-bold px-4 py-2 rounded-md flex items-center gap-2 cursor-wait w-full sm:w-auto justify-center">
                    <VscLoading className="animate-spin" /> Memuat...
                </button>
              ) : isLinked ? (
                <button onClick={unlinkAccount} className="bg-red-500/90 text-white font-semibold px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-600 transition-colors w-full sm:w-auto justify-center">
                  <VscCheck /> Putuskan Tautan
                </button>
              ) : (
                <button onClick={handleLinkAccount} className="bg-primary text-background font-bold px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary/80 transition-colors w-full sm:w-auto justify-center">
                  <VscPlug /> Tautkan Akun
                </button>
              )}
            </div>
          </div>
        </div>
        {/* --- AKHIR DARI BAGIAN YANG DIPERBAIKI --- */}

      </div>
    </>
  );
};
import React, { useState } from 'react';
import { useGoogleDrive } from '../../../hooks/useGoogleDrive';
import { FaGoogleDrive } from 'react-icons/fa';
import { VscCheck, VscPlug, VscLoading } from 'react-icons/vsc';
import { ContactDeveloperModal } from './ContactDeveloperModal';
import { toast } from 'react-toastify';

interface DriveError {
  type?: string;
  details?: string;
}

export const IntegrationsPage: React.FC = () => {
  const { isLinked, isApiReady, linkAccount, unlinkAccount, isLoading } = useGoogleDrive();
  
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [errorDetails, setErrorDetails] = useState('');

  const handleLinkAccount = async () => {
    try {
      await linkAccount(); // Call without any arguments
    } catch (error: unknown) {
      const driveError = error as DriveError;
      const details = `Error: ${driveError.type || 'Unknown'}\nDetails: ${driveError.details || 'Popup closed or blocked.'}`;
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
        { 
          autoClose: false, 
          closeOnClick: false, 
          toastId: 'link-error' 
        }
      );
    }
  };

  return (
    <>
      <ContactDeveloperModal 
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        errorDetails={errorDetails}
      />
      
      <div className="p-4 md:p-8">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-1">Brankas Fondasi</h2>
          <p className="text-neutral-400 max-w-3xl">
            Hubungkan layanan cloud pihak ketiga untuk memperluas fungsionalitas CloudNest.
          </p>
        </header>

        <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/40 rounded-xl border border-white/10 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-zinc-800 rounded-lg">
                <FaGoogleDrive className="text-3xl text-green-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Google Drive</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-block w-2 h-2 rounded-full ${isLinked ? 'bg-green-500' : 'bg-neutral-500'}`} />
                  <span className="text-sm text-neutral-400">
                    {isLinked ? 'Akun tertaut' : 'Belum tertaut'}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-auto">
              {!isApiReady || isLoading ? (
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-2 bg-neutral-700 text-neutral-300 px-4 py-2.5 rounded-lg font-medium"
                >
                  <VscLoading className="animate-spin" />
                  {isLoading ? 'Memproses...' : 'Memuat...'}
                </button>
              ) : isLinked ? (
                <button
                  onClick={unlinkAccount}
                  className="w-full flex items-center justify-center gap-2 bg-red-500/90 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
                >
                  <VscCheck />
                  Putuskan Tautan
                </button>
              ) : (
                <button
                  onClick={handleLinkAccount}
                  className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/80 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
                >
                  <VscPlug />
                  Tautkan Akun
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

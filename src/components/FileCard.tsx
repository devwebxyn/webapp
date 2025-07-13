import React from 'react';
import { VscFolder, VscFile, VscEye, VscStarFull, VscStarEmpty } from 'react-icons/vsc';
import type { DriveFile } from '../hooks/useGoogleDrive'; // Import DriveFile

// Perbarui props interface
interface FileCardProps {
  file: DriveFile;
  onClick: (file: DriveFile) => void;
  onToggleFeatured?: (file: DriveFile, isFeatured: boolean) => void;
}

export const FileCard: React.FC<FileCardProps> = ({ file, onClick, onToggleFeatured }) => {
  const isFolder = file.mimeType.includes('folder');
  
  const handleToggleFeatured = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFeatured) {
      onToggleFeatured(file, !file.isFeatured);
    }
  };

  return (
    // Menggunakan onClick dari props untuk seluruh kartu
    <div onClick={() => onClick(file)} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {isFolder ? (
            <VscFolder className="text-blue-400 text-2xl mr-2" />
          ) : (
            <VscFile className="text-neutral-400 text-2xl mr-2" />
          )}
          <h3 className="font-medium text-white truncate">{file.name}</h3>
        </div>
        {/* Tombol favorit tetap di sini */}
        {onToggleFeatured && (
           <button 
             onClick={handleToggleFeatured}
             className="text-yellow-400 hover:text-yellow-300 transition-colors p-1"
             aria-label={file.isFeatured ? "Hapus dari favorit" : "Tambah ke favorit"}
           >
             {file.isFeatured ? <VscStarFull size={18} /> : <VscStarEmpty size={18} />}
           </button>
        )}
      </div>
      
      <div className="text-sm text-gray-400 space-y-1 mb-4">
        <div className="flex justify-between">
          <span>Ukuran:</span>
          <span className="text-white">{file.size || '-'}</span>
        </div>
         <div className="flex justify-between">
          <span>Dibagikan:</span>
          <span className={file.shared ? "text-green-400" : "text-red-400"}>{file.shared ? 'Ya' : 'Tidak'}</span>
        </div>
      </div>
      
      <div className="flex space-x-2">
         {/* Tombol download sekarang ada di sini */}
        {!isFolder && file.webViewLink && (
          <a
            href={file.webViewLink.replace('/view?usp=drivesdk', '')} // Link langsung
            onClick={(e) => e.stopPropagation()} // Mencegah klik pada kartu
            className="flex-1 flex items-center justify-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <VscEye className="mr-1.5" /> Lihat di Drive
          </a>
        )}
      </div>
    </div>
  );
};
import React from 'react';
import { VscFolder, VscFile, VscEye, VscCloudDownload, VscStarFull, VscStarEmpty } from 'react-icons/vsc';
import { Link } from 'react-router-dom';

interface FileCardProps {
  file: {
    id: string;
    name: string;
    mimeType: string;
    size?: string;
    shared?: boolean;
    webViewLink?: string;
    isFeatured?: boolean;
  };
  onToggleFeatured?: (file: any, isFeatured: boolean) => void;
}

export const FileCard: React.FC<FileCardProps> = ({ file, onToggleFeatured }) => {
  const isFolder = file.mimeType.includes('folder');
  
  const handleToggleFeatured = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFeatured) {
      onToggleFeatured(file, !file.isFeatured);
    }
  };

  return (
    <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {isFolder ? (
            <VscFolder className="text-blue-400 text-2xl mr-2" />
          ) : (
            <VscFile className="text-blue-400 text-2xl mr-2" />
          )}
          <h3 className="font-medium text-white truncate">{file.name}</h3>
        </div>
        <div className="flex items-center space-x-2">
          {onToggleFeatured && (
            <button 
              onClick={handleToggleFeatured}
              className="text-yellow-400 hover:text-yellow-300 transition-colors"
              aria-label={file.isFeatured ? "Hapus dari favorit" : "Tambah ke favorit"}
            >
              {file.isFeatured ? <VscStarFull size={18} /> : <VscStarEmpty size={18} />}
            </button>
          )}
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            file.shared ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
          }`}>
            {file.shared ? 'Dibagikan' : 'Privat'}
          </span>
        </div>
      </div>
      
      <div className="text-sm text-gray-400 space-y-1 mb-4">
        <div className="flex justify-between">
          <span>Ukuran:</span>
          <span className="text-white">{file.size || '-'}</span>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Link
          to={isFolder ? `/dashboard/folder/${file.id}` : `/dashboard/file/${file.id}`}
          className="flex-1 flex items-center justify-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
        >
          <VscEye className="mr-1.5" /> Lihat
        </Link>
        
        {!isFolder && file.webViewLink && (
          <a
            href={`${file.webViewLink}&export=download`}
            className="flex items-center justify-center px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <VscCloudDownload className="mr-1.5" /> Unduh
          </a>
        )}
      </div>
    </div>
  );
};

export default FileCard;

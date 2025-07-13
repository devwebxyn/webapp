import { memo } from 'react';
import type { DriveFile } from '../hooks/useGoogleDrive';
import { FileCard } from './FileCard';

interface FileListProps {
  files: DriveFile[];
  onFileClick: (file: DriveFile) => void;
  currentFolderId: string;
  isLoading?: boolean;
}

export const FileList = memo(({ files, onFileClick, currentFolderId, isLoading }: FileListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="bg-white/5 rounded-lg p-4 animate-pulse h-36">
            <div className="h-6 bg-white/10 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-white/10 rounded w-1/2"></div>
            <div className="h-4 bg-white/10 rounded w-1/4 mt-2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {files.map((file) => (
        <FileCard 
          key={`${currentFolderId}-${file.id}`}
          file={file}
          onClick={onFileClick} // Menggunakan onFileClick yang dioper dari props
        />
      ))}
    </div>
  );
});

FileList.displayName = 'FileList';
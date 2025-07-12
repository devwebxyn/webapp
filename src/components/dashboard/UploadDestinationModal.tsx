import React, { useState, useEffect } from 'react';
import { useGoogleDrive, type FolderNode } from '../../hooks/useGoogleDrive';
import { VscFolder, VscFile, VscLoading, VscCloudUpload } from 'react-icons/vsc';
import { toast } from 'react-toastify';

const FolderTree: React.FC<{
  nodes: FolderNode[];
  selectedFolderId: string | null;
  onSelectFolder: (id: string, name: string) => void;
  level?: number;
}> = ({ nodes, selectedFolderId, onSelectFolder, level = 0 }) => {
  return (
    <ul style={{ paddingLeft: `${level * 16}px` }}>
      {nodes.map((node) => (
        <li key={node.id}>
          <button
            onClick={() => onSelectFolder(node.id, node.name)}
            className={`flex items-center w-full text-left p-1 rounded-md ${
              selectedFolderId === node.id
                ? 'bg-primary text-background'
                : 'hover:bg-white/10'
            }`}
          >
            <VscFolder className="mr-2 flex-shrink-0" />
            <span className="truncate">{node.name}</span>
          </button>
          {node.children?.length > 0 && (
            <FolderTree
              nodes={node.children}
              selectedFolderId={selectedFolderId}
              onSelectFolder={onSelectFolder}
              level={level + 1}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

export const UploadDestinationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, folderId: string, onProgress: (progress: number) => void) => void;
}> = ({ isOpen, onClose, onUpload }) => {
  const { getFolderTree } = useGoogleDrive();
  const [tree, setTree] = useState<FolderNode[]>([]);
  const [isLoadingTree, setIsLoadingTree] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<{ id: string; name: string } | null>({
    id: 'root',
    name: 'My Drive (Root)',
  });
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const isUploading = uploadProgress !== null && uploadProgress < 100;

  useEffect(() => {
    if (isOpen) {
      setIsLoadingTree(true);
      getFolderTree().then((folderTree) => {
        setTree(folderTree);
        setIsLoadingTree(false);
      });
    }
  }, [isOpen, getFolderTree]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileToUpload(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (fileToUpload && selectedFolder) {
      setUploadProgress(0);
      onUpload(fileToUpload, selectedFolder.id, (progress) => {
        setUploadProgress(progress);
        if (progress >= 100) {
          setTimeout(() => {
            onClose();
            setUploadProgress(null);
            setFileToUpload(null);
          }, 1000);
        }
      });
    } else {
      toast.warn('Silakan pilih folder tujuan dan file untuk diunggah.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4">
      <div className="bg-zinc-800 p-6 rounded-lg shadow-xl w-full max-w-lg flex flex-col h-[80vh]">
        <h3 className="text-xl font-bold text-white mb-4">Pilih Tujuan Upload</h3>

        {uploadProgress !== null ? (
          <div className="my-4 text-center">
            <p className="text-white mb-2">
              {isUploading ? `Mengunggah... ${uploadProgress}%` : 'Selesai!'}
            </p>
            <div className="w-full bg-black/30 rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-grow border border-white/10 rounded-md p-2 overflow-y-auto max-h-64">
              {isLoadingTree ? (
                <VscLoading className="animate-spin m-auto text-2xl" />
              ) : (
                <FolderTree
                  nodes={tree}
                  selectedFolderId={selectedFolder?.id || null}
                  onSelectFolder={(id, name) => setSelectedFolder({ id, name })}
                />
              )}
            </div>

            <div className="mt-4">
              <label className="flex items-center gap-2 w-full border border-dashed border-white/20 rounded-md p-3 cursor-pointer hover:bg-white/5">
                <VscFile />
                <span className="text-sm text-neutral-300 truncate">
                  {fileToUpload ? fileToUpload.name : 'Pilih File...'}
                </span>
                <input type="file" onChange={handleFileSelect} className="hidden" />
              </label>
            </div>
          </>
        )}

        <div className="flex justify-between items-center mt-4">
          <p className="text-xs text-neutral-400 truncate">
            Tujuan:{' '}
            <span className="font-bold text-primary">{selectedFolder?.name}</span>
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isUploading}
              className="bg-neutral-600 px-4 py-2 rounded-md text-sm disabled:opacity-50"
            >
              Tutup
            </button>
            <button
              onClick={handleUpload}
              disabled={!fileToUpload || isUploading}
              className="bg-primary text-background px-4 py-2 rounded-md text-sm font-bold disabled:bg-neutral-500"
            >
              {isUploading ? `${uploadProgress}%` : (
                <>
                  <VscCloudUpload className="inline-block mr-1" /> Upload
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

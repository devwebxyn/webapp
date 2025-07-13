import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoogleDrive, type DriveFile } from '../hooks/useGoogleDrive';
import { 
    VscFile, VscFolder, VscCloudUpload, VscLink, VscLoading, 
    VscLock, VscGlobe, VscArrowLeft, VscNewFolder, VscTrash, VscKebabVertical,
    VscEdit, VscOpenPreview, VscShare, VscCloudDownload, VscEye, VscEyeClosed
} from 'react-icons/vsc';
import { toast } from 'react-toastify';
import { CreateFolderModal } from '../components/dashboard/settings/CreateFolderModal';
import { UploadDestinationModal } from '../components/dashboard/UploadDestinationModal';
import { ConfirmDeleteModal } from '../components/dashboard/ConfirmDeleteModal';
import { AuthPromptModal } from '../components/dashboard/AuthPromptModal';
import { FileList } from '../components/FileList';

// --- Komponen RenameModal ---
const RenameModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onRename: (newName: string) => void;
    currentItemName: string;
    isLoading: boolean;
}> = ({ isOpen, onClose, onRename, currentItemName, isLoading }) => {
    const [newName, setNewName] = useState(currentItemName);

    useEffect(() => {
        if (isOpen) setNewName(currentItemName);
    }, [isOpen, currentItemName]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newName.trim() && newName.trim() !== currentItemName) onRename(newName.trim());
        onClose();
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4">
            <form onSubmit={handleSubmit} className="bg-zinc-800 p-6 rounded-lg shadow-xl w-full max-w-sm">
                <h3 className="text-lg font-bold text-white mb-4">Ganti Nama</h3>
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-white focus:ring-primary focus:border-primary"
                    autoFocus
                />
                <div className="flex justify-end gap-3 mt-4">
                    <button type="button" onClick={onClose} className="bg-neutral-600 px-4 py-2 rounded-md text-sm">Batal</button>
                    <button type="submit" disabled={isLoading} className="bg-primary text-background px-4 py-2 rounded-md text-sm font-bold">
                        {isLoading ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>
            </form>
        </div>
    );
};

// --- Komponen ActionMenu (TITIK TIGA) - TANPA PRATINJAU ---
const ActionMenu: React.FC<{
    file: DriveFile;
    onRename: () => void;
    onDelete: () => void;
}> = ({ file, onRename, onDelete }) => {
    const { downloadFile, setFilePermission, toggleFeaturedFile } = useGoogleDrive();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleShareClick = async () => {
        try {
            const shareUrl = await setFilePermission(file.id, !file.shared);
            if (file.shared && shareUrl) {
                // If file is already shared, just copy the link
                await navigator.clipboard.writeText(shareUrl);
                toast.success("Link berbagi berhasil disalin ke clipboard!");
            }
            setIsOpen(false);
        } catch (error) {
            console.error('Error sharing file:', error);
            toast.error("Gagal membagikan file");
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full hover:bg-white/10">
                <VscKebabVertical />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-zinc-800 shadow-lg ring-1 ring-black ring-opacity-5 z-20"
                    >
                        <div className="py-1 text-sm text-neutral-200">
                            <button onClick={() => { onRename(); setIsOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-zinc-700"><VscEdit /> Ganti Nama</button>
                            {!file.mimeType.includes('folder') && (
                                <button 
                                    onClick={() => downloadFile(file.id, file.name)} 
                                    className="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-zinc-700"
                                >
                                    <VscCloudDownload /> Download
                                </button>
                            )}
                            {file.shared && (
                                <button 
                                    onClick={async () => {
                                        const shareUrl = `${window.location.origin}/dashboard/share/${file.id}`;
                                        await navigator.clipboard.writeText(shareUrl);
                                        toast.success("Link berbagi berhasil disalin!");
                                        setIsOpen(false);
                                    }} 
                                    className="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-zinc-700"
                                >
                                    <VscLink /> Salin Link
                                </button>
                            )}
                            <button 
                                onClick={handleShareClick} 
                                className={`w-full text-left flex items-center gap-3 px-4 py-2 ${file.shared ? 'text-yellow-400' : 'text-blue-400'} hover:bg-zinc-700`}
                            >
                                <VscShare /> {file.shared ? 'Jadikan Privat' : 'Bagikan'}
                            </button>
                            <button 
                                onClick={async () => {
                                    const success = await toggleFeaturedFile(file, !file.isFeatured);
                                    if (success) {
                                        toast.success(
                                            file.isFeatured 
                                                ? "File dihapus dari halaman share" 
                                                : "File ditambahkan ke halaman share"
                                        );
                                        setIsOpen(false);
                                    }
                                }}
                                className={`w-full text-left flex items-center gap-3 px-4 py-2 ${file.isFeatured ? 'text-purple-400' : 'text-gray-300'} hover:bg-zinc-700`}
                            >
                                {file.isFeatured ? <VscEyeClosed /> : <VscEye />}
                                {file.isFeatured ? "Sembunyikan dari Halaman Share" : "Tampilkan di Halaman Share"}
                            </button>
                            {file.webViewLink && <a href={file.webViewLink} target="_blank" rel="noopener noreferrer" className="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-zinc-700"><VscOpenPreview /> Buka di Drive</a>}
                            <div className="my-1 h-px bg-white/10" />
                            <button onClick={() => { onDelete(); setIsOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/20"><VscTrash /> Hapus</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Komponen FileManager yang Diperbarui ---
const FileManager: React.FC = () => {
    const {
        files,
        isLinked,
        isLoading,
        currentFolderId,
        breadcrumbs,
        listFiles,
        uploadFile,
        createFolder,
        deleteFile,
        toggleFeaturedFile,
        setFilePermission,
        downloadFile,
        hasMore,
        loadMoreFiles,
        clearCache
    } = useGoogleDrive();

    const [selectedFiles, setSelectedFiles] = useState<DriveFile[]>([]);
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [fileToDelete, setFileToDelete] = useState<DriveFile | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadingRef = useRef(false);

    // Handle file selection
    const handleFileSelect = useCallback((file: DriveFile, isSelected: boolean) => {
        setSelectedFiles(prev => 
            isSelected 
                ? [...prev, file] 
                : prev.filter(f => f.id !== file.id)
        );
    }, []);

    // Handle file upload
    const handleFileUpload = useCallback(async (files: FileList | null) => {
        if (!files || files.length === 0 || loadingRef.current) return;

        loadingRef.current = true;
        setIsUploading(true);
        setUploadProgress(0);

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                await uploadFile(file, currentFolderId, (progress) => {
                    setUploadProgress(progress);
                });
            }
            // Clear cache and refresh file list
            clearCache();
            await listFiles(currentFolderId);
            toast.success('File berhasil diunggah');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Gagal mengunggah file');
        } finally {
            loadingRef.current = false;
            setIsUploading(false);
            setUploadProgress(0);
        }
    }, [currentFolderId, uploadFile, listFiles, clearCache]);

    // Handle drag and drop
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileUpload(e.dataTransfer.files);
        }
    }, [handleFileUpload]);

    // Handle context menu
    const handleContextMenu = useCallback((e: React.MouseEvent, file?: DriveFile) => {
        e.preventDefault();
        setContextMenuPosition({ x: e.clientX, y: e.clientY });
        if (file) {
            setSelectedFiles([file]);
        }
        setIsContextMenuOpen(true);
    }, []);

    // Close context menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsContextMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Infinite scroll for file loading
    useEffect(() => {
        if (!hasMore || isLoading) return;

        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
                loadMoreFiles();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, isLoading, loadMoreFiles]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    const renderFileList = useMemo(() => {
        if (isLoading && files.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-12">
                    <VscLoading className="animate-spin text-4xl text-blue-500 mb-4" />
                    <p className="text-gray-400">Memuat file...</p>
                </div>
            );
        }

        if (files.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-12">
                    <VscFolder className="text-6xl text-gray-500 mb-4" />
                    <p className="text-gray-400">Folder ini kosong</p>
                    <p className="text-sm text-gray-500 mt-2">Seret file ke sini atau klik tombol unggah</p>
                </div>
            );
        }

        return (
            <FileList 
                files={files}
                onFileClick={(file) => {
                    if (file.mimeType.includes('folder')) {
                        listFiles(file.id);
                    } else {
                        window.open(file.webViewLink, '_blank');
                    }
                }}
                currentFolderId={currentFolderId}
                isLoading={isLoading && hasMore}
            />
        );
    }, [files, isLoading, currentFolderId, hasMore, listFiles]);

    return (
        <div>
            <ConfirmDeleteModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={() => deleteFile(fileToDelete?.id || '', fileToDelete?.name || '')} itemName={fileToDelete?.name || ''} isLoading={isLoading} isPermanent={false}/>
            <CreateFolderModal isOpen={showCreateFolderModal} onClose={() => setShowCreateFolderModal(false)} onCreate={createFolder} isLoading={isLoading}/>
            <UploadDestinationModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} onUpload={uploadFile}/>
            <RenameModal isOpen={false} onClose={() => {}} onRename={() => {}} currentItemName={''} isLoading={isLoading}/>

            <div className="flex items-center gap-2 mb-4 text-sm text-neutral-400">
                {breadcrumbs.length > 1 && (<button onClick={() => listFiles(breadcrumbs[breadcrumbs.length - 2].id)} className="p-1 rounded-md hover:bg-white/10 hover:text-primary"><VscArrowLeft /></button>)}
                {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.id}>
                        <button onClick={() => listFiles(crumb.id)} className={`hover:text-primary hover:underline ${index === breadcrumbs.length - 1 ? 'text-white font-semibold' : ''}`}>{crumb.name}</button>
                        {index < breadcrumbs.length - 1 && <span className="text-neutral-500">/</span>}
                    </React.Fragment>
                ))}
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input type="text" placeholder="Cari file..." className="w-full bg-white/5 border border-white/10 rounded-md p-3 pl-4 text-white" />
                <button onClick={() => setIsCreateFolderModalOpen(true)} disabled={isLoading} className="flex items-center justify-center gap-2 bg-white/10 text-white font-bold p-3 rounded-md hover:bg-white/20"><VscNewFolder /> Buat Folder</button>
                <button onClick={() => setIsUploadModalOpen(true)} disabled={isLoading} className="flex items-center justify-center gap-2 bg-primary text-background font-bold p-3 rounded-md hover:bg-primary/80"><VscCloudUpload /> Upload File</button>
            </div>
            
            <div className="overflow-x-auto bg-zinc-900/50 border border-white/10 rounded-xl">
                <table className="w-full text-left">
                    <thead className="border-b border-white/10"><tr className="text-xs text-neutral-400 uppercase"><th className="p-4">Nama</th><th className="p-4">Ukuran</th><th className="p-4">Status</th><th className="p-4 text-right">Aksi</th></tr></thead>
                    <tbody>
                        {isLoading && (<tr><td colSpan={4} className="text-center p-12"><VscLoading className="animate-spin inline-block text-2xl" /></td></tr>)}
                        {!isLoading && files.length === 0 && (<tr><td colSpan={4} className="text-center p-12 text-neutral-500">Folder ini kosong.</td></tr>)}
                        {files.map(file => (
                            <motion.tr key={file.id} className="border-b border-white/5 last:border-b-0" layout>
                                <td className="p-4 font-semibold text-white">
                                    {file.mimeType.includes('folder') ? (<button onClick={() => navigateToFolder(file.id, file.name)} className="flex items-center gap-3 text-primary hover:underline"><VscFolder /> <span>{file.name}</span></button>) : (<div className="flex items-center gap-3"><VscFile className="text-neutral-400"/> <span>{file.name}</span></div>)}
                                </td>
                                <td className="p-4 text-neutral-400">{file.size}</td>
                                <td className="p-4">
                                    <button onClick={async () => {
                                        await setFilePermission(file.id, !file.shared);
                                    }} className={`flex items-center gap-2 text-xs px-2 py-1 rounded-full font-semibold ${file.shared ? 'bg-green-500/20 text-green-300' : 'bg-zinc-700 text-neutral-300'}`}>
                                        {file.shared ? <VscGlobe /> : <VscLock />} {file.shared ? 'Publik' : 'Pribadi'}
                                    </button>
                                </td>
                                <td className="p-4 text-right flex justify-end items-center gap-2">
                                    {!file.mimeType.includes('folder') && <button onClick={() => handlePreviewClick(file)} className="p-2 rounded-full hover:bg-white/10"><VscEye /></button>}
                                    <ActionMenu file={file} onRename={() => handleRenameClick(file)} onDelete={() => handleDeleteClick(file)} />
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

// Komponen utama halaman
export const StoragePage: React.FC = () => {
    const { isLinked, isApiReady, isLoading } = useGoogleDrive();

    if (!isApiReady) {
        return <div className="flex-grow flex items-center justify-center"><VscLoading className="animate-spin text-primary text-4xl" /></div>;
    }
    
    return isLinked ? <FileManager /> : <AuthPromptModal isOpen={!isLinked && !isLoading} />;
};
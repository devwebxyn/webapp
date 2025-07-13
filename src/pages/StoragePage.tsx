import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoogleDrive, type DriveFile } from '../hooks/useGoogleDrive';
import { 
    VscFile, VscFolder, VscCloudUpload, VscLoading, VscNewFolder, VscKebabVertical, 
    VscEdit, VscTrash, VscCloudDownload, VscShare, VscLink, VscEye, VscEyeClosed, 
    VscOpenPreview, VscGlobe, VscLock, VscListSelection, VscExtensions, VscClose
} from 'react-icons/vsc';
import { toast } from 'react-toastify';
import { CreateFolderModal } from '../components/dashboard/settings/CreateFolderModal';
import { UploadDestinationModal } from '../components/dashboard/UploadDestinationModal';
import { ConfirmDeleteModal } from '../components/dashboard/ConfirmDeleteModal';
import { AuthPromptModal } from '../components/dashboard/AuthPromptModal';
// --- Helper untuk Ikon ---
const getFileIcon = (mimeType: string, className?: string) => {
    const iconClass = className || "text-neutral-400 text-5xl";
    
    if (mimeType.includes('folder')) return <VscFolder className={`text-primary ${iconClass}`} />;
    if (mimeType.startsWith('image/')) return <VscFileMedia className={`text-purple-400 ${iconClass}`} />;
    if (mimeType.startsWith('video/')) return <VscFileMedia className={`text-red-400 ${iconClass}`} />;
    if (mimeType.includes('pdf')) return <VscFilePdf className={`text-orange-400 ${iconClass}`} />;
    if (mimeType.includes('zip') || mimeType.includes('rar')) return <VscFileZip className={`text-yellow-400 ${iconClass}`} />;
    return <VscFile className={iconClass} />;
};
// Dummy icons, replace with actual if you have them, e.g. from 'react-icons/fa'
const VscFileMedia = VscFile; 
const VscFilePdf = VscFile;
const VscFileZip = VscFile;
// --- Komponen Modal Pratinjau ---
const PreviewModal: React.FC<{ file: DriveFile | null, onClose: () => void }> = ({ file, onClose }) => {
    if (!file) return null;
    
    const isViewable = file.mimeType.startsWith('image/') || file.mimeType.startsWith('video/') || file.mimeType === 'application/pdf';
    // Di dalam renderPreviewContent, tambahkan kondisi untuk isViewable
if (!isViewable && !file.webContentLink) {
    return (
        <div className="text-center text-neutral-300 flex flex-col items-center justify-center gap-4 p-8 h-full">
            <div className="text-7xl opacity-50">{getFileIcon(file.mimeType)}</div>
            <h3 className="text-xl font-bold">Pratinjau Langsung Tidak Tersedia</h3>
            <p className="max-w-md text-neutral-400">
                Fitur keamanan Google atau tipe file ini tidak mengizinkan pratinjau langsung. Anda dapat membukanya di tab baru.
            </p>
            <a 
               href={file.webViewLink || '#'} 
               target="_blank" 
               rel="noopener noreferrer" 
               className="mt-4 inline-flex items-center gap-3 px-6 py-3 bg-primary text-background font-bold rounded-md hover:bg-primary/80 transition-transform hover:scale-105"
            >
                <VscOpenPreview /> Buka di Google Drive
            </a>
        </div>
    );
}
    const embedUrl = file.webViewLink?.replace('/view', '/preview');
    if (file.mimeType === 'application/pdf') {
    // Memanfaatkan embedUrl yang sudah didefinisikan
    return <iframe src={embedUrl} className="w-full h-full border-0 rounded-md" title={file.name} />;
}
    
    const renderPreviewContent = () => {
        if (file.webContentLink) {
            if (file.mimeType.startsWith('image/')) {
                return <img src={file.webContentLink} alt={file.name} className="max-w-full max-h-full object-contain rounded-md" />;
            }
            if (file.mimeType.startsWith('video/')) {
                return <video src={file.webContentLink} controls autoPlay className="max-w-full max-h-full rounded-md bg-black" />;
            }
            // Gunakan iframe untuk PDF karena lebih andal
            if (file.mimeType === 'application/pdf') {
                return <iframe src={file.webContentLink} className="w-full h-full border-0 rounded-md" title={file.name} />;
            }
        }
        // Tampilan Fallback untuk Google Docs/Sheets/Slides dan file lainnya
        return (
            <div className="text-center text-neutral-300 flex flex-col items-center justify-center gap-4 p-8 h-full">
                <div className="text-7xl opacity-50">{getFileIcon(file.mimeType)}</div>
                <h3 className="text-xl font-bold">Pratinjau Langsung Tidak Tersedia</h3>
                <p className="max-w-md text-neutral-400">
                    Fitur keamanan Google atau tipe file ini tidak mengizinkan pratinjau langsung. Anda dapat membukanya di tab baru.
                </p>
                <a 
                   href={file.webViewLink || '#'} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="mt-4 inline-flex items-center gap-3 px-6 py-3 bg-primary text-background font-bold rounded-md hover:bg-primary/80 transition-transform hover:scale-105"
                >
                    <VscOpenPreview /> Buka di Google Drive
                </a>
            </div>
        );
    };
    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: -20 }}
                    className="relative w-full h-full max-w-6xl max-h-[90vh] flex flex-col bg-zinc-900 rounded-xl border border-white/10 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <header className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="text-2xl flex-shrink-0">{getFileIcon(file.mimeType, 'text-2xl')}</div>
                            <span className="text-white font-semibold truncate">{file.name}</span>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-2xl"><VscClose /></button>
                    </header>
                    <div className="flex-grow p-2 md:p-4 flex items-center justify-center overflow-hidden">
                        {renderPreviewContent()}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
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
    };
    if (!isOpen) return null;
    
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4"
                >
                    <motion.form 
                        initial={{ scale: 0.9, y: -20 }} 
                        animate={{ scale: 1, y: 0 }} 
                        exit={{ scale: 0.9, y: 20 }}
                        onSubmit={handleSubmit} 
                        className="relative bg-zinc-800 p-6 rounded-lg shadow-xl w-full max-w-sm"
                    >
                        <h3 className="text-lg font-bold text-white mb-4">Ganti Nama</h3>
                        <input 
                            type="text" 
                            value={newName} 
                            onChange={(e) => setNewName(e.target.value)} 
                            className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-white focus:ring-primary focus:border-primary" 
                            autoFocus 
                        />
                        <div className="flex justify-end gap-3 mt-4">
                            <button 
                                type="button" 
                                onClick={onClose} 
                                className="bg-neutral-600 px-4 py-2 rounded-md text-sm"
                            >
                                Batal
                            </button>
                            <button 
                                type="submit" 
                                disabled={isLoading} 
                                className="bg-primary text-background px-4 py-2 rounded-md text-sm font-bold"
                            >
                                {isLoading ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </motion.form>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
// --- Komponen ActionMenu (TITIK TIGA) ---
const ActionMenu: React.FC<{
    file: DriveFile;
    onRename: () => void;
    onDelete: () => void;
}> = ({ file, onRename, onDelete }) => {
    const { downloadFile, setFilePermission, toggleFeaturedFile } = useGoogleDrive();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const handleShareClick = async () => {
        setIsOpen(false);
        try {
            await setFilePermission(file.id, !file.shared);
            toast.success(`Izin file "${file.name}" berhasil diubah.`);
        } catch (error) {
            toast.error("Gagal mengubah izin file.");
        }
    };
    const handleToggleFeatured = async () => {
        setIsOpen(false);
        await toggleFeaturedFile(file, !file.isFeatured);
        toast.success(file.isFeatured ? "Dihapus dari Halaman Share" : "Ditambahkan ke Halaman Share");
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
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full hover:bg-white/10 text-neutral-400">
                <VscKebabVertical />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-2 w-60 origin-top-right rounded-md bg-zinc-800 shadow-xl ring-1 ring-black ring-opacity-5 z-20"
                    >
                        <div className="py-1 text-sm text-neutral-200">
                            <button onClick={onRename} className="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-zinc-700"><VscEdit /> Ganti Nama</button>
                            {!file.mimeType.includes('folder') && (
                                <button onClick={() => downloadFile(file.id)} className="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-zinc-700">
                                    <VscCloudDownload /> Download
                                </button>
                            )}
                            <button onClick={handleShareClick} className={`w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-zinc-700`}>
                                <VscShare /> {file.shared ? 'Jadikan Privat' : 'Bagikan ke Publik'}
                            </button>
                            {file.shared && (
                                <button onClick={async () => {
                                        const shareUrl = `${window.location.origin}/share/${file.id}`;
                                        await navigator.clipboard.writeText(shareUrl);
                                        toast.success("Tautan internal berhasil disalin!");
                                        setIsOpen(false);
                                    }} className="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-zinc-700">
                                    <VscLink /> Salin Tautan Share
                                </button>
                            )}
                             <button onClick={handleToggleFeatured} className={`w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-zinc-700`}>
                                {file.isFeatured ? <VscEyeClosed /> : <VscEye />} {file.isFeatured ? "Sembunyikan dari Share" : "Tampilkan di Share"}
                            </button>
                            {file.webViewLink && <a href={file.webViewLink} target="_blank" rel="noopener noreferrer" className="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-zinc-700"><VscOpenPreview /> Buka di Drive</a>}
                            <div className="my-1 h-px bg-white/10" />
                            <button onClick={onDelete} className="w-full text-left flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/20"><VscTrash /> Hapus</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
// --- Komponen FileManager ---
const FileManager: React.FC = () => {
    const { files, isLoading, currentFolderId, breadcrumbs, listFiles, uploadFile, createFolder, deleteFile, hasMore, loadMoreFiles } = useGoogleDrive();
    
    // State untuk mode tampilan dan pratinjau
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
    const [previewFile, setPreviewFile] = useState<DriveFile | null>(null);
    const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [itemToModify, setItemToModify] = useState<DriveFile | null>(null);
    const handleCreateFolder = async (name: string) => {
        await createFolder(name, currentFolderId);
        setShowCreateFolderModal(false);
    };
    const handleDeleteClick = (file: DriveFile) => {
        setItemToModify(file);
        setShowDeleteModal(true);
    };
    const handleConfirmDelete = async () => {
        if (itemToModify) {
            await deleteFile(itemToModify.id, itemToModify.name);
            setShowDeleteModal(false);
            setItemToModify(null);
        }
    };
    
    const handleRenameClick = (file: DriveFile) => {
        setItemToModify(file);
        setShowRenameModal(true);
    };
    const handleConfirmRename = async (newName: string) => {
        if (itemToModify) {
            // Assuming you have a renameFile function in useGoogleDrive
            // If not, implement it in your hook
            if (typeof (window as any).renameFile === "function") {
                await (window as any).renameFile(itemToModify.id, newName);
                toast.success(`Nama file berhasil diubah menjadi "${newName}".`);
            } else {
                toast.info("Fitur ganti nama akan segera diimplementasikan.");
            }
        }
        setShowRenameModal(false);
        setItemToModify(null);
    };
    const handleFileClick = (file: DriveFile) => {
        if (file.mimeType.includes('folder')) {
            listFiles(file.id);
        } else {
            // Jika dalam mode grid, buka pratinjau
            if (viewMode === 'grid') {
                setPreviewFile(file);
            } else if (file.webViewLink) {
                // Jika mode daftar, buka di tab baru
                window.open(file.webViewLink, '_blank');
            }
        }
    };
    
    // RENDER METHOD
    return (
        <div className="p-4 md:p-8">
            {/* Semua Modal (Delete, Create, Upload, Rename, Preview) */}
            <ConfirmDeleteModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={handleConfirmDelete} itemName={itemToModify?.name || ''} isLoading={isLoading} isPermanent={false}/>
            <CreateFolderModal isOpen={showCreateFolderModal} onClose={() => setShowCreateFolderModal(false)} onCreate={handleCreateFolder} isLoading={isLoading}/>
            <UploadDestinationModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} onUpload={(file, folderId) => uploadFile(file, folderId, () => {})} />
            <RenameModal isOpen={showRenameModal} onClose={() => setShowRenameModal(false)} onRename={handleConfirmRename} currentItemName={itemToModify?.name || ''} isLoading={isLoading}/>
            <PreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
            {/* Header & Breadcrumbs */}
            <div className="flex items-center gap-2 mb-4 text-sm text-neutral-400">
                {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.id}>
                        <button onClick={() => listFiles(crumb.id)} className={`hover:text-primary hover:underline ${index === breadcrumbs.length - 1 ? 'text-white font-semibold' : ''}`}>{crumb.name}</button>
                        {index < breadcrumbs.length - 1 && <span className="text-neutral-500">/</span>}
                    </React.Fragment>
                ))}
            </div>
            {/* Toolbar: Search, Actions, and View Mode Toggle */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input type="text" placeholder="Cari file..." className="flex-grow bg-white/5 border border-white/10 rounded-md p-3 pl-4 text-white" />
                <div className="flex items-center gap-2">
                     {/* Tombol Beralih Mode */}
                    <button onClick={() => setViewMode('list')} className={`p-3 rounded-md ${viewMode === 'list' ? 'bg-primary text-background' : 'bg-white/10 hover:bg-white/20'}`}><VscListSelection size={20}/></button>
                    <button onClick={() => setViewMode('grid')} className={`p-3 rounded-md ${viewMode === 'grid' ? 'bg-primary text-background' : 'bg-white/10 hover:bg-white/20'}`}><VscExtensions size={20}/></button>
                </div>
                <button onClick={() => setShowCreateFolderModal(true)} disabled={isLoading} className="flex items-center justify-center gap-2 bg-white/10 text-white font-bold p-3 rounded-md hover:bg-white/20"><VscNewFolder /> Buat Folder</button>
                <button onClick={() => setShowUploadModal(true)} disabled={isLoading} className="flex items-center justify-center gap-2 bg-primary text-background font-bold p-3 rounded-md hover:bg-primary/80"><VscCloudUpload /> Upload File</button>
            </div>
            
            {/* KONTEN UTAMA: GRID ATAU DAFTAR */}
            <div>
                {isLoading && files.length === 0 && (
                    <div className="text-center p-12"><VscLoading className="animate-spin inline-block text-4xl text-primary" /></div>
                )}
                {!isLoading && files.length === 0 && (
                    <div className="text-center p-12 text-neutral-500">Folder ini kosong.</div>
                )}
                {/* Tampilan Grid (Mode Besar) */}
                {viewMode === 'grid' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                        {files.map(file => (
                            <motion.div key={file.id} layout onClick={() => handleFileClick(file)}
                                className="relative group aspect-square flex flex-col items-center justify-center bg-zinc-900/50 border border-white/10 rounded-xl p-4 text-center cursor-pointer hover:bg-primary/10 hover:border-primary transition-all duration-300">
                                
                                <div className="absolute top-2 right-2 z-10 opacity-50 group-hover:opacity-100 transition-opacity">
                                    <ActionMenu file={file} onRename={() => handleRenameClick(file)} onDelete={() => handleDeleteClick(file)} />
                                </div>
                                <div className="mb-4">
                                    {file.thumbnailLink ? <img src={file.thumbnailLink} alt={file.name} className="w-20 h-20 object-contain"/> : getFileIcon(file.mimeType)}
                                </div>
                                <p className="w-full font-semibold text-white text-sm break-words line-clamp-2">{file.name}</p>
                                <p className="text-xs text-neutral-500 mt-1">{file.size || '--'}</p>
                            </motion.div>
                        ))}
                    </div>
                )}
                {/* Tampilan Daftar (Mode Kecil) */}
                {viewMode === 'list' && (
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
                                {files.map(file => (
                                    <tr key={file.id} className="border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-semibold text-white">
                                            <button onClick={() => handleFileClick(file)} className="flex items-center gap-3">
                                                {file.mimeType.includes('folder') ? <VscFolder className="text-primary"/> : <VscFile className="text-neutral-400"/>}
                                                <span className="truncate max-w-xs md:max-w-md">{file.name}</span>
                                            </button>
                                        </td>
                                        <td className="p-4 text-neutral-400 text-sm">{file.size || '--'}</td>
                                        <td className="p-4">
                                            <span className={`flex items-center gap-2 text-xs px-2 py-1 rounded-full font-semibold w-fit ${file.shared ? 'bg-green-500/20 text-green-300' : 'bg-zinc-700 text-neutral-300'}`}>
                                                {file.shared ? <VscGlobe /> : <VscLock />} {file.shared ? 'Publik' : 'Pribadi'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right flex justify-end items-center gap-2">
                                            <ActionMenu file={file} onRename={() => handleRenameClick(file)} onDelete={() => handleDeleteClick(file)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            
            {/* Tombol Muat Lebih Banyak */}
            {hasMore && !isLoading && (
                 <div className="text-center mt-8">
                    <button onClick={loadMoreFiles} className="text-primary hover:underline disabled:text-neutral-500" disabled={isLoading}>
                        {isLoading ? 'Memuat...' : 'Muat lebih banyak'}
                    </button>
                </div>
            )}
        </div>
    );
};
// Komponen utama halaman
export const StoragePage: React.FC = () => {
    const { isLinked, isApiReady, isLoading } = useGoogleDrive();
    if (!isApiReady) {
        return <div className="flex-grow flex items-center justify-center h-full"><VscLoading className="animate-spin text-primary text-4xl" /></div>;
    }
    
    return isLinked ? <FileManager /> : <AuthPromptModal isOpen={!isLinked && !isLoading} />;
};
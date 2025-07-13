import React, { useMemo } from 'react';
import { useGoogleDrive } from '../../../hooks/useGoogleDrive';
import { VscFile, VscFolder, VscLoading } from 'react-icons/vsc';
import { motion } from 'framer-motion';
import { AuthPromptModal } from '../AuthPromptModal';

// Kategori file dan helper
const fileCategories = [
    { name: 'Gambar', color: 'bg-blue-500', types: ['image/'] },
    { name: 'Video', color: 'bg-purple-500', types: ['video/'] },
    { name: 'Dokumen', color: 'bg-green-500', types: [
        'application/pdf', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
        'application/msword', 
        'text/plain',
        'application/vnd.google-apps.document' // Google Docs
    ]},
    { name: 'Spreadsheet', color: 'bg-emerald-500', types: [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
        'application/vnd.ms-excel',
        'application/vnd.google-apps.spreadsheet' // Google Sheets
    ]},
    { name: 'Presentasi', color: 'bg-orange-500', types: [
        'application/vnd.openxmlformats-officedocument.presentationml.presentation', 
        'application/vnd.ms-powerpoint',
        'application/vnd.google-apps.presentation' // Google Slides
    ]},
    { name: 'Audio', color: 'bg-amber-500', types: ['audio/'] },
    { name: 'Arsip', color: 'bg-yellow-500', types: ['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'] },
    { name: 'Kode & Teks', color: 'bg-pink-500', types: [
        'application/json', 'text/html', 'text/css', 'text/javascript', 'application/x-javascript',
        'application/vnd.google-apps.script' // Google Apps Script
    ]},
    { name: 'Lainnya', color: 'bg-gray-500', types: [
        'application/vnd.google-apps.form', // Google Forms
        'application/vnd.google-apps.drawing', // Google Drawings
        'application/vnd.google-apps.site', // Google Sites
        'application/vnd.google-apps.map', // Google My Maps
        'application/vnd.google-apps.fusiontable' // Google Fusion Tables (deprecated but might exist)
    ]}
];

const getCategory = (mimeType: string) => {
    if (!mimeType) return fileCategories.find(c => c.name === 'Lainnya')!;
    return fileCategories.find(cat => cat.types.some(type => mimeType.startsWith(type))) || fileCategories.find(c => c.name === 'Lainnya')!;
};

const formatBytes = (bytes: number, decimals = 2) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const formatRelativeTime = (dateString: string) => {
    if (!dateString) return '';
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

export const OverviewPage: React.FC = () => {
    const { allFiles, isLoading, storageQuota, isLinked } = useGoogleDrive();

    const stats = useMemo(() => {
        // Add null/undefined check for allFiles
        if (!allFiles || !Array.isArray(allFiles)) {
            return {
                folders: [],
                filesOnly: [],
                recentFiles: [],
                categoryStats: fileCategories.map(cat => ({ ...cat, count: 0, size: 0 }))
            };
        }

        const folders = allFiles.filter(f => f.mimeType?.includes('folder'));
        const filesOnly = allFiles.filter(f => !f.mimeType?.includes('folder'));
        
        const recentFiles = [...allFiles]
            .sort((a, b) => new Date(b.modifiedTime || 0).getTime() - new Date(a.modifiedTime || 0).getTime())
            .slice(0, 5);
        
        const categoryStats = fileCategories.map(cat => {
            const filesInCategory = filesOnly.filter(f => getCategory(f.mimeType).name === cat.name);
            const totalSize = filesInCategory.reduce((acc, file) => acc + (file.rawSize || 0), 0);
            return { ...cat, count: filesInCategory.length, size: totalSize };
        });
        
        return { folders, filesOnly, recentFiles, categoryStats };
    }, [allFiles]);

    // Tampilkan loading HANYA jika data sedang diambil
    if (isLoading) {
        return <div className="flex justify-center items-center h-full p-8"><VscLoading className="animate-spin text-4xl text-primary" /></div>;
    }

    // Setelah loading selesai, periksa status tautan
    return (
        <div className="relative h-full w-full">
            {/* Selalu render modal, tetapi visibilitasnya dikontrol oleh prop `isOpen` */}
            <AuthPromptModal isOpen={!isLinked} />

            {/* Konten hanya ditampilkan jika tertaut. Efek blur ditambahkan untuk estetika saat modal muncul */}
            <div className={`transition-all duration-300 ${!isLinked ? 'blur-md opacity-30' : 'opacity-100'}`}>
                <div className="p-4 md:p-8 space-y-8">
                    {/* Kartu Statistik */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-zinc-900/50 p-6 rounded-xl border border-white/10">
                            <h3 className="text-sm font-semibold text-neutral-400">Total File</h3>
                            <p className="text-3xl font-bold text-white mt-1">{stats.filesOnly.length}</p>
                        </div>
                        <div className="bg-zinc-900/50 p-6 rounded-xl border border-white/10">
                            <h3 className="text-sm font-semibold text-neutral-400">Total Folder</h3>
                            <p className="text-3xl font-bold text-white mt-1">{stats.folders.length}</p>
                        </div>
                        <div className="bg-zinc-900/50 p-6 rounded-xl border border-white/10">
                            <h3 className="text-sm font-semibold text-neutral-400">Penyimpanan Terpakai</h3>
                            <p className="text-3xl font-bold text-white mt-1">{storageQuota ? formatBytes(storageQuota.usage) : '...'}</p>
                        </div>
                    </motion.div>

                    {/* Rincian Penyimpanan */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Rincian Penyimpanan</h3>
                        <div className="w-full bg-zinc-800 rounded-full h-4 flex overflow-hidden border border-zinc-700">
                            {storageQuota && storageQuota.usage > 0 && stats.categoryStats.map(cat => {
                                const percentage = (cat.size / storageQuota.usage) * 100;
                                if (percentage < 0.1) return null; 
                                return <div key={cat.name} className={`${cat.color} h-full transition-all duration-300`} style={{ width: `${percentage}%` }} title={`${cat.name}: ${formatBytes(cat.size)}`}></div>
                            })}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3 mt-4">
                            {stats.categoryStats.map(cat => cat.count > 0 && (
                                <div key={cat.name} className="flex items-center text-sm">
                                    <div className={`w-3 h-3 rounded-sm ${cat.color} mr-2 flex-shrink-0`}></div>
                                    <div className="flex flex-col">
                                        <span className="text-neutral-200">{cat.name}</span>
                                        <span className="text-neutral-500 text-xs font-mono">{cat.count} file | {formatBytes(cat.size)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-neutral-600 mt-4">
                            *Ukuran kategori mungkin tidak sama persis dengan 'Penyimpanan Terpakai' karena Google Drive tidak menghitung file native (seperti Google Docs, Sheets) terhadap kuota Anda, kecuali jika dikonversi dari format lain.
                        </p>
                    </div>

                    {/* Aktivitas Terbaru */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Aktivitas Terbaru</h3>
                        <div className="space-y-3">
                            {stats.recentFiles.map((file, index) => (
                                <motion.div 
                                    key={file.id} 
                                    className="bg-zinc-900/50 p-4 rounded-xl border border-white/10 flex items-center justify-between"
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.05 }}
                                >
                                    <div className="flex items-center gap-4 truncate">
                                        {file.mimeType.includes('folder') ? <VscFolder className="text-primary text-xl flex-shrink-0"/> : <VscFile className="text-neutral-400 text-xl flex-shrink-0"/>}
                                        <div className='truncate'>
                                            <p className="text-white font-medium truncate">{file.name}</p>
                                            {file.modifiedTime && <p className="text-xs text-neutral-500">{formatRelativeTime(file.modifiedTime)}</p>}
                                        </div>
                                    </div>
                                    <span className="text-xs text-neutral-500 flex-shrink-0">{file.size}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

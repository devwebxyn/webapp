import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGoogleDrive } from '../hooks/useGoogleDrive';
import { 
    VscFile, 
    VscFolder, 
    VscCloudUpload, 
    VscLink, 
    VscEye, 
    VscLoading, 
    VscLock, 
    VscGlobe, 
    VscSettings, 
    VscArrowRight, 
    VscPlug
} from 'react-icons/vsc';
import { FaGoogleDrive } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify/unstyled';

// --- [BARU] Komponen Flowchart Keren ---
const FlowchartGuide: React.FC = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.5, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <div className="text-center py-16 px-4">
            <motion.h1 
                variants={itemVariants} 
                className="font-monument text-4xl text-white"
            >
                Aktifkan Brankas Google Drive Anda
            </motion.h1>
            <motion.p 
                variants={itemVariants} 
                className="text-neutral-400 max-w-xl mx-auto mt-2 mb-12"
            >
                Ikuti tiga langkah mudah ini untuk menautkan akun Anda dan mulai mengelola file dengan aman.
            </motion.p>
            
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative flex flex-col md:flex-row justify-center items-center gap-8 md:gap-0"
            >
                {/* Garis Penghubung */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-800 hidden md:block" />
                <motion.div 
                    className="absolute top-1/2 left-0 h-0.5 bg-primary hidden md:block"
                    initial={{ width: 0 }}
                    animate={{ width: "66%" }}
                    transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
                />

                {/* Step 1: Buka Pengaturan */}
                <motion.div variants={itemVariants} className="relative z-10 flex flex-col items-center w-52">
                    <div className="w-20 h-20 rounded-full bg-zinc-900 border-2 border-primary/50 flex items-center justify-center">
                        <VscSettings className="text-4xl text-primary" />
                    </div>
                    <h3 className="mt-4 font-bold text-white">Langkah 1</h3>
                    <p className="text-xs text-neutral-400 h-10">Buka Modal Pengaturan melalui ikon gear di pojok kanan atas.</p>
                </motion.div>

                {/* Step 2: Brankas Fondasi */}
                <motion.div variants={itemVariants} className="relative z-10 flex flex-col items-center w-52">
                    <div className="w-20 h-20 rounded-full bg-zinc-900 border-2 border-primary/50 flex items-center justify-center">
                        <VscPlug className="text-4xl text-primary" />
                    </div>
                    <h3 className="mt-4 font-bold text-white">Langkah 2</h3>
                    <p className="text-xs text-neutral-400 h-10">Pilih menu "Brankas Fondasi" di sidebar pengaturan.</p>
                </motion.div>

                {/* Step 3: Tautkan Akun */}
                <motion.div variants={itemVariants} className="relative z-10 flex flex-col items-center w-52">
                    <div className="w-20 h-20 rounded-full bg-zinc-900 border-2 border-primary/50 flex items-center justify-center">
                        <FaGoogleDrive className="text-4xl text-green-400" />
                    </div>
                    <h3 className="mt-4 font-bold text-white">Langkah 3</h3>
                    <p className="text-xs text-neutral-400 h-10">Klik tombol "Tautkan Akun" dan berikan izin yang diperlukan.</p>
                </motion.div>
            </motion.div>
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
                 <Link to="/dashboard/integrations" className="mt-12 bg-primary text-background font-bold px-8 py-3 rounded-md inline-flex items-center gap-3 group">
                    Mulai Penautan <VscArrowRight className="transition-transform group-hover:translate-x-1" />
                </Link>
             </motion.div>
        </div>
    );
};


// --- Komponen File Manager (TIDAK BERUBAH) ---
const FileManager: React.FC = () => {
    const { files, isLoading, uploadFile, setFilePermission } = useGoogleDrive();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleUploadClick = () => fileInputRef.current?.click();
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => e.target.files?.[0] && uploadFile(e.target.files[0]);
    const copyLink = (fileId: string) => {
        navigator.clipboard.writeText(`https://drive.google.com/file/d/${fileId}/view`);
        toast.success("Link berhasil disalin!");
    };
    
    return (
        <div>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input type="text" placeholder="Cari file..." className="w-full bg-white/5 border border-white/10 rounded-md p-3 pl-4 text-white focus:ring-primary focus:border-primary flex-grow" />
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                <button onClick={handleUploadClick} disabled={isLoading} className="flex items-center justify-center gap-2 bg-primary text-background font-bold p-3 rounded-md hover:bg-primary/80 disabled:bg-neutral-600">
                    <VscCloudUpload /> Upload File
                </button>
            </div>
            <div className="overflow-x-auto bg-zinc-900/50 border border-white/10 rounded-xl">
                <table className="w-full text-left">
                    <thead className='border-b border-white/10'>
                        <tr className="text-xs text-neutral-400 uppercase">
                            <th className="p-4">Nama</th>
                            <th className="p-4">Ukuran</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading && files.length === 0 && (
                            <tr><td colSpan={4} className="text-center p-12"><VscLoading className="animate-spin inline-block text-2xl" /></td></tr>
                        )}
                        {!isLoading && files.length === 0 && (
                             <tr><td colSpan={4} className="text-center p-12 text-neutral-500">Folder 'cloudnest' Anda kosong.</td></tr>
                        )}
                        {files.map(file => (
                            <motion.tr key={file.id} className="border-b border-white/5 last:border-b-0 hover:bg-white/5" layout>
                                <td className="p-4 font-semibold text-white flex items-center gap-3">
                                    {file.size === 'Folder' ? <VscFolder className="text-primary"/> : <VscFile className="text-neutral-400"/>} 
                                    <span>{file.name}</span>
                                </td>
                                <td className="p-4 text-neutral-400">{file.size}</td>
                                <td className="p-4">
                                    <button onClick={() => setFilePermission(file.id, !file.shared)} className={`flex items-center gap-2 text-xs px-2 py-1 rounded-full font-semibold ${file.shared ? 'bg-green-500/20 text-green-300' : 'bg-zinc-700 text-neutral-300'}`}>
                                        {file.shared ? <VscGlobe/> : <VscLock/>} {file.shared ? 'Publik' : 'Privat'}
                                    </button>
                                </td>
                                <td className="p-4 text-right flex justify-end gap-2 text-neutral-400">
                                    <button onClick={() => setPreviewUrl(file.webViewLink?.replace('/view', '/preview') || null)} className="p-2 rounded-md hover:bg-white/10 hover:text-primary"><VscEye /></button>
                                    {file.shared && <button onClick={() => copyLink(file.id)} className="p-2 rounded-md hover:bg-white/10 hover:text-primary"><VscLink /></button>}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {previewUrl && (
                 <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4" onClick={() => setPreviewUrl(null)}>
                    <iframe src={previewUrl} className="w-full max-w-4xl h-5/6 bg-zinc-900 rounded-lg border-0" title="File Preview"></iframe>
                 </div>
            )}
        </div>
    );
};


// --- Komponen Utama (Switcher) ---
export const StoragePage: React.FC = () => {
    const { isLinked, isLoading, isApiReady } = useGoogleDrive();

    // Tampilkan loading utama hanya saat API belum siap
    if (!isApiReady) {
        return <div className="text-center p-24"><VscLoading className="animate-spin text-primary text-4xl" /></div>;
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            {isLinked ? <FileManager /> : <FlowchartGuide />}
        </div>
    );
};
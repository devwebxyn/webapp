import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VscPlug, VscLoading, VscCheck, VscClose } from 'react-icons/vsc';
import { useGoogleDrive } from '../../hooks/useGoogleDrive';

// Tipe untuk status proses
type Status = 'idle' | 'loading' | 'success' | 'error';

// Komponen untuk menampilkan status (Loading, Success, Error)
const ProcessStatus: React.FC<{ status: Status }> = ({ status }) => {
    const statusConfig = {
        loading: { icon: <VscLoading className="animate-spin" />, text: "Menautkan akun...", color: "text-blue-400 bg-blue-500/10 border-blue-500/50" },
        success: { icon: <VscCheck />, text: "Berhasil Ditautkan!", color: "text-green-400 bg-green-500/10 border-green-500/50" },
        error: { icon: <VscClose />, text: "Gagal Menautkan", color: "text-red-400 bg-red-500/10 border-red-500/50" },
    };

    const currentStatus = statusConfig[status as keyof typeof statusConfig];

    if (!currentStatus) return null;

    return (
        <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
                className="relative z-10 flex flex-col items-center gap-6"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
            >
                <div className={`flex h-24 w-24 items-center justify-center rounded-full border-2 text-5xl ${currentStatus.color}`}>
                    {currentStatus.icon}
                </div>
                <p className="font-semibold text-xl text-white">{currentStatus.text}</p>
            </motion.div>
        </motion.div>
    );
};


// Komponen Modal Utama
export const AuthPromptModal: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
    const { signIn } = useGoogleDrive();
    const [status, setStatus] = useState<Status>('idle');

    const handleSignInClick = async () => {
        setStatus('loading');
        try {
            await signIn();
            // Jika berhasil, signIn akan me-resolve promise
            // Callback di useGoogleDrive akan menangani pembaruan state
            setStatus('success');

            // Tunggu 1.5 detik untuk menampilkan centang, lalu refresh halaman
            setTimeout(() => {
                window.location.reload();
            }, 1500);

        } catch (error) {
            // Jika gagal (misal, pengguna menutup pop-up login)
            console.error("Proses login gagal atau dibatalkan:", error);
            setStatus('error');
            
            // Tunggu 2 detik untuk menampilkan silang, lalu kembali ke modal awal
            setTimeout(() => {
                setStatus('idle');
            }, 2000);
        }
    };

    return (
        <AnimatePresence>
            {/* Tampilkan modal otentikasi hanya jika status 'idle' */}
            {isOpen && status === 'idle' && (
                <motion.div
                    className="fixed inset-0 z-[150] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                    <motion.div
                        className="relative z-10 w-full max-w-lg rounded-2xl border border-primary/20 bg-zinc-900 p-8 text-center shadow-2xl shadow-primary/10"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/50 bg-primary/10 text-primary">
                            <VscPlug size={32} />
                        </div>
                        <h2 className="mt-6 font-monument text-2xl text-white">
                            Brankas Belum Tertaut
                        </h2>
                        <p className="mt-2 text-neutral-300">
                            Untuk melihat ringkasan penyimpanan dan mengakses fitur ini, Anda perlu menautkan akun Google Drive Anda terlebih dahulu.
                        </p>
                        <button
                            onClick={handleSignInClick}
                            disabled={status !== 'idle'}
                            className="mt-8 inline-block rounded-md bg-primary px-8 py-3 font-bold text-background transition-colors hover:bg-primary/80 disabled:cursor-not-allowed disabled:bg-primary/50"
                        >
                            Tautkan Akun Sekarang
                        </button>
                    </motion.div>
                </motion.div>
            )}

            {/* Tampilkan modal status jika sedang loading, success, atau error */}
            {status !== 'idle' && <ProcessStatus status={status} />}
        </AnimatePresence>
    );
};
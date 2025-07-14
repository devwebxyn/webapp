// src/pages/DashboardPage.tsx

import React from 'react';
import { useAuth } from '../components/AuthContext';
import { Link } from 'react-router-dom';

// --- PERBAIKAN DI SINI: Langsung ekspor sebagai konstanta ---
export const DashboardPage: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="flex flex-col h-full p-6 md:p-10 lg:p-12">
            <div className="relative rounded-xl bg-zinc-800 border border-white/10 overflow-hidden">
                {/* Ilustrasi 2D Sederhana */}
                <div className="absolute bottom-0 right-0 w-64 h-48 bg-primary/5 rounded-tl-full overflow-hidden">
                    <div className="absolute -bottom-8 right-8 w-32 h-32 bg-primary/20 rounded-full"></div>
                    <div className="absolute bottom-8 -right-8 w-24 h-24 bg-secondary/20 rounded-full"></div>
                </div>

                <div className="relative z-10 p-6 md:p-8">
                    <h2 className="font-monument text-2xl md:text-3xl font-bold text-white mb-4">
                        {/* --- PERBAIKAN: Menggunakan full_name dari metadata --- */}
                        Selamat Datang, {user?.user_metadata?.full_name || user?.email}!
                    </h2>
                    <p className="text-neutral-300 leading-relaxed mb-6 max-w-2xl">
                        CloudNest siap membantu Anda. Mulailah dengan menjelajahi brankas Anda atau lihat fitur lainnya di menu.
                    </p>
                    <Link 
                        to="/storage/private/overview" 
                        className="inline-block bg-primary text-background font-semibold rounded-md px-6 py-3 hover:bg-primary/80 transition-colors"
                    >
                        Buka File Saya
                    </Link>
                </div>
            </div>

            {/* Ruang kosong di bawah */}
            <div className="flex-grow"></div>
        </div>
    );
};

// Baris 'export default DashboardPage;' telah dihapus.
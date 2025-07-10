// src/components/dashboard/settings/SecuritySettings.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { supabase } from '../../../supabaseClient';
import { VscCheck, VscKey, VscMail, VscLoading } from 'react-icons/vsc';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Tipe untuk setiap email
interface UserEmail {
    email: string;
    is_primary: boolean;
    is_verified: boolean;
}

export const SecuritySettings: React.FC = () => {
    const { user } = useAuth();
    
    // State untuk daftar email
    const [emails, setEmails] = useState<UserEmail[]>([]);
    const [loadingEmails, setLoadingEmails] = useState(true);
    const [newEmail, setNewEmail] = useState('');
    const [isAddingEmail, setIsAddingEmail] = useState(false);

    const fetchEmails = async () => {
        if (!user) return;
        setLoadingEmails(true);
        try {
            const primaryEmail = { 
                email: user.email!, 
                is_primary: true, 
                is_verified: user.email_confirmed_at != null 
            };

            const { data: secondaryEmails, error } = await supabase
                .from('user_emails')
                .select('email, is_primary, is_verified')
                .eq('user_id', user.id);

            if (error) throw error;
            
            setEmails([primaryEmail, ...secondaryEmails]);
        } catch (error: any) {
            toast.error("Gagal memuat daftar email: " + error.message);
        } finally {
            setLoadingEmails(false);
        }
    };

    useEffect(() => {
        fetchEmails();
    }, [user]);

    const handleAddEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEmail) return toast.warn('Silakan masukkan alamat email.');
        
        setIsAddingEmail(true);
        try {
            const { data, error } = await supabase.functions.invoke('add-email-request', {
                body: { new_email: newEmail },
            });

            if (error) throw error;

            toast.info(<div><p className="font-bold">Periksa Kotak Masuk Anda</p><p>Link verifikasi telah dikirim ke {newEmail}.</p></div>, { theme: 'dark' });
            setNewEmail('');
            // Panggil fetchEmails lagi untuk refresh list setelah beberapa saat
            setTimeout(() => fetchEmails(), 2000); 
        } catch (error: any) {
            toast.error(error.message || 'Gagal mengirim email verifikasi.');
        } finally {
            setIsAddingEmail(false);
        }
    };

    return (
        <div className="space-y-10">
            {/* BAGIAN 1: Ganti Password */}
            <div>
                <h3 className="text-lg font-bold text-white">Ganti Password</h3>
                <div className="mt-4 max-w-sm space-y-4">
                    <div className="relative">
                        <VscKey className="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-500" />
                        <input type="password" placeholder="Password Baru" className="w-full rounded-md border border-white/10 bg-white/5 p-3 pl-10 text-white placeholder:text-neutral-400 focus:border-primary focus:ring-primary" />
                    </div>
                    <button className="rounded-md bg-primary px-5 py-2 text-sm font-bold text-background transition-colors hover:bg-primary/80">
                        Update Password
                    </button>
                </div>
            </div>

            {/* BAGIAN 2: Alamat Email */}
            <div>
                <h3 className="text-lg font-bold text-white">Alamat Email</h3>
                <p className="text-sm text-neutral-400">Kelola alamat email yang tertaut ke akun Anda.</p>
                <div className="mt-4 space-y-2">
                    {loadingEmails ? (
                        <div className="text-neutral-400">Memuat daftar email...</div>
                    ) : (
                        emails.map(item => (
                            <div key={item.email} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                                <div className="flex flex-col">
                                    <span className="text-white">{item.email}</span>
                                    <div className="flex items-center gap-2 text-xs">
                                        {item.is_verified ? (
                                            <span className="flex items-center gap-1 text-green-400"><VscCheck /> Terverifikasi</span>
                                        ) : (
                                            <span className="text-yellow-400">Menunggu Verifikasi</span>
                                        )}
                                        {item.is_primary && <span className="font-bold text-primary">Primer</span>}
                                    </div>
                                </div>
                                {!item.is_primary && item.is_verified && (
                                    <button className="text-xs text-primary transition-opacity hover:opacity-75">Jadikan Primer</button>
                                )}
                                {!item.is_verified && (
                                    <button className="text-xs text-primary transition-opacity hover:opacity-75">Kirim Ulang</button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* BAGIAN 3: Tambahkan Email Baru */}
            <div>
                 <h3 className="text-lg font-bold text-white">Tambahkan Email Baru</h3>
                 <form onSubmit={handleAddEmail} className="mt-4 max-w-sm space-y-4">
                    <div className="relative">
                        <VscMail className="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-500" />
                        <input 
                            type="email" 
                            placeholder="Alamat email baru" 
                            className="w-full rounded-md border border-white/10 bg-white/5 p-3 pl-10 text-white placeholder:text-neutral-400 focus:border-primary focus:ring-primary"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            disabled={isAddingEmail}
                        />
                    </div>
                    <button 
                        type="submit"
                        className="flex items-center justify-center rounded-md bg-white/10 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isAddingEmail}
                    >
                        {isAddingEmail && <VscLoading className="mr-2 animate-spin" />}
                        {isAddingEmail ? 'Mengirim...' : 'Kirim Link Verifikasi'}
                    </button>
                </form>
            </div>

            {/* BAGIAN 4: Akun Tertaut */}
            <div>
                <h3 className="text-lg font-bold text-white">Akun Tertaut</h3>
                <p className="text-sm text-neutral-400">Kelola akun pihak ketiga untuk login.</p>
                <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                        <div className="flex items-center gap-3"><FaGoogle /> Google</div>
                        {(user?.app_metadata?.providers || []).includes('google') ? <span className="flex items-center gap-1 text-xs text-green-400"><VscCheck /> Tertaut</span> : <button className="text-xs text-primary hover:underline">Tautkan</button>}
                    </div>
                     <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                        <div className="flex items-center gap-3"><FaGithub /> GitHub</div>
                        {(user?.app_metadata?.providers || []).includes('github') ? <span className="flex items-center gap-1 text-xs text-green-400"><VscCheck /> Tertaut</span> : <button className="text-xs text-primary hover:underline">Tautkan</button>}
                    </div>
                </div>
            </div>
        </div>
    );
};
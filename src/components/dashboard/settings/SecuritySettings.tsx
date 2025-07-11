// src/components/dashboard/settings/SecuritySettings.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { supabase } from '../../../supabaseClient';
import { VscCheck, VscKey, VscMail, VscLoading, VscVerified, VscUnverified } from 'react-icons/vsc';
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

    // State untuk Ganti Password
    const [newPassword, setNewPassword] = useState('');
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    const fetchEmails = async () => {
        if (!user) return;
        setLoadingEmails(true);
        try {
            const primaryEmail: UserEmail = { 
                email: user.email!, 
                is_primary: true, 
                is_verified: user.email_confirmed_at != null 
            };

            const { data: secondaryEmails, error } = await supabase
                .from('user_emails')
                .select('email, is_primary, is_verified')
                .eq('user_id', user.id)
                .order('is_primary', { ascending: false });

            if (error) throw error;
            
            const allEmailsMap = new Map<string, UserEmail>();
            allEmailsMap.set(primaryEmail.email, primaryEmail);
            secondaryEmails.forEach(emailEntry => allEmailsMap.set(emailEntry.email, emailEntry as UserEmail));
            
            setEmails(Array.from(allEmailsMap.values()));
        } catch (error: any) {
            toast.error("Gagal memuat daftar email: " + error.message);
        } finally {
            setLoadingEmails(false);
        }
    };

    useEffect(() => {
        fetchEmails();
    }, [user]); // Re-fetch email list when user object (from AuthContext) changes

    // Fungsi untuk Ganti Password
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            toast.error("Password harus terdiri dari minimal 6 karakter.");
            return;
        }
        setIsUpdatingPassword(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            
            toast.success("Password Anda berhasil diperbarui!");
            toast.info("Demi keamanan, Anda disarankan untuk login ulang.", { autoClose: 5000 });

            setNewPassword('');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    // Fungsi untuk Hubungkan/Putuskan Akun Tertaut (Google/GitHub)
    const handleOAuthLink = async (provider: 'google' | 'github') => {
        setIsUpdatingPassword(true); 
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/dashboard/security`,
                    skipBrowserRedirect: false,
                }
            });
            if (error) throw error;
            toast.info(`Anda akan diarahkan untuk menautkan akun ${provider}.`, { autoClose: 3000 });
            // Setelah OAuth, AuthContext akan memperbarui 'user', dan fetchEmails akan terpicu.
            await supabase.auth.refreshSession(); // Tambahkan ini untuk refresh sesi setelah link
        } catch (error: any) {
            toast.error(`Gagal menautkan akun ${provider}: ${error.message}`);
        } finally {
            setIsUpdatingPassword(false);
        }
    };
    
    const handleOAuthUnlink = async (provider: 'google' | 'github') => {
        toast.warn(
            <div className="flex flex-col">
                <p className="font-bold">Konfirmasi Putuskan Tautan</p>
                <p className="text-sm">Apakah Anda yakin ingin memutuskan tautan akun {provider}?</p>
                <div className="mt-2 flex justify-end gap-2">
                    <button
                        onClick={async () => {
                            toast.dismiss();
                            setIsUpdatingPassword(true); 
                            try {
                                // --- PERBAIKAN: Ambil data user terbaru untuk memastikan identitas ---
                                const { data: { user: freshUser }, error: userFetchError } = await supabase.auth.getUser();
                                if (userFetchError || !freshUser) {
                                    throw new Error("Gagal memuat data user terbaru untuk memutuskan tautan.");
                                }
                                
                                const freshIdentityToUnlink = freshUser.identities?.find(i => i.provider === provider);

                                console.log("Attempting to unlink provider:", provider);
                                console.log("Fresh user identities from getUser():", freshUser.identities);
                                console.log("Fresh identity object found for unlinking:", freshIdentityToUnlink);
                                
                                if (!freshIdentityToUnlink) {
                                    // Jika identitas tidak ditemukan setelah refresh, anggap sudah terputus
                                    console.warn(`Akun ${provider} tidak tertaut atau identitas tidak ditemukan pada data terbaru. Mengupdate UI secara optimis.`);
                                    toast.info(`Akun ${provider} sudah terputus atau tidak pernah tertaut. UI akan diperbarui.`);
                                    await supabase.auth.refreshSession(); // Coba refresh sesi untuk sinkronisasi UI
                                    setTimeout(() => fetchEmails(), 500); 
                                    return;
                                }
                                console.log("Identity ID to be sent for unlinking:", freshIdentityToUnlink.id);

                                const { error } = await supabase.auth.unlinkIdentity(freshIdentityToUnlink);
                                if (error) {
                                    if (error.status === 422 && (error.message.includes('Can not remove the last sign in method') || error.message.includes('A user must have at least one authentication method'))) {
                                        toast.error(`Gagal memutuskan tautan: Ini adalah satu-satunya metode login Anda. Tambahkan password atau tautkan metode lain terlebih dahulu.`);
                                    } else {
                                        throw error;
                                    }
                                } else {
                                    toast.success(`Tautan ${provider} berhasil diputuskan!`);
                                    await supabase.auth.refreshSession(); // --- TAMBAHAN: Refresh sesi setelah berhasil unlink ---
                                    setTimeout(() => fetchEmails(), 500); // Memicu refresh UI setelah sesi di-refresh
                                }
                            } catch (error: any) {
                                console.error(`Error during unlink process for ${provider}:`, error);
                                toast.error(`Gagal memutuskan tautan ${provider}: ${error.message || 'Terjadi kesalahan tidak diketahui.'}`);
                            } finally {
                                setIsUpdatingPassword(false);
                            }
                        }}
                        className="rounded-md bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
                    >
                        Ya, Putuskan
                    </button>
                    <button
                        onClick={() => toast.dismiss()}
                        className="rounded-md bg-neutral-700 px-3 py-1 text-xs text-white hover:bg-neutral-600"
                    >
                        Batal
                    </button>
                </div>
            </div>,
            {
                autoClose: false,
                closeButton: false,
                closeOnClick: false,
                draggable: false,
            }
        );
    };

    // Fungsi untuk Tambahkan Email Baru
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
            setTimeout(() => fetchEmails(), 2000); 
        } catch (error: any) {
            toast.error(error.message || 'Gagal mengirim email verifikasi.');
        } finally {
            setIsAddingEmail(false);
        }
    };

    // Fungsi untuk Jadikan Email Primer
    const handleMakePrimary = async (_emailToMakePrimary: string) => {
        toast.info(
            <div className="flex flex-col">
                <p className="font-bold">Fitur 'Jadikan Primer'</p>
                <p className="text-sm">Fitur ini memerlukan verifikasi tambahan dan akan dikembangkan di backend.</p>
                <p className="text-xs mt-2 text-neutral-400">Hubungi dukungan jika ini mendesak.</p>
            </div>,
            { theme: 'dark', autoClose: 5000 }
        );
    };

    return (
        <div className="space-y-10">
            {/* BAGIAN 1: Ganti Password */}
            <div>
                <h3 className="text-lg font-bold text-white">Ganti Password</h3>
                <p className="text-sm text-neutral-400">Pastikan password baru Anda minimal 6 karakter.</p>
                <form onSubmit={handleChangePassword} className="mt-4 max-w-sm space-y-4">
                    <div className="relative">
                        <VscKey className="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-500" />
                        <input
                            type="password"
                            placeholder="Password Baru"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full rounded-md border border-white/10 bg-white/5 p-3 pl-10 text-white placeholder:text-neutral-400 focus:border-primary focus:ring-primary"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isUpdatingPassword}
                        className="rounded-md bg-primary px-5 py-2 text-sm font-bold text-background transition-colors hover:bg-primary/80 disabled:bg-neutral-600 disabled:cursor-not-allowed"
                    >
                        {isUpdatingPassword ? 'Menyimpan...' : 'Update Password'}
                    </button>
                </form>
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
                                            <span className="flex items-center gap-1 text-green-400"><VscVerified /> Terverifikasi</span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-yellow-400"><VscUnverified /> Menunggu Verifikasi</span>
                                        )}
                                        {item.is_primary && <span className="font-bold text-primary">Primer</span>}
                                    </div>
                                </div>
                                {!item.is_primary && item.is_verified && (
                                    <button
                                        onClick={() => handleMakePrimary(item.email)}
                                        className="text-xs text-primary transition-opacity hover:opacity-75"
                                    >
                                        Jadikan Primer
                                    </button>
                                )}
                                {!item.is_primary && !item.is_verified && (
                                    <button
                                        onClick={() => {
                                            setNewEmail(item.email);
                                            handleAddEmail({ preventDefault: () => {} } as React.FormEvent);
                                        }}
                                        className="text-xs text-primary transition-opacity hover:opacity-75"
                                    >
                                        Kirim Ulang
                                    </button>
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
                        <div className="flex items-center gap-3"><FaGoogle size={20} /> <span className="text-white">Google</span></div>
                        {user?.app_metadata?.providers?.includes('google') ? (
                            <button
                                onClick={() => handleOAuthUnlink('google')}
                                disabled={isUpdatingPassword}
                                className="text-sm font-semibold text-neutral-400 hover:text-red-400 disabled:opacity-50"
                            >
                                Putuskan
                            </button>
                        ) : (
                            <button
                                onClick={() => handleOAuthLink('google')}
                                disabled={isUpdatingPassword}
                                className="text-sm font-semibold text-primary hover:text-primary/80 disabled:opacity-50"
                            >
                                Hubungkan
                            </button>
                        )}
                    </div>
                     <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                        <div className="flex items-center gap-3"><FaGithub size={20} /> <span className="text-white">GitHub</span></div>
                        {user?.app_metadata?.providers?.includes('github') ? (
                            <button
                                onClick={() => handleOAuthUnlink('github')}
                                disabled={isUpdatingPassword}
                                className="text-sm font-semibold text-neutral-400 hover:text-red-400 disabled:opacity-50"
                            >
                                Putuskan
                            </button>
                        ) : (
                            <button
                                onClick={() => handleOAuthLink('github')}
                                disabled={isUpdatingPassword}
                                className="text-sm font-semibold text-primary hover:text-primary/80 disabled:opacity-50"
                            >
                                Hubungkan
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// src/pages/dashboard/DashboardSecurityPage.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';
import { VscKey, VscVerified, VscUnverified } from 'react-icons/vsc';
import { FaGithub, FaGoogle } from 'react-icons/fa';

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <motion.div 
        className="bg-zinc-900/50 border border-white/10 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <h2 className="text-lg font-bold text-white mb-4">{title}</h2>
        {children}
    </motion.div>
);

export const DashboardSecurityPage: React.FC = () => {
    const { user } = useAuth();
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const isEmailVerified = user?.email_confirmed_at;
    const googleLinked = user?.identities?.some(id => id.provider === 'google');
    const githubLinked = user?.identities?.some(id => id.provider === 'github');

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            toast.error("Password harus terdiri dari minimal 6 karakter.");
            return;
        }
        setLoading(true);
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Password berhasil diperbarui!");
            setNewPassword('');
        }
        setLoading(false);
    };

    const handleOAuthLink = async (provider: 'google' | 'github') => {
        setLoading(true);
        await supabase.auth.linkIdentity({ provider });
        setLoading(false);
    };
    
    const handleOAuthUnlink = async (provider: 'google' | 'github') => {
        setLoading(true);
        const identityToUnlink = user?.identities?.find(i => i.provider === provider);
        if (identityToUnlink) {
            const { error } = await supabase.auth.unlinkIdentity(identityToUnlink);
            if (error) {
                toast.error(`Gagal memutuskan tautan: ${error.message}`);
            } else {
                toast.success(`Tautan ${provider} berhasil diputuskan.`);
                // Refresh state, mungkin perlu refresh data user
            }
        }
        setLoading(false);
    };

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <h1 className="font-monument text-3xl text-white mb-8">Keamanan & Login</h1>

            <div className="space-y-8">
                {/* Ganti Password */}
                <SectionCard title="Ganti Password">
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div className="relative">
                            <VscKey className="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-500" />
                            <input
                                type="password"
                                placeholder="Masukkan password baru"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full rounded-md border border-white/10 bg-white/5 p-3 pl-10 text-white placeholder:text-neutral-500 focus:border-primary focus:ring-primary"
                            />
                        </div>
                        <div className="text-right">
                            <button type="submit" disabled={loading} className="rounded-md bg-primary px-5 py-2 text-sm font-bold text-background transition-colors hover:bg-primary/80 disabled:bg-neutral-600">
                                {loading ? 'Menyimpan...' : 'Simpan Password'}
                            </button>
                        </div>
                    </form>
                </SectionCard>

                {/* Status Email */}
                <SectionCard title="Alamat Email">
                   <div className="flex justify-between items-center">
                       <div>
                            <p className="text-white">{user?.email}</p>
                            <p className="text-xs text-neutral-400">Email utama untuk login dan notifikasi.</p>
                       </div>
                       {isEmailVerified ? (
                            <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                                <VscVerified />
                                <span>Terverifikasi</span>
                            </div>
                       ) : (
                            <div className="flex items-center gap-2 text-yellow-400 text-sm font-semibold">
                                <VscUnverified />
                                <span>Belum Diverifikasi</span>
                            </div>
                       )}
                   </div>
                </SectionCard>
                
                {/* Akun Tertaut */}
                <SectionCard title="Akun Tertaut">
                    <div className="space-y-4">
                       <div className="flex justify-between items-center">
                           <div className="flex items-center gap-3"><FaGoogle size={20} /> <span className="text-white">Google</span></div>
                           {googleLinked ? 
                               <button onClick={() => handleOAuthUnlink('google')} disabled={loading} className="text-sm font-semibold text-neutral-400 hover:text-red-400">Putuskan</button> : 
                               <button onClick={() => handleOAuthLink('google')} disabled={loading} className="text-sm font-semibold text-primary hover:text-primary/80">Hubungkan</button>
                           }
                       </div>
                       <div className="flex justify-between items-center">
                           <div className="flex items-center gap-3"><FaGithub size={20} /> <span className="text-white">GitHub</span></div>
                           {githubLinked ? 
                               <button onClick={() => handleOAuthUnlink('github')} disabled={loading} className="text-sm font-semibold text-neutral-400 hover:text-red-400">Putuskan</button> :
                               <button onClick={() => handleOAuthLink('github')} disabled={loading} className="text-sm font-semibold text-primary hover:text-primary/80">Hubungkan</button>
                           }
                       </div>
                    </div>
                </SectionCard>
            </div>
        </div>
    );
};
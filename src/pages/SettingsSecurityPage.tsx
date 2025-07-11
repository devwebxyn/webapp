// src/pages/SettingsSecurityPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { supabase } from '../supabaseClient';
import { VscKey, VscMail, VscLoading, VscVerified, VscUnverified } from 'react-icons/vsc';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface UserEmail {
  email: string;
  is_primary: boolean;
  is_verified: boolean;
}

export default function SettingsSecurityPage() {
  const { user } = useAuth();
  const [emails, setEmails] = useState<UserEmail[]>([]);
  const [loadingEmails, setLoadingEmails] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [isAddingEmail, setIsAddingEmail] = useState(false);
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
      secondaryEmails.forEach(emailEntry =>
        allEmailsMap.set(emailEntry.email, emailEntry as UserEmail)
      );

      setEmails(Array.from(allEmailsMap.values()));
    } catch (error: any) {
      toast.error("Gagal memuat daftar email: " + error.message);
    } finally {
      setLoadingEmails(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, [user]);

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
      toast.success("Password berhasil diperbarui!");
      toast.info("Demi keamanan, Anda disarankan login ulang.", { autoClose: 5000 });
      setNewPassword('');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleOAuthLink = async (provider: 'google' | 'github') => {
    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard/security`,
          skipBrowserRedirect: false
        }
      });
      if (error) throw error;
      toast.info(`Menghubungkan akun ${provider}...`);
      await supabase.auth.refreshSession();
    } catch (error: any) {
      toast.error(`Gagal hubungkan akun ${provider}: ${error.message}`);
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
                const { data: { user: freshUser }, error: fetchError } = await supabase.auth.getUser();
                if (fetchError || !freshUser) throw new Error("Gagal memuat ulang user.");
                const identity = freshUser.identities?.find(i => i.provider === provider);
                if (!identity) {
                  toast.info(`Akun ${provider} sudah tidak tertaut.`);
                  return;
                }
                const { error } = await supabase.auth.unlinkIdentity(identity);
                if (error) throw error;
                toast.success(`Akun ${provider} berhasil diputus.`);
                await supabase.auth.refreshSession();
                setTimeout(() => fetchEmails(), 500);
              } catch (err: any) {
                toast.error(err.message || `Gagal unlink ${provider}.`);
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
        draggable: false
      }
    );
  };

  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return toast.warn("Silakan masukkan alamat email.");
    setIsAddingEmail(true);
    try {
      const { error } = await supabase.functions.invoke('add-email-request', {
        body: { new_email: newEmail }
      });
      if (error) throw error;
      toast.info(
        <div>
          <p className="font-bold">Periksa Kotak Masuk Anda</p>
          <p>Link verifikasi dikirim ke {newEmail}</p>
        </div>
      );
      setNewEmail('');
      setTimeout(() => fetchEmails(), 2000);
    } catch (error: any) {
      toast.error(error.message || 'Gagal kirim email verifikasi.');
    } finally {
      setIsAddingEmail(false);
    }
  };

  const handleMakePrimary = async (_email: string) => {
    toast.info(
      <div className="flex flex-col">
        <p className="font-bold">Fitur belum tersedia</p>
        <p className="text-sm">Akan dikembangkan di backend nanti.</p>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-10 max-w-3xl mx-auto">
      {/* Ganti Password */}
      <section>
        <h2 className="text-lg font-bold text-white">Ganti Password</h2>
        <p className="text-sm text-neutral-400">Password minimal 6 karakter.</p>
        <form onSubmit={handleChangePassword} className="mt-4 space-y-4 max-w-sm">
          <div className="relative">
            <VscKey className="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-500" />
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full rounded-md border border-white/10 bg-white/5 p-3 pl-10 text-white"
              placeholder="Password Baru"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isUpdatingPassword}
            className="w-full rounded-md bg-primary px-5 py-2 text-sm font-bold text-background disabled:bg-neutral-600"
          >
            {isUpdatingPassword ? 'Menyimpan...' : 'Update Password'}
          </button>
        </form>
      </section>

      {/* Daftar Email */}
      <section>
        <h2 className="text-lg font-bold text-white">Alamat Email</h2>
        <div className="mt-4 space-y-2">
          {loadingEmails ? (
            <p className="text-neutral-400">Memuat...</p>
          ) : (
            emails.map(email => (
              <div key={email.email} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                <div>
                  <p className="text-white">{email.email}</p>
                  <div className="flex gap-2 text-xs">
                    {email.is_verified ? (
                      <span className="text-green-400 flex items-center gap-1"><VscVerified /> Terverifikasi</span>
                    ) : (
                      <span className="text-yellow-400 flex items-center gap-1"><VscUnverified /> Belum Verifikasi</span>
                    )}
                    {email.is_primary && <span className="text-primary font-bold">Primer</span>}
                  </div>
                </div>
                {!email.is_primary && (
                  <button
                    className="text-sm text-primary"
                    onClick={() => email.is_verified ? handleMakePrimary(email.email) : handleAddEmail({ preventDefault: () => {} } as any)}
                  >
                    {email.is_verified ? 'Jadikan Primer' : 'Kirim Ulang'}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Tambah Email Baru */}
      <section>
        <h2 className="text-lg font-bold text-white">Tambahkan Email Baru</h2>
        <form onSubmit={handleAddEmail} className="mt-4 space-y-4 max-w-sm">
          <div className="relative">
            <VscMail className="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-500" />
            <input
              type="email"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              placeholder="Alamat email baru"
              className="w-full rounded-md border border-white/10 bg-white/5 p-3 pl-10 text-white"
              disabled={isAddingEmail}
            />
          </div>
          <button
            type="submit"
            disabled={isAddingEmail}
            className="w-full rounded-md bg-white/10 px-5 py-2 text-sm font-bold text-white"
          >
            {isAddingEmail ? <VscLoading className="animate-spin inline-block mr-2" /> : null}
            {isAddingEmail ? 'Mengirim...' : 'Kirim Link Verifikasi'}
          </button>
        </form>
      </section>

      {/* Akun Tertaut */}
      <section>
        <h2 className="text-lg font-bold text-white">Akun Tertaut</h2>
        <div className="space-y-3 mt-4">
          {['google', 'github'].map(provider => (
            <div key={provider} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                {provider === 'google' ? <FaGoogle /> : <FaGithub />}
                <span className="text-white capitalize">{provider}</span>
              </div>
              {user?.app_metadata?.providers?.includes(provider) ? (
                <button
                  onClick={() => handleOAuthUnlink(provider as any)}
                  disabled={isUpdatingPassword}
                  className="text-sm text-neutral-400 hover:text-red-400"
                >
                  Putuskan
                </button>
              ) : (
                <button
                  onClick={() => handleOAuthLink(provider as any)}
                  disabled={isUpdatingPassword}
                  className="text-sm text-primary"
                >
                  Hubungkan
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

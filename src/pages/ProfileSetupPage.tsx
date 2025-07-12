import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { VscCloudUpload } from 'react-icons/vsc';
import { toast } from 'react-toastify'; // <-- Impor toast

export const ProfileSetupPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [hobby, setHobby] = useState('');
  const [occupation, setOccupation] = useState('');
  const navigate = useNavigate();

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Anda harus memilih gambar untuk diunggah.');
      }
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Pengguna tidak ditemukan.');

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setAvatarUrl(data.publicUrl);
      
      // Ganti alert dengan toast.success
      toast.success('Foto profil berhasil diunggah!');

    } catch (error: any) {
      // Ganti alert dengan toast.error
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleProfileUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) throw new Error("Pengguna tidak ditemukan.");

        const updates = {
            id: user.id,
            avatar_url: avatarUrl,
            date_of_birth: dateOfBirth,
            place_of_birth: placeOfBirth,
            hobby: hobby,
            occupation: occupation,
            updated_at: new Date(),
        };

        const { error } = await supabase.from('profiles').upsert(updates);
        if (error) throw error;

        // Ganti alert dengan toast.success
        toast.success('Profil berhasil diperbarui!');
        navigate('/dashboard');

    } catch (error: any) {
        // Ganti alert dengan toast.error
        toast.error(error.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    // ... JSX Anda tetap sama persis, tidak perlu diubah ...
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
            <h1 className="font-monument text-3xl text-white">Setup Akun Anda</h1>
            <p className="mt-2 text-neutral-400">Lengkapi profil Anda untuk memulai.</p>
        </div>

        <form onSubmit={handleProfileUpdate} className="mt-12 space-y-6">
            <div className="flex flex-col items-center gap-4">
                <img
                    src={avatarUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${'User'}`}
                    alt="Avatar"
                    className="h-24 w-24 rounded-full border-2 border-primary/50 object-cover"
                />
                <label htmlFor="avatar-upload" className="cursor-pointer rounded-md bg-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-white/20">
                    <VscCloudUpload className="mr-2 inline" />
                    {loading ? 'Mengunggah...' : 'Unggah Foto'}
                </label>
                <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarUpload} disabled={loading} className="hidden" />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input type="text" placeholder="Tempat Lahir" value={placeOfBirth} onChange={e => setPlaceOfBirth(e.target.value)} className="w-full rounded-md border border-white/10 bg-white/5 p-3 text-white placeholder:text-neutral-500 focus:border-primary focus:ring-primary" />
                <input type="date" placeholder="Tanggal Lahir" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} className="w-full rounded-md border border-white/10 bg-white/5 p-3 text-white placeholder:text-neutral-500 focus:border-primary focus:ring-primary" />
            </div>
            <input type="text" placeholder="Pekerjaan" value={occupation} onChange={e => setOccupation(e.target.value)} className="w-full rounded-md border border-white/10 bg-white/5 p-3 text-white placeholder:text-neutral-500 focus:border-primary focus:ring-primary" />
            <input type="text" placeholder="Hobi" value={hobby} onChange={e => setHobby(e.target.value)} className="w-full rounded-md border border-white/10 bg-white/5 p-3 text-white placeholder:text-neutral-500 focus:border-primary focus:ring-primary" />
            
            <button type="submit" disabled={loading} className="w-full rounded-md bg-primary py-3 font-bold text-background transition-colors hover:bg-primary/80 disabled:bg-neutral-600">
                {loading ? 'Menyimpan...' : 'Selesai & Lanjutkan'}
            </button>
        </form>
    </div>
  );
};
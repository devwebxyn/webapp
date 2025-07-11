import React, { useState, useEffect } from 'react';
import { VscCloudUpload } from 'react-icons/vsc';
import { supabase } from '../supabaseClient';
import { useAuth } from '../components/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

interface ProfileData {
  full_name: string;
  avatar_url: string | null;
  date_of_birth: string;
  place_of_birth: string;
  hobby: string;
  occupation: string;
}

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData>({
    full_name: '',
    avatar_url: null,
    date_of_birth: '',
    place_of_birth: '',
    hobby: '',
    occupation: '',
  });

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      if (user) {
        setLoading(true);
        try {
          const { data, error, status } = await supabase
            .from('profiles')
            .select(`full_name, avatar_url, date_of_birth, place_of_birth, hobby, occupation`)
            .eq('id', user.id)
            .single();

          if (error && status !== 406) throw error;

          if (isMounted && data) {
            setProfile({
              full_name: data.full_name || user.user_metadata?.full_name || '',
              avatar_url: data.avatar_url,
              date_of_birth: data.date_of_birth || '',
              place_of_birth: data.place_of_birth || '',
              hobby: data.hobby || '',
              occupation: data.occupation || '',
            });
          }
        } catch (error: any) {
          toast.error(error.message);
        } finally {
          if (isMounted) setLoading(false);
        }
      }
    };
    fetchProfile();
    return () => { isMounted = false; };
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Anda harus memilih gambar untuk diunggah.');
      }
      if (!user) throw new Error('Pengguna tidak ditemukan.');

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, {
          upsert: true // Menimpa file lama jika ada
      });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setProfile({ ...profile, avatar_url: data.publicUrl });
      toast.success('Foto profil berhasil diperbarui!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleProfileUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
        if (!user) throw new Error("Pengguna tidak ditemukan.");
        const updates = {
            id: user.id,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
            date_of_birth: profile.date_of_birth,
            place_of_birth: profile.place_of_birth,
            hobby: profile.hobby,
            occupation: profile.occupation,
            updated_at: new Date(),
        };
        const { error } = await supabase.from('profiles').upsert(updates);
        if (error) throw error;
        toast.success('Profil berhasil diperbarui!');
    } catch (error: any) {
        toast.error(error.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-monument text-3xl text-white mb-2">Profil Pengguna</h1>
        <p className="text-neutral-400 mb-8">Kelola dan perbarui informasi pribadi Anda di sini.</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 md:p-8"
      >
        {loading ? (
            <div className="text-center py-12">Memuat profil...</div>
        ) : (
            <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="flex flex-col items-center gap-4">
                    <img
                    src={profile.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${profile.full_name || 'User'}`}
                    alt="Avatar"
                    className="h-24 w-24 rounded-full border-2 border-primary/50 object-cover bg-zinc-800"
                    />
                    <label htmlFor="settings-avatar-upload" className="cursor-pointer rounded-md bg-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-white/20">
                    <VscCloudUpload className="mr-2 inline" />
                    {loading ? 'Mengunggah...' : 'Ubah Foto'}
                    </label>
                    <input id="settings-avatar-upload" type="file" accept="image/*" onChange={handleAvatarUpload} disabled={loading} className="hidden" />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <input type="text" name="full_name" placeholder="Nama Lengkap" value={profile.full_name} onChange={handleChange} className="w-full rounded-md border border-white/10 bg-white/5 p-3 text-white placeholder:text-neutral-500 focus:border-primary focus:ring-primary" />
                    <input type="text" name="occupation" placeholder="Pekerjaan" value={profile.occupation} onChange={handleChange} className="w-full rounded-md border border-white/10 bg-white/5 p-3 text-white placeholder:text-neutral-500 focus:border-primary focus:ring-primary" />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <input type="text" name="place_of_birth" placeholder="Tempat Lahir" value={profile.place_of_birth} onChange={handleChange} className="w-full rounded-md border border-white/10 bg-white/5 p-3 text-white placeholder:text-neutral-500 focus:border-primary focus:ring-primary" />
                    <input type="date" name="date_of_birth" placeholder="Tanggal Lahir" value={profile.date_of_birth} onChange={handleChange} className="w-full rounded-md border border-white/10 bg-white/5 p-3 text-white placeholder:text-neutral-500 focus:border-primary focus:ring-primary" />
                </div>
                <input type="text" name="hobby" placeholder="Hobi" value={profile.hobby} onChange={handleChange} className="w-full rounded-md border border-white/10 bg-white/5 p-3 text-white placeholder:text-neutral-500 focus:border-primary focus:ring-primary" />

                <div className="flex justify-end pt-4">
                    <button type="submit" disabled={loading} className="rounded-md bg-primary px-6 py-2 font-bold text-background transition-colors hover:bg-primary/80 disabled:bg-neutral-600">
                    {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>
            </form>
        )}
      </motion.div>
    </div>
  );
};
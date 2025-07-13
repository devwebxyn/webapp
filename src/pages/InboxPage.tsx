import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { VscCheck, VscChromeClose, VscSend, VscLoading } from 'react-icons/vsc';
import { useAuth } from '../components/AuthContext';
import { supabase } from '../supabaseClient';
import { toast } from 'react-toastify';

// Tipe data untuk permintaan file (dengan profil pengirim yang sudah di-join)
interface FileRequest {
  id: number;
  created_at: string;
  sender_id: string;
  recipient_email: string;
  subject: string;
  message: string | null;
  status: string;
  // --- PERBAIKAN TIPE: Gunakan alias 'sender' yang akan kita definisikan di query ---
  sender: {
    full_name: string;
    avatar_url: string;
  } | null;
}

type ActiveTab = 'inbox' | 'sent' | 'compose';

export const InboxPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('inbox');
  const [incomingRequests, setIncomingRequests] = useState<FileRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [composeData, setComposeData] = useState({ recipient_email: '', subject: '', message: '' });
  const [isSending, setIsSending] = useState(false);

  // --- PERBAIKAN KUNCI ADA DI SINI ---
  const fetchData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Ambil permintaan yang masuk (Anda adalah penerima)
      const { data: inboxData, error: inboxError } = await supabase
        .from('file_requests')
        // Sintaks join eksplisit: '*, alias:nama_kolom_asing!inner(*)' atau 'nama_tabel!nama_kolom_asing(*)'
        // Ini memberitahu Supabase untuk join ke tabel 'profiles' melalui kolom 'sender_id'
        .select('*, sender:profiles!file_requests_sender_id_fkey(full_name, avatar_url)')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false });

      if (inboxError) throw inboxError;
      setIncomingRequests(inboxData as any[]);

      // Ambil permintaan yang terkirim (tidak perlu join di sini)
      const { data: sentData, error: sentError } = await supabase
        .from('file_requests')
        .select('*')
        .eq('sender_id', user.id)
        .order('created_at', { ascending: false });
      if (sentError) throw sentError;
      setSentRequests(sentData);

    } catch (error: any) {
      console.error("Supabase query error:", error);
      toast.error("Gagal memuat data inbox: " + error.message);
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  // --- AKHIR PERBAIKAN ---

  useEffect(() => {
    if(user) fetchData();
  }, [user, fetchData]);

  const handleComposeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setComposeData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSendRequest = async () => {
    if (!composeData.recipient_email.trim() || !composeData.subject.trim()) {
      return toast.warn("Email penerima dan subjek harus diisi.");
    }
    if (!user) return toast.error("Anda harus login untuk mengirim permintaan.");

    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('handle-file-request', {
        body: {
          sender_id: user.id,
          recipient_email: composeData.recipient_email.trim(),
          subject: composeData.subject.trim(),
          message: composeData.message.trim(),
        },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      toast.success("Permintaan berhasil dikirim!");
      setComposeData({ recipient_email: '', subject: '', message: '' });
      await fetchData();
      setActiveTab('sent');
    } catch (error: any) {
      toast.error(error.message || 'Terjadi kesalahan tidak diketahui.');
    } finally {
      setIsSending(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
        return <div className="flex justify-center p-8"><VscLoading className="animate-spin text-2xl"/></div>;
    }
    switch (activeTab) {
        case 'inbox':
            return (
                incomingRequests.length > 0 ?
                <div className="space-y-3">
                    {incomingRequests.map(req => (
                        <div key={req.id} className="bg-zinc-800/50 p-4 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <img src={req.sender?.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${req.sender?.full_name}`} alt="avatar" className="w-10 h-10 rounded-full bg-zinc-700 object-cover"/>
                                <div>
                                    <p className="font-bold text-white">{req.subject}</p>
                                    <p className="text-sm text-neutral-400">Dari: {req.sender?.full_name || 'Pengguna tidak dikenal'}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 bg-green-500/20 text-green-400 rounded-md hover:bg-green-500/40"><VscCheck/></button>
                                <button className="p-2 bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/40"><VscChromeClose /></button>
                            </div>
                        </div>
                    ))}
                </div> : <p className="text-center text-neutral-500 py-8">Tidak ada permintaan masuk.</p>
            );
        case 'sent':
            return (
                sentRequests.length > 0 ?
                <div className="space-y-3">
                    {sentRequests.map(req => (
                        <div key={req.id} className="bg-zinc-800/50 p-4 rounded-lg flex items-center justify-between">
                            <div>
                                <p className="text-white">{req.subject}</p>
                                <p className="text-sm text-neutral-400">Kepada: {req.recipient_email}</p>
                            </div>
                            <span className="text-xs text-primary font-semibold capitalize">{req.status}</span>
                        </div>
                    ))}
                </div> : <p className="text-center text-neutral-500 py-8">Anda belum mengirim permintaan apapun.</p>
            );
        case 'compose':
            return (
                <div className="space-y-4">
                    <input type="email" name="recipient_email" value={composeData.recipient_email} onChange={handleComposeChange} placeholder="Email pengguna tujuan..." className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-white"/>
                    <input type="text" name="subject" value={composeData.subject} onChange={handleComposeChange} placeholder="Subjek (misal: Minta Laporan Penjualan Q2)" className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-white"/>
                    <textarea name="message" value={composeData.message} onChange={handleComposeChange} placeholder="Tulis pesan tambahan (opsional)..." className="w-full h-24 bg-white/5 border border-white/10 rounded-md p-3 text-white resize-none"></textarea>
                    <div className="flex justify-end">
                        <button onClick={handleSendRequest} disabled={isSending} className="bg-primary text-background font-bold px-6 py-2 rounded-md flex items-center gap-2 disabled:bg-neutral-600">
                            {isSending ? <VscLoading className="animate-spin"/> : <VscSend />}
                            {isSending ? 'Mengirim...' : 'Kirim Permintaan'}
                        </button>
                    </div>
                </div>
            );
        default:
            return null;
    }
  }

  return (
    <div className="p-4 md:p-8">
        <h1 className="font-monument text-3xl text-white">Inbox</h1>
        <p className="text-neutral-400 mb-8">Kelola permintaan dan pengiriman file Anda di sini.</p>
        <div className="flex border-b border-white/10 mb-6">
            <button onClick={() => setActiveTab('inbox')} className={`px-4 py-2 text-sm font-semibold ${activeTab === 'inbox' ? 'text-primary border-b-2 border-primary' : 'text-neutral-400'}`}>Kotak Masuk</button>
            <button onClick={() => setActiveTab('sent')} className={`px-4 py-2 text-sm font-semibold ${activeTab === 'sent' ? 'text-primary border-b-2 border-primary' : 'text-neutral-400'}`}>Terkirim</button>
            <button onClick={() => setActiveTab('compose')} className={`px-4 py-2 text-sm font-semibold ${activeTab === 'compose' ? 'text-primary border-b-2 border-primary' : 'text-neutral-400'}`}>Tulis Baru</button>
        </div>
        <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {renderContent()}
        </motion.div>
    </div>
  );
};
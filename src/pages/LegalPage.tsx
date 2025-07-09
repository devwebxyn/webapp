import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { VscCheck, VscError, VscCheckAll, VscLock } from 'react-icons/vsc';

// Variabel 'sectionVariants' yang tidak terpakai sudah dihapus dari sini

// --- MOCKUP UI 2D ---

const TOSMockup = () => (
  <div className="mt-8 rounded-xl border border-white/10 bg-neutral-900/50 p-6 backdrop-blur-sm">
    <div className="flex items-center gap-4">
      <VscCheckAll size={40} className="text-green-400" />
      <div>
        <h4 className="font-bold text-white">Persetujuan Anda</h4>
        <p className="text-sm text-neutral-400">Dengan menggunakan layanan, Anda menyetujui:</p>
      </div>
    </div>
    <ul className="mt-4 space-y-2 text-sm text-neutral-300">
      <li className="flex items-center gap-3"><VscCheck className="text-green-400"/> Kepemilikan Konten Anda</li>
      <li className="flex items-center gap-3"><VscCheck className="text-green-400"/> Ketersediaan Layanan</li>
      <li className="flex items-center gap-3"><VscCheck className="text-green-400"/> Batasan Tanggung Jawab</li>
    </ul>
  </div>
);

const PrivacyMockup = () => (
  <div className="mt-8 rounded-xl border border-white/10 bg-neutral-900/50 p-6 backdrop-blur-sm">
    <div className="flex items-center justify-between gap-4">
      <div className="text-center">
        <p className="text-sm font-bold text-white">Data Anda</p>
        <div className="mt-2 h-16 w-16 rounded-lg bg-black/30"></div>
      </div>
      <div className="font-mono text-xs text-primary animate-pulse">[ AES-256 ENCRYPTION ]</div>
      <div className="text-center">
        <p className="text-sm font-bold text-white">Brankas CloudNest</p>
        <div className="mt-2 flex h-16 w-16 items-center justify-center rounded-lg bg-primary/20">
          <VscLock size={32} className="text-primary" />
        </div>
      </div>
    </div>
  </div>
);

const AUPMockup = () => (
  <div className="mt-8 grid grid-cols-2 gap-4 rounded-xl border border-white/10 bg-neutral-900/50 p-6 backdrop-blur-sm">
    <div>
      <div className="flex items-center gap-2">
        <VscCheck size={20} className="text-green-400" />
        <h4 className="font-bold text-white">Yang Diperbolehkan</h4>
      </div>
      <ul className="mt-2 space-y-1 text-xs text-neutral-400">
        <li>- Mengarsipkan file pribadi</li>
        <li>- Berbagi dengan kolaborator</li>
        <li>- Menggunakan API secara wajar</li>
      </ul>
    </div>
    <div>
      <div className="flex items-center gap-2">
        <VscError size={20} className="text-red-400" />
        <h4 className="font-bold text-white">Yang Dilarang</h4>
      </div>
      <ul className="mt-2 space-y-1 text-xs text-neutral-400">
        <li>- Aktivitas ilegal</li>
        <li>- Menyebar malware/spam</li>
        <li>- Melanggar hak cipta</li>
      </ul>
    </div>
  </div>
);

const TabContent: React.FC<{ title: string; version: string; date: string; children: React.ReactNode; mockup: React.ReactNode }> = ({ title, version, date, children, mockup }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <h2 className="font-monument text-2xl text-neutral-100">{title}</h2>
        <p className="text-xs text-neutral-500">Versi {version} | Terakhir diperbarui: {date}</p>
        <div className="prose prose-invert mt-6 max-w-none text-neutral-300">
            {children}
        </div>
        {mockup}
    </motion.div>
);

export const LegalPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('tos');

    return (
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
            <h1 className="text-center font-monument text-4xl uppercase text-neutral-100">Pusat Legal</h1>
            
            <div className="mt-12 mb-8 border-b border-white/10">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab('tos')} className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${activeTab === 'tos' ? 'border-primary text-primary' : 'border-transparent text-neutral-400 hover:border-neutral-300 hover:text-neutral-200'}`}>
                        Syarat & Ketentuan
                    </button>
                    <button onClick={() => setActiveTab('privacy')} className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${activeTab === 'privacy' ? 'border-primary text-primary' : 'border-transparent text-neutral-400 hover:border-neutral-300 hover:text-neutral-200'}`}>
                        Kebijakan Privasi
                    </button>
                     <button onClick={() => setActiveTab('aup')} className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${activeTab === 'aup' ? 'border-primary text-primary' : 'border-transparent text-neutral-400 hover:border-neutral-300 hover:text-neutral-200'}`}>
                        Kebijakan Penggunaan
                    </button>
                </nav>
            </div>
            
            <div>
                {activeTab === 'tos' && (
                    <TabContent title="Syarat & Ketentuan" version="2.0" date="1 Juli 2025" mockup={<TOSMockup />}>
                        <p>Selamat datang di CloudNest. Dengan menggunakan layanan kami ("Layanan"), Anda setuju untuk terikat oleh syarat dan ketentuan berikut. Jika Anda tidak setuju, mohon untuk tidak menggunakan Layanan kami.</p>
                        <h4>1. Akun Pengguna</h4>
                        <p>Anda bertanggung jawab untuk menjaga kerahasiaan akun dan kata sandi Anda. Anda setuju untuk menerima tanggung jawab atas semua aktivitas yang terjadi di bawah akun Anda.</p>
                        <h4>2. Konten Pengguna</h4>
                        <p>Anda memiliki semua hak atas konten yang Anda simpan di CloudNest. Kami tidak mengklaim kepemilikan apa pun atas konten Anda.</p>
                    </TabContent>
                )}
                 {activeTab === 'privacy' && (
                    <TabContent title="Kebijakan Privasi" version="1.5" date="1 Juli 2025" mockup={<PrivacyMockup />}>
                        <p>Privasi Anda sangat penting bagi kami. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat Anda menggunakan CloudNest.</p>
                        <h4>1. Informasi yang Kami Kumpulkan</h4>
                        <p>Kami hanya mengumpulkan informasi yang esensial untuk menyediakan layanan, seperti alamat email dan metadata file (bukan isi file). Kami tidak pernah melihat atau menganalisis isi file Anda.</p>
                        <h4>2. Bagaimana Kami Menggunakan Informasi</h4>
                        <p>Informasi yang kami kumpulkan digunakan untuk otentikasi akun, komunikasi layanan, dan pemrosesan pembayaran jika berlaku.</p>
                    </TabContent>
                )}
                 {activeTab === 'aup' && (
                    <TabContent title="Kebijakan Penggunaan yang Diterima" version="1.2" date="1 Januari 2025" mockup={<AUPMockup />}>
                        <p>Kebijakan ini menguraikan penggunaan yang dilarang dari layanan CloudNest untuk memastikan platform tetap aman dan dapat diandalkan untuk semua pengguna.</p>
                        <h4>Aktivitas yang Dilarang Meliputi:</h4>
                        <ul>
                            <li>Menyimpan atau menyebarkan materi ilegal.</li>
                            <li>Menggunakan layanan untuk spamming atau serangan phishing.</li>
                            <li>Menyimpan atau mendistribusikan malware, virus, atau kode berbahaya lainnya.</li>
                            <li>Melanggar hak kekayaan intelektual orang lain.</li>
                        </ul>
                    </TabContent>
                )}
            </div>

            <div className="mt-16 border-t border-white/10 pt-8 text-center text-sm text-neutral-400">
                <p>Jika Anda memiliki pertanyaan terkait hukum atau privasi, silakan hubungi <a href="mailto:comdonate9@gmail.com" className="text-primary hover:underline">comdonate9@gmail.com</a></p>
            </div>
        </div>
    );
};
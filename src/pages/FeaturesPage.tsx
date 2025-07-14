// src/pages/FeaturesPage.tsx

import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { VscRepo, VscSync, VscSparkle, VscLock, VscChevronRight } from 'react-icons/vsc';
import { Link } from 'react-router-dom';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

interface FeatureDetailProps {
  // --- PERBAIKAN SPESIFIK ADA DI SINI ---
  // Tipe untuk 'icon' diubah dari React.ReactNode menjadi React.ReactElement.
  // Ini adalah tipe yang benar untuk elemen JSX yang akan di-clone.
  icon: React.ReactElement<{ size?: number }>; 
  title: string;
  children: React.ReactNode;
}

// Komponen Reusable untuk setiap detail fitur
const FeatureDetail: React.FC<FeatureDetailProps> = ({ icon, title, children }) => (
  <motion.section 
    variants={sectionVariants} 
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
    className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 p-8 shadow-lg"
  >
    <div className="flex items-center gap-4">
      <div className="rounded-lg bg-primary/10 p-3 text-primary">
        {/* Panggilan cloneElement ini sekarang aman secara tipe */}
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <h3 className="font-monument text-2xl uppercase text-white">{title}</h3>
    </div>
    <div className="prose prose-invert mt-4 max-w-none text-neutral-300">
      {children}
    </div>
  </motion.section>
);

export const FeaturesPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-monument text-4xl uppercase text-primary md:text-5xl">
          Fitur Unggulan CloudNest
        </h1>
        <p className="mt-4 font-satoshi text-lg text-neutral-400">
          Dirancang для mengubah cara Anda berinteraksi dengan data digital, dengan keamanan dan kecerdasan sebagai intinya.
        </p>
      </motion.div>

      <div className="mt-20 space-y-16">
        <FeatureDetail icon={<VscRepo />} title="Penyimpanan Terpadu">
          <p>
            CloudNest memecahkan masalah fragmentasi data. Alih-alih file Anda tersebar di laptop, Google Drive, dan Dropbox, kami menyediakan satu brankas digital terpusat.
          </p>
          <ul>
            <li>Unggah file dan folder langsung dari perangkat Anda.</li>
            <li>Hubungkan layanan pihak ketiga seperti Google Drive untuk sinkronisasi dua arah.</li>
            <li>Akses semua aset digital Anda melalui satu antarmuka yang bersih dan cepat.</li>
          </ul>
        </FeatureDetail>

        <FeatureDetail icon={<VscSparkle />} title="Organisasi Cerdas AI">
          <p>
            Ini bukan sekadar penyimpanan; ini adalah pemahaman. AI kami bekerja di latar belakang untuk memberikan konteks pada data Anda, mengubah arsip statis menjadi koleksi yang hidup.
          </p>
          <ul>
            <li><strong>Pengenalan Gambar:</strong> Foto secara otomatis diberi tag berdasarkan objek, orang, dan lokasi. Cari "foto pantai saat matahari terbenam" dan temukan hasilnya.</li>
            <li><strong>Ringkasan Dokumen:</strong> Dapatkan intisari dari dokumen PDF atau Word yang panjang tanpa membukanya.</li>
            <li><strong>Deteksi Duplikat:</strong> Kosongkan ruang dengan mudah menggunakan fitur pendeteksi file duplikat kami.</li>
          </ul>
        </FeatureDetail>

        <FeatureDetail icon={<VscSync />} title="Arsip Media Sosial">
          <p>
            Kenangan digital Anda di media sosial sangat berharga. CloudNest memungkinkan Anda mengabadikannya secara permanen, aman dari penghapusan atau perubahan kebijakan platform.
          </p>
          <ul>
            <li>Hubungkan akun Instagram, Twitter (X), dan lainnya untuk mengimpor riwayat postingan Anda.</li>
            <li>Arsip disimpan dalam format terbuka yang dapat diakses bahkan jika Anda menutup akun media sosial Anda.</li>
            <li>AI kami juga dapat menganalisis arsip ini untuk menunjukkan tren dan wawasan dari waktu ke waktu.</li>
          </ul>
        </FeatureDetail>

        <FeatureDetail icon={<VscLock />} title="Privasi & Enkripsi">
          <p>
            Kami percaya privasi adalah hak, bukan fitur premium. Arsitektur Tanpa-Pengetahuan (Zero-Knowledge) kami memastikan bahwa hanya Anda yang dapat mengakses dan membaca data Anda.
          </p>
          <ul>
            <li><strong>Enkripsi End-to-End:</strong> Data dienkripsi di perangkat Anda sebelum diunggah dan hanya dapat didekripsi oleh Anda.</li>
            <li><strong>Metadata Terenkripsi:</strong> Tidak seperti layanan lain, kami juga mengenkripsi nama file dan metadata lainnya.</li>
            <li><strong>Otentikasi Aman:</strong> Didukung oleh login sosial yang aman dan opsi otentikasi multi-faktor.</li>
          </ul>
        </FeatureDetail>
      </div>

      <motion.div 
        className="mt-20 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <h2 className="font-monument text-3xl uppercase text-white">Siap Mengambil Kendali?</h2>
        <p className="mx-auto mt-2 max-w-xl text-neutral-300">
          Mulai bangun arsip digital pribadi Anda yang cerdas dan aman hari ini.
        </p>
        <Link
          to="/register"
          className="group mt-8 inline-flex items-center justify-center rounded-md border border-primary/50 bg-primary/10 px-8 py-4 font-satoshi text-base uppercase tracking-wider text-neutral backdrop-blur-sm transition-all duration-300 hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/20"
        >
          Daftar Gratis
          <VscChevronRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </div>
  );
};

export default FeaturesPage;
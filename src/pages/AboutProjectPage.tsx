import React from 'react';
import { motion, type Variants } from 'framer-motion';
// Impor ikon baru untuk mockup UI
import { VscFile, VscShield, VscPerson, VscSparkle } from 'react-icons/vsc';
import { FaTwitter, FaImage, FaVideo } from 'react-icons/fa';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

// --- MOCKUP UI BARU ---

// 1. Mockup Penyimpanan (Konsep Linimasa/Memory Stream)
const TimelineMockup = () => (
  <div className="mt-8 h-80 overflow-hidden rounded-xl border border-white/10 bg-neutral-900/50 p-4 backdrop-blur-sm">
    <div className="relative h-full w-full">
      {/* Garis linimasa */}
      <div className="absolute left-4 top-0 h-full w-0.5 bg-primary/20"></div>
      
      {/* Item-item di linimasa */}
      <div className="space-y-6">
        <div className="relative flex items-center gap-4">
          <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-background"><FaImage /></div>
          <div className="flex-1 rounded-md bg-black/30 p-3 text-sm">Menambahkan <span className="font-bold text-white">15 Foto</span> dari 'Liburan Bali'.</div>
        </div>
        <div className="relative flex items-center gap-4">
          <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-background"><VscFile /></div>
          <div className="flex-1 rounded-md bg-black/30 p-3 text-sm">Menyimpan Dokumen: <span className="font-bold text-white">'Proposal_Q3.docx'</span>.</div>
        </div>
        <div className="relative flex items-center gap-4">
          <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-background"><FaTwitter /></div>
          <div className="flex-1 rounded-md bg-black/30 p-3 text-sm">Mengarsipkan <span className="font-bold text-white">5 Tweets</span>.</div>
        </div>
         <div className="relative flex items-center gap-4">
          <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-background"><FaVideo /></div>
          <div className="flex-1 rounded-md bg-black/30 p-3 text-sm">Mengunggah Video: <span className="font-bold text-white">'Family_Gathering.mp4'</span>.</div>
        </div>
      </div>
    </div>
  </div>
);

// 2. Mockup AI (Konsep Antarmuka Percakapan)
const ChatGPTMockup = () => (
    <div className="mt-8 flex h-64 flex-col rounded-xl border border-white/10 bg-neutral-900/50 p-4 backdrop-blur-sm">
      <div className="flex-1 space-y-4">
        {/* Pesan Pengguna */}
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-secondary"><VscPerson /></div>
          <div className="rounded-lg rounded-bl-none bg-neutral-800 p-3 text-sm">
            Tunjukkan semua foto dari liburanku di Bali tahun lalu.
          </div>
        </div>
        {/* Pesan AI */}
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary"><VscSparkle /></div>
          <div className="rounded-lg rounded-bl-none bg-neutral-700 p-3 text-sm">
            Tentu. Saya menemukan <span className="font-bold text-primary">128 foto</span> dan <span className="font-bold text-primary">5 video</span> yang cocok. Saya juga membuat ringkasan perjalanan singkat untuk Anda.
          </div>
        </div>
      </div>
      <div className="mt-4 h-10 w-full rounded-lg bg-black/30 placeholder:text-neutral-500"></div>
    </div>
);

// 3. Mockup Keamanan
const SecurityMockup = () => (
    <div className="mt-8 flex h-48 items-center justify-center rounded-xl border border-white/10 bg-neutral-900/50 p-4 backdrop-blur-sm">
      <div className="relative flex items-center justify-center">
        <VscShield size={48} className="z-10 text-primary" />
        <div className="absolute h-24 w-24 rounded-full border border-primary/20 animate-pulse"></div>
        <div className="absolute h-40 w-40 rounded-full border border-primary/10"></div>
      </div>
    </div>
);

// 4. Mockup Alur Pengguna (Login/Register)
const FlowMockup = () => (
    <div className="mt-8 flex h-auto flex-col items-center justify-center rounded-xl border border-white/10 bg-neutral-900/50 p-8 backdrop-blur-sm">
      <h3 className="font-monument text-xl text-white">Sign In to CloudNest</h3>
      <div className="mt-6 w-full max-w-xs space-y-4">
        <div className="h-10 w-full rounded-md bg-black/30 placeholder-text-neutral-500 flex items-center px-3 text-sm text-neutral-500">Email</div>
        <div className="h-10 w-full rounded-md bg-black/30 placeholder-text-neutral-500 flex items-center px-3 text-sm text-neutral-500">Password</div>
        <div className="h-12 w-full rounded-md bg-primary text-background font-bold flex items-center justify-center">Sign In</div>
      </div>
      <p className="mt-4 text-xs text-primary/70">Forgot Password?</p>
    </div>
);

// --- KOMPONEN UTAMA HALAMAN ---
export const AboutProjectPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <h1 className="font-monument text-4xl uppercase text-primary md:text-5xl">Tentang CloudNest</h1>
        <p className="mt-4 font-satoshi text-xl leading-relaxed text-neutral-200">Lebih dari sekadar folder di cloud. CloudNest adalah otak kedua digital Anda.</p>
      </motion.div>

      <div className="mt-16 space-y-20">
        <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          <h2 className="font-monument text-2xl uppercase text-neutral-100">Penyimpanan Terpadu & Universal</h2>
          <div className="mt-4 font-satoshi text-lg leading-relaxed text-neutral-300">
            <p>CloudNest memecahkan masalah fragmentasi data dengan berfungsi sebagai sebuah brankas digital tunggal, menyatukan seluruh jejak digital Anda dari berbagai sumber ke satu tempat yang aman.</p>
          </div>
          <TimelineMockup />
        </motion.section>

        <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          <h2 className="font-monument text-2xl uppercase text-neutral-100">Memahami Data dengan AI</h2>
          <div className="mt-4 font-satoshi text-lg leading-relaxed text-neutral-300">
            <p>Kekuatan sejati CloudNest bukan hanya menyimpan, tetapi memahami. Platform kami ditenagai AI yang bekerja di latar belakang untuk mengubah arsip statis Anda menjadi koleksi yang hidup dan cerdas.</p>
          </div>
          <ChatGPTMockup />
        </motion.section>

        <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          <h2 className="font-monument text-2xl uppercase text-neutral-100">Keamanan sebagai Fondasi</h2>
          <div className="mt-4 font-satoshi text-lg leading-relaxed text-neutral-300">
            <p>Kami memahami data Anda bersifat pribadi. Keamanan bukanlah fitur tambahan, melainkan fondasi dari segala yang kami bangun, dengan arsitektur Tanpa-Pengetahuan (Zero-Knowledge) sebagai intinya.</p>
          </div>
          <SecurityMockup />
        </motion.section>

        {/* --- BAGIAN BARU: ALUR PENGGUNA --- */}
        <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          <h2 className="font-monument text-2xl uppercase text-neutral-100">Alur Pengguna yang Mulus</h2>
          <div className="mt-4 font-satoshi text-lg leading-relaxed text-neutral-300">
            <p>Dari registrasi hingga penggunaan sehari-hari, setiap interaksi dirancang agar intuitif dan aman. Proses otentikasi yang kuat dan antarmuka unggah yang sederhana memastikan pengalaman tanpa hambatan.</p>
          </div>
          <FlowMockup />
        </motion.section>
      </div>
    </div>
  );
};
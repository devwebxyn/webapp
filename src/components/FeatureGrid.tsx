import React from 'react';
import { FeatureCard } from './FeatureCard';
import { VscRepo, VscSync, VscSparkle, VscLock } from 'react-icons/vsc';

const featuresData = [
  {
    icon: <VscRepo />,
    title: 'Penyimpanan Terpadu',
    description: 'Satu tempat aman untuk semua file, dokumen, foto, dan video penting Anda. Akses dari mana saja.',
  },
  {
    icon: <VscSync />,
    title: 'Arsip Media Sosial',
    description: 'Hubungkan akun Anda untuk mengarsipkan postingan, foto, dan kenangan digital secara otomatis dan permanen.',
  },
  {
    icon: <VscSparkle />,
    title: 'Organisasi Cerdas AI',
    description: 'AI kami secara otomatis memberi tag pada foto, meringkas dokumen, dan membuat koleksi cerdas.',
  },
  {
    icon: <VscLock />,
    title: 'Privasi & Enkripsi',
    description: 'Dengan enkripsi end-to-end dan kebijakan tanpa-pengetahuan, data Anda hanya milik Anda seorang.',
  },
];

export const FeatureGrid: React.FC = () => {
  return (
    <div className="relative z-10 mx-auto max-w-7xl bg-background px-4 py-20 sm:px-6 lg:px-8">
      {/* --- BAGIAN JUDUL YANG DITAMBAHKAN --- */}
      <div className="mb-12 text-center">
        <h2 className="font-monument text-3xl uppercase text-neutral-100">
          Semua Fitur yang Anda Butuhkan
        </h2>
        <p className="mt-2 font-satoshi text-lg text-neutral-400">
          Dirancang untuk keamanan, kecepatan, dan kemudahan.
        </p>
      </div>
      {/* --- AKHIR BAGIAN JUDUL --- */}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {featuresData.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
};
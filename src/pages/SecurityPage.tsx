import React from 'react';
import { motion } from 'framer-motion';
import { VscShield, VscLock, VscKey, VscSearch } from 'react-icons/vsc';

const securityFeatures = [
    {
        icon: <VscShield size={24} />,
        title: 'Zero-Knowledge Architecture',
        description: 'Arsitektur kami memastikan hanya Anda yang bisa membaca data Anda. Bahkan kami sebagai penyedia layanan tidak memiliki kunci untuk membuka file Anda. Privasi Anda adalah mutlak.'
    },
    {
        icon: <VscLock size={24} />,
        title: 'Enkripsi Berlapis',
        description: 'Data dienkripsi saat transit menggunakan TLS 1.3 dan saat disimpan menggunakan standar industri AES-256. Ini melindungi data Anda dari akses tidak sah di setiap langkah.'
    },
    {
        icon: <VscKey size={24} />,
        title: 'Autentikasi Aman',
        description: 'Kami mendukung metode login modern melalui OAuth 2.0 dan integrasi dengan penyedia identitas seperti Clerk untuk memastikan proses masuk yang aman dan mudah, termasuk otentikasi multi-faktor.'
    },
    {
        icon: <VscSearch size={24} />,
        title: 'Audit dan Compliance',
        description: 'Kami melakukan proses audit internal secara berkala untuk memastikan kepatuhan terhadap standar keamanan tertinggi. Kami sedang dalam proses untuk mengadopsi sertifikasi ISO 27001 dan SOC 2.'
    }
];

export const SecurityPage: React.FC = () => {
    return (
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
            <motion.div
                className="text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="font-monument text-4xl uppercase text-neutral-100">Pusat Keamanan</h1>
                <p className="mt-4 text-lg text-neutral-300">
                    Keamanan bukan fitur tambahan — ini adalah fondasi CloudNest.
                </p>
                <div className="mt-4 inline-block rounded-full bg-primary/20 px-4 py-1 text-xs font-bold text-primary">
                    Zero-Knowledge by Design
                </div>
            </motion.div>

            {/* Grid Fitur Keamanan */}
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
                {securityFeatures.map(feature => (
                    <div key={feature.title} className="rounded-lg bg-neutral-900/50 p-6">
                        <div className="flex items-center gap-4">
                            <div className="text-primary">{feature.icon}</div>
                            <h3 className="font-monument text-lg text-neutral-100">{feature.title}</h3>
                        </div>
                        <p className="mt-4 text-sm text-neutral-400">{feature.description}</p>
                    </div>
                ))}
            </div>

             {/* Timeline Audit Dummy */}
             <div className="mt-16">
                <h3 className="text-center font-monument text-2xl uppercase text-neutral-100">Log Audit Keamanan</h3>
                <div className="relative mt-8 space-y-6 border-l-2 border-primary/20 pl-6">
                    <div className="relative">
                        <div className="absolute -left-[30px] top-1 h-4 w-4 rounded-full bg-primary"></div>
                        <p className="font-bold text-neutral-200">Audit Penetrasi Internal Q2 2025</p>
                        <p className="text-sm text-neutral-500">2 Juli 2025 - Selesai</p>
                    </div>
                     <div className="relative">
                        <div className="absolute -left-[30px] top-1 h-4 w-4 rounded-full bg-primary"></div>
                        <p className="font-bold text-neutral-200">Pembaruan Kebijakan Enkripsi</p>
                        <p className="text-sm text-neutral-500">15 Juni 2025 - Diterapkan</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
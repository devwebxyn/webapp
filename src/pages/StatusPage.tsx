import React from 'react';
import { motion } from 'framer-motion';
import { VscCheck, VscWarning } from 'react-icons/vsc';

// Data dummy untuk komponen sistem
const systemComponents = [
  { name: 'API Utama', status: 'Operational' },
  { name: 'Sistem Autentikasi', status: 'Operational' },
  { name: 'Proses Upload', status: 'Operational' },
  { name: 'Penyimpanan (Storage)', status: 'Performance Degradation' },
  { name: 'Jaringan CDN', status: 'Operational' },
];

// Data dummy untuk riwayat insiden
const incidentHistory = [
  { date: '8 Juli 2025', title: 'Investigasi Latensi API', resolved: true },
  { date: '5 Juli 2025', title: 'Gangguan Minor pada Server EU', resolved: true },
];

export const StatusPage: React.FC = () => {
  const isAllOperational = systemComponents.every(c => c.status === 'Operational');

  return (
    <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-monument text-4xl uppercase text-neutral-100">Status Sistem CloudNest</h1>
        <p className="mt-4 text-lg text-neutral-300">
          Transparansi adalah prioritas kami. Pantau status semua layanan CloudNest secara langsung.
        </p>
      </motion.div>

      {/* Kartu Status Utama */}
      <motion.div
        className={`mt-12 rounded-lg p-6 text-white ${
          isAllOperational ? 'bg-green-500/20 border-green-500/50' : 'bg-yellow-500/20 border-yellow-500/50'
        } border`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center gap-4">
          {isAllOperational ? <VscCheck size={32} /> : <VscWarning size={32} />}
          <span className="font-bold text-xl">{isAllOperational ? 'All Systems Operational' : 'Partial System Degradation'}</span>
        </div>
      </motion.div>

      {/* Daftar Komponen Sistem */}
      <div className="mt-12">
        {systemComponents.map((component) => (
          <div key={component.name} className="flex items-center justify-between border-b border-white/10 py-4">
            <span className="text-neutral-200">{component.name}</span>
            <div className={`flex items-center gap-2 text-sm ${
              component.status === 'Operational' ? 'text-green-400' : 'text-yellow-400'
            }`}>
              <div className={`h-2 w-2 rounded-full ${
                component.status === 'Operational' ? 'bg-green-400' : 'bg-yellow-400'
              }`} />
              {component.status}
            </div>
          </div>
        ))}
      </div>
      
      {/* Grafik Uptime (Dummy) */}
      <div className="mt-12">
        <h3 className="font-satoshi text-lg font-bold text-neutral-200">Uptime 30 Hari Terakhir</h3>
        <div className="mt-4 flex h-20 w-full items-end gap-px rounded-lg bg-neutral-900/50 p-2">
            {[...Array(30)].map((_, i) => (
                <div key={i} className="w-full bg-green-500" style={{ height: `${Math.floor(Math.random() * (100 - 95 + 1)) + 95}%`}} />
            ))}
        </div>
      </div>
      
      {/* Riwayat Gangguan */}
      <div className="mt-12">
        <h3 className="font-satoshi text-lg font-bold text-neutral-200">Riwayat Gangguan</h3>
        <div className="mt-4 space-y-4">
          {incidentHistory.map((incident, i) => (
            <div key={i} className="rounded-lg bg-neutral-900/50 p-4">
              <p className="font-bold text-neutral-200">{incident.title}</p>
              <p className="text-sm text-neutral-400">{incident.date} - <span className="text-green-400">Resolved</span></p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Tombol Berlangganan */}
      <div className="mt-16 text-center">
        <button className="rounded-md border border-primary/50 bg-primary/10 px-6 py-3 font-satoshi text-sm uppercase tracking-wider text-primary transition-colors hover:bg-primary/20">
          Berlangganan Notifikasi Status
        </button>
      </div>
    </div>
  );
};
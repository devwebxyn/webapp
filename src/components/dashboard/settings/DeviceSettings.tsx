// src/components/dashboard/settings/DeviceSettings.tsx
import React from 'react';
import { VscDesktopDownload, VscDeviceMobile } from 'react-icons/vsc';

const devices = [
    {
        icon: <VscDesktopDownload size={24} />,
        name: 'Chrome di Windows',
        location: 'Surabaya, Indonesia',
        last_active: 'Aktif sekarang',
        isCurrent: true,
    },
    {
        icon: <VscDeviceMobile size={24} />,
        name: 'Safari di iPhone',
        location: 'Malang, Indonesia',
        last_active: '2 jam yang lalu',
        isCurrent: false,
    }
];

export const DeviceSettings: React.FC = () => {
    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-bold text-white">Manajemen Perangkat</h3>
                <p className="text-sm text-neutral-400">Ini adalah daftar perangkat yang telah masuk ke akun Anda. Keluar dari sesi yang tidak Anda kenali.</p>
            </div>
            <div className="space-y-4">
                {devices.map((device, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg bg-white/5 p-4">
                        <div className="flex items-center gap-4">
                            {device.icon}
                            <div>
                                <p className="font-semibold text-white">{device.name} {device.isCurrent && <span className="text-xs text-green-400">(Sesi saat ini)</span>}</p>
                                <p className="text-xs text-neutral-400">{device.location} &bull; {device.last_active}</p>
                            </div>
                        </div>
                        {!device.isCurrent && (
                            <button className="text-xs text-red-400 hover:underline">
                                Keluar
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

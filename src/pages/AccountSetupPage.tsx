import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export const AccountSetupPage: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Durasi total 25 detik (25000 ms)
    const totalDuration = 25000;
    const intervalTime = totalDuration / 100; // Update setiap 1%

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          navigate('/profile-setup'); // Arahkan ke halaman setup profil
          return 100;
        }
        return prev + 1;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <div style={{ width: 150, height: 150 }}>
        <CircularProgressbar
          value={progress}
          text={`${progress}%`}
          styles={buildStyles({
            textColor: '#f5f5f5',
            pathColor: '#00FFFF',
            trailColor: 'rgba(255, 255, 255, 0.1)',
          })}
        />
      </div>
      <h1 className="mt-8 font-monument text-2xl text-white">Mempersiapkan Akun Anda</h1>
      <p className="mt-2 text-neutral-400">Harap tunggu, kami sedang menyiapkan brankas digital Anda...</p>
    </div>
  );
};
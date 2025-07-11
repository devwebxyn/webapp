// src/App.tsx

import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from './supabaseClient';
import { type Session } from '@supabase/supabase-js';

import { ProtectedRoute } from './components/ProtectedRoute';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Pages (pastikan semua diimpor dari index.ts)
import {
  HomePage,
  AboutProjectPage,
  AboutDeveloperPage,
  StatusPage,
  SecurityPage,
  LegalPage,
  TryAIPage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  EmailVerificationPage,
  UpdatePasswordPage,
  WelcomePage,
  ProfileSetupPage,
  AccountSetupPage,
  DashboardPage,
  VerifyNewEmailPage,
} from './pages';

// Import komponen spesifik untuk dashboard
import { DashboardSecurityPage } from './components/dashboard/DashboardSecurityPage'; // Import DashboardSecurityPage
import { ProfilePage } from './components/dashboard/ProfilePage'; // Import ProfilePage
import { DeviceSettings } from './components/dashboard/settings/DeviceSettings'; // Import DeviceSettings

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-black text-white font-monument">Memuat...</div>;
  }

  return (
    <div className="bg-background text-neutral-200">
      <Routes>
        {/* Grup 1: Halaman publik */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about-project" element={<AboutProjectPage />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/try-ai" element={<TryAIPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/auth/email-verification" element={<EmailVerificationPage />} />
          <Route path="/verify-email" element={<VerifyNewEmailPage />} />
          <Route path="/about-developer" element={<AboutDeveloperPage />} />
        </Route>

        {/* Grup 2: Halaman yang membutuhkan autentikasi (di dalam DashboardLayout) */}
        <Route element={<ProtectedRoute session={session}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/setup-account" element={<AccountSetupPage />} />
          <Route path="/profile-setup" element={<ProfileSetupPage />} />
          <Route path="/update-password" element={<UpdatePasswordPage />} />
          
          {/* --- Rute DASHBOARD BERSARANG yang baru ditambahkan --- */}
          {/* Perhatikan Outlet di DashboardLayout.tsx akan merender komponen-komponen ini */}
          <Route path="/dashboard/profile" element={<ProfilePage />} />
          <Route path="/dashboard/security" element={<DashboardSecurityPage />} /> {/* Menautkan ke DashboardSecurityPage */}
          <Route path="/dashboard/devices" element={<DeviceSettings />} />
          {/* --- AKHIR Rute DASHBOARD BERSARANG --- */}
        </Route>
      </Routes>

      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
}

export default App;
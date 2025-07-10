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

// Pages
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
  VerifyNewEmailPage, // <-- halaman baru untuk verifikasi email tambahan
} from './pages';

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
          
          {/* Rute tambahan untuk verifikasi email baru */}
          <Route path="/verify-email" element={<VerifyNewEmailPage />} />
        </Route>

        {/* Grup 2: Halaman yang membutuhkan autentikasi */}
        <Route element={<ProtectedRoute session={session}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/about-developer" element={<AboutDeveloperPage />} />
          <Route path="/setup-account" element={<AccountSetupPage />} />
          <Route path="/profile-setup" element={<ProfileSetupPage />} />
          <Route path="/update-password" element={<UpdatePasswordPage />} />
        </Route>
      </Routes>

      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
}

export default App;

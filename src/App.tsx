import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutProjectPage } from './pages/AboutProjectPage';
import { AboutDeveloperPage } from './pages/AboutDeveloperPage';
import { ProtectedRoute } from './components/ProtectedRoute';

// Impor halaman-halaman baru
import { StatusPage } from './pages/StatusPage';
import { SecurityPage } from './pages/SecurityPage';
import { LegalPage } from './pages/LegalPage';
import { TryAIPage } from './pages/TryAIPage'; // <-- Impor halaman AI baru
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';


function App() {
  return (
    <div className="bg-background text-neutral-200">
      <Header />
      
      <main>
        <Routes>
          {/* Rute yang sudah ada */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about-project" element={<AboutProjectPage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/try-ai" element={<TryAIPage />} />

          {/* --- RUTE BARU UNTUK LOGIN & REGISTER --- */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* --- RUTE BARU UNTUK HALAMAN AI --- */}
          <Route path="/try-ai" element={<TryAIPage />} />
          <Route 
            path="/about-developer" 
            element={
              <ProtectedRoute>
                <AboutDeveloperPage />
              </ProtectedRoute>
            } 
          />
          
          {/* --- RUTE-RUTE BARU DARI FOOTER --- */}
          <Route path="/status" element={<StatusPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/legal" element={<LegalPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
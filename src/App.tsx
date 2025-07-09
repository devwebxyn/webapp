import { motion } from 'framer-motion';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FeatureGrid } from './components/FeatureGrid';
import { LogoCloud } from './components/LogoCloud'; // <-- Impor LogoCloud
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeatureGrid />
        <LogoCloud /> {/* <-- Tambahkan LogoCloud di sini */}
        <motion.div 
          className="relative z-10 mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8"
          // ... sisa kode CTA tetap sama
        >
          {/* ... Konten CTA ... */}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Flowchart } from './Flowchart';

export const Nest3DCanvas: React.FC = () => {
  return (
    // Kita tidak perlu lagi properti kamera atau Bounds
    <Canvas>
      {/* Latar & Pencahayaan */}
      <color attach="background" args={['#0A0A0A']} />
      <fog attach="fog" args={['#0A0A0A', 10, 25]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />

      {/* Komponen Flowchart akan mengontrol kamera sekarang */}
      <Flowchart />
      
      {/* OrbitControls dan Bounds dihapus untuk pengalaman otomatis */}

      {/* Efek Post-Processing */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.3}
          luminanceSmoothing={0.9}
          height={400}
          intensity={1.2}
        />
      </EffectComposer>
    </Canvas>
  );
};
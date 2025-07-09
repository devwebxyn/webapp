import React from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { NeuralNetwork } from './NeuralNetwork';

export const Scene: React.FC = () => {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
      {/* Latar & Pencahayaan */}
      <color attach="background" args={['#05050a']} />
      <fog attach="fog" args={['#05050a', 10, 20]} />
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />

      {/* Komponen NeuralNetwork sekarang aman di dalam Canvas */}
      <NeuralNetwork />

      {/* Efek Post-Processing */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0}
          luminanceSmoothing={0.9}
          height={300}
          intensity={0.6}
        />
      </EffectComposer>
    </Canvas>
  );
};
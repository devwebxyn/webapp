import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const NebulaParticles: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null!);

  const particles = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorPrimary = new THREE.Color('#00FFFF'); // Cyan
    const colorSecondary = new THREE.Color('#4C2882'); // Ungu

    for (let i = 0; i < count; i++) {
      // Variabel 't' yang tidak digunakan telah dihapus dari sini
      const r = 3 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const mixedColor = colorPrimary.clone().lerp(colorSecondary, Math.random());
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }
    return { positions, colors };
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
      pointsRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        {/* --- PERBAIKAN DI SINI --- */}
        {/* 'array' dan 'itemSize' digabung ke dalam prop 'args' */}
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particles.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        vertexColors
        transparent
        opacity={0.8}
        depthWrite={false}
      />
    </points>
  );
};

export const NebulaBackground: React.FC = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
      <NebulaParticles />
    </Canvas>
  );
};
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Points, PointMaterial } from '@react-three/drei';

const NODE_COUNT = 20;
const PARTICLE_COUNT = 5000;

export const NeuralNetwork: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null!);
  const nodesRef = useRef<THREE.InstancedMesh>(null!);

  const nodes = useMemo(() => {
    const temp = [];
    const sphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 4.5);
    for (let i = 0; i < NODE_COUNT; i++) {
      const point = new THREE.Vector3();
      point.set(
        THREE.MathUtils.randFloatSpread(10),
        THREE.MathUtils.randFloatSpread(10),
        THREE.MathUtils.randFloatSpread(10)
      );
      if (sphere.containsPoint(point)) {
        temp.push(point);
      } else {
        i--;
      }
    }
    temp.unshift(new THREE.Vector3(0, 0, 0));
    return temp;
  }, []);

  const particles = useMemo(() => {
    const temp = new Float32Array(PARTICLE_COUNT * 3);
    const missions = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const startNode = THREE.MathUtils.randInt(0, nodes.length - 1);
      const endNode = THREE.MathUtils.randInt(0, nodes.length - 1);
      const startVec = nodes[startNode];
      
      temp[i * 3 + 0] = startVec.x;
      temp[i * 3 + 1] = startVec.y;
      temp[i * 3 + 2] = startVec.z;

      missions.push({
        startNode,
        endNode,
        progress: Math.random(),
        speed: THREE.MathUtils.randFloat(0.005, 0.015),
      });
    }
    return { positions: temp, missions };
  }, [nodes]);

  useFrame(() => {
    if (pointsRef.current && pointsRef.current.geometry.attributes.position) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const mission = particles.missions[i];
        mission.progress += mission.speed;
        if (mission.progress >= 1) {
          mission.progress = 0;
          mission.startNode = mission.endNode;
          mission.endNode = THREE.MathUtils.randInt(0, nodes.length - 1);
        }
        const startVec = nodes[mission.startNode];
        const endVec = nodes[mission.endNode];
        const currentPos = new THREE.Vector3().lerpVectors(startVec, endVec, mission.progress);
        positions[i * 3 + 0] = currentPos.x;
        positions[i * 3 + 1] = currentPos.y;
        positions[i * 3 + 2] = currentPos.z;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
    if(nodesRef.current){
        nodesRef.current.rotation.y += 0.0005;
        nodesRef.current.rotation.x += 0.0002;
    }
  });

  return (
    <group>
      <instancedMesh ref={nodesRef} args={[undefined, undefined, nodes.length]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#00FFFF" transparent opacity={0.8} />
      </instancedMesh>
      <Points ref={pointsRef} positions={particles.positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#F5F5F5"
          size={0.015}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};
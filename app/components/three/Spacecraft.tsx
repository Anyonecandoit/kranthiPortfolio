"use client";

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type SpacecraftProps = {
  position?: [number, number, number];
};

export function Spacecraft({ position = [0, 0, 0] }: SpacecraftProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const arrival = Math.min(t, 5);
    groupRef.current.position.y = 6 - arrival * 1.4;
    groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.05;
    groupRef.current.rotation.z = Math.cos(t * 0.3) * 0.05;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Hull */}
      <mesh rotation={[0, 0, 0]}>
        <coneGeometry args={[0.6, 2, 4]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Cockpit */}
      <mesh position={[0, 0.2, 0.3]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial
          color="#7dd3fc"
          emissive="#0ea5e9"
          emissiveIntensity={0.5}
          metalness={0.2}
        />
      </mesh>

      {/* Engines */}
      <mesh position={[-0.25, -0.2, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.4, 8]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#f97316"
          emissiveIntensity={1.2}
        />
      </mesh>
      <mesh position={[0.25, -0.2, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.4, 8]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#f97316"
          emissiveIntensity={1.2}
        />
      </mesh>
    </group>
  );
}

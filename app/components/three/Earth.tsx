"use client";

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type EarthProps = {
  position?: [number, number, number];
  scale?: number;
};

export function Earth({ position = [0, 0, 0], scale = 1 }: EarthProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.1;
  });

  return (
    <group position={position} scale={scale}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#1d4ed8"
          emissive="#0b3d91"
          emissiveIntensity={0.3}
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.01, 64, 64]} />
        <meshBasicMaterial
          color="#60a5fa"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

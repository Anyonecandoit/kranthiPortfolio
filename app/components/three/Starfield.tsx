"use client";

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const STAR_COUNT = 3000;

export function Starfield() {
  const positions = useMemo(() => {
    const arr = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 100;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 100;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return arr;
  }, []);

  const colors = useMemo(() => {
    const arr = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      const color = new THREE.Color().setHSL(0.6 + Math.random() * 0.2, 0.8, 0.7);
      arr[i * 3] = color.r;
      arr[i * 3 + 1] = color.g;
      arr[i * 3 + 2] = color.b;
    }
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.005;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        sizeAttenuation
        transparent
        opacity={0.8}
        depthWrite={false}
      />
    </points>
  );
}

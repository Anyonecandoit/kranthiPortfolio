"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense } from 'react';
import * as THREE from 'three';
import { Earth } from './Earth';
import { Spacecraft } from './Spacecraft';
import { Starfield } from './Starfield';

function CameraRig() {
  useFrame(({ camera, clock }) => {
    const t = clock.elapsedTime;
    camera.position.x = Math.sin(t * 0.1) * 0.6;
    camera.position.y = 0.2 + Math.sin(t * 0.05) * 0.5;
    camera.position.z = 8 + Math.sin(t * 0.15) * 0.4;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function SpaceScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 60 }}
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#050510']} />
      <fog attach="fog" args={['#050510', 12, 35]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-5, 3, 2]} intensity={2} color="#00aaff" />
      <Suspense fallback={null}>
        <Starfield />
        <Earth position={[-4, 0, -2]} scale={1} />
        <Spacecraft />
        <CameraRig />
      </Suspense>
    </Canvas>
  );
}

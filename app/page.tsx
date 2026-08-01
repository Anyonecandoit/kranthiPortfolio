"use client";

import dynamic from 'next/dynamic';
import HeroIntroOverlay from './components/HeroIntroOverlay';

const SpaceScene = dynamic(() => import('./components/three/SpaceScene'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-black text-white">
      <span className="animate-pulse">Loading Command Center...</span>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black">
      <HeroIntroOverlay />
      <div className="absolute inset-0">
        <SpaceScene />
      </div>
    </main>
  );
}

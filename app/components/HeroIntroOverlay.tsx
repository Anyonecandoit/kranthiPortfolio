"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function HeroIntroOverlay() {
  const [phase, setPhase] = useState<0 | 1>(0);

  useEffect(() => {
    const timer = setTimeout(() => setPhase(1), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6">
      <AnimatePresence mode="wait">
        {phase === 0 ? (
          <motion.div
            key="mission"
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            animate={{ opacity: 1, letterSpacing: '0.2em' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="bg-gradient-to-r from-purple-400 via-blue-300 to-orange-300 bg-clip-text text-4xl font-black text-transparent md:text-6xl">
              MISSION READY
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-4 text-lg text-white/60"
            >
              Incoming Transmission...
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="transmission"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-center"
          >
            <p className="text-xl text-white/70">Hello Recruiter.</p>
            <h2 className="gradient-text mt-2 text-3xl font-bold md:text-5xl">
              I am Kranthi Kumar Katta
            </h2>
            <p className="mx-auto mt-4 text-gray-300 md:text-lg">
              Welcome to my command center. I build scalable automation frameworks,
              AI-powered applications, and love solving difficult engineering problems.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import React from 'react';
import { motion } from 'framer-motion';

type LoadingSpinnerProps = {
  size?: number;
  color?: string;
  className?: string;
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  color = '#0A84FF',
  className = ''
}) => {
  return (
    <motion.div
      className={`flex items-center justify-center ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      style={{ width: size, height: size }}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="31.4159 31.4159"
          opacity={0.25}
        />
        <motion.circle
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="31.4159 31.4159"
          initial={{ strokeDashoffset: 31.4159 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </svg>
    </motion.div>
  );
};
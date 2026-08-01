"use client";

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

type ScaleInProps = {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
} & HTMLMotionProps<'div'>;

export const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  delay = 0,
  duration = 0.2,
  className = '',
  ...props
}) => {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
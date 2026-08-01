"use client";

import React, { useEffect, useState } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

type FadeInProps = {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
} & HTMLMotionProps<'div'>;

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 0.2,
  className = '',
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
import React, { JSX } from 'react';
import { motion } from 'framer-motion';

type HeadingProps = {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs';
  color?: 'primary' | 'secondary' | 'accent' | 'light' | 'dark' | 'gradient';
  animate?: boolean;
};

export const Heading: React.FC<HeadingProps> = ({
  children,
  level = 1,
  className = '',
  size = 'xl',
  color = 'primary',
  animate = false,
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  const sizeClasses = {
    xl: 'text-4xl md:text-5xl lg:text-6xl',
    lg: 'text-3xl md:text-4xl lg:text-5xl',
    md: 'text-2xl md:text-3xl lg:text-4xl',
    sm: 'text-xl md:text-2xl lg:text-3xl',
    xs: 'text-lg md:text-xl lg:text-2xl',
  };
  
  const colorClasses = {
    primary: 'text-white',
    secondary: 'text-gray-300',
    accent: 'text-purple-400',
    light: 'text-white',
    dark: 'text-gray-900 dark:text-white',
    gradient: 'bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent',
  };

  return (
    <Tag
      className={`${sizeClasses[size]} ${colorClasses[color]} font-bold ${className}`}
    >
      {children}
    </Tag>
  );
};
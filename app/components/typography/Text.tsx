import React from 'react';
import { motion } from 'framer-motion';

type TextProps = {
  children: React.ReactNode;
  className?: string;
  size?: 'lg' | 'md' | 'sm' | 'xs';
  color?: 'primary' | 'secondary' | 'accent' | 'light' | 'dark' | 'gradient';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  as?: 'p' | 'span' | 'div' | 'strong' | 'em';
  animate?: boolean;
} & React.HTMLAttributes<HTMLElement>;

export const Text: React.FC<TextProps> = ({
  children,
  className = '',
  size = 'md',
  color = 'primary',
  weight = 'normal',
  as: Tag = 'p',
  animate = false,
}) => {
  const sizeClasses = {
    lg: 'text-2xl md:text-3xl lg:text-4xl',
    md: 'text-lg md:text-xl lg:text-2xl',
    sm: 'text-base md:text-lg',
    xs: 'text-sm md:text-base',
  };
  
  const colorClasses = {
    primary: 'text-gray-100',
    secondary: 'text-gray-300',
    accent: 'text-purple-400',
    light: 'text-white',
    dark: 'text-gray-900 dark:text-gray-100',
    gradient: 'bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent',
  };
  
  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  return (
    <Tag
      className={`${sizeClasses[size]} ${colorClasses[color]} ${weightClasses[weight]} ${className}`}
    >
      {children}
    </Tag>
  );
};
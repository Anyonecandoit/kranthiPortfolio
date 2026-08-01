import React from 'react';

type TextProps = {
  children: React.ReactNode;
  className?: string;
  size?: 'lg' | 'md' | 'sm' | 'xs';
  color?: 'primary' | 'secondary' | 'accent' | 'light' | 'dark';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  as?: 'p' | 'span' | 'div' | 'strong' | 'em';
} & React.HTMLAttributes<HTMLElement>;

export const Text: React.FC<TextProps> = ({
  children,
  className = '',
  size = 'md',
  color = 'primary',
  weight = 'normal',
  as: Tag = 'p',
}) => {
  const sizeClasses = {
    lg: 'text-body-lg',
    md: 'text-body-md',
    sm: 'text-sm',
    xs: 'text-xs',
  };
  
  const colorClasses = {
    primary: 'text-text-primary-light dark:text-text-primary-dark',
    secondary: 'text-text-secondary-light dark:text-text-secondary-dark',
    accent: 'text-accent-500',
    light: 'text-white',
    dark: 'text-black',
  };
  
  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  return (
    <Tag className={`${sizeClasses[size]} ${colorClasses[color]} ${weightClasses[weight]} ${className}`}>
      {children}
    </Tag>
  );
};
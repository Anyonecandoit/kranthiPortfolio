import React, { JSX } from 'react';

type HeadingProps = {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs';
  color?: 'primary' | 'secondary' | 'accent' | 'light' | 'dark';
};

export const Heading: React.FC<HeadingProps> = ({
  children,
  level = 1,
  className = '',
  size = 'xl',
  color = 'primary',
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  const sizeClasses = {
    xl: 'text-heading-xl',
    lg: 'text-heading-lg',
    md: 'text-heading-md',
    sm: 'text-body-lg',
    xs: 'text-body-md',
  };
  
  const colorClasses = {
    primary: 'text-text-primary-light dark:text-text-primary-dark',
    secondary: 'text-text-secondary-light dark:text-text-secondary-dark',
    accent: 'text-accent-500',
    light: 'text-white',
    dark: 'text-black',
  };

  return (
    <Tag className={`${sizeClasses[size]} ${colorClasses[color]} font-semibold ${className}`}>
      {children}
    </Tag>
  );
};
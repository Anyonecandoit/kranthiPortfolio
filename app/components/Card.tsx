import React from 'react';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  elevation?: 'sm' | 'md' | 'lg';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
};

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  elevation = 'md',
  rounded = 'lg',
}) => {
  // Elevation classes
  const elevationClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };
  
  // Rounded classes
  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
  };
  
  return (
    <div className={`bg-surface-light dark:bg-surface-dark ${elevationClasses[elevation]} ${roundedClasses[rounded]} p-6 ${className}`}>
      {children}
    </div>
  );
};
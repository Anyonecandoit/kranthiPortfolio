import React from 'react';

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  padding?: 'sm' | 'md' | 'lg' | 'none';
};

export const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  id = '',
  padding = 'lg',
}) => {
  const paddingClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    none: 'py-0',
  };

  return (
    <section
      id={id}
      className={`${paddingClasses[padding]} ${className}`}
    >
      {children}
    </section>
  );
};
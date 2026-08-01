import React from 'react';

type CodeProps = {
  children: React.ReactNode;
  className?: string;
  size?: 'lg' | 'md' | 'sm';
  language?: string;
  inline?: boolean;
};

export const Code: React.FC<CodeProps> = ({
  children,
  className = '',
  size = 'md',
  language = '',
  inline = false,
}) => {
  const sizeClasses = {
    lg: 'text-lg',
    md: 'text-code',
    sm: 'text-sm',
  };

  if (inline) {
    return (
      <code className={`${sizeClasses[size]} font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded-sm ${className}`}>
        {children}
      </code>
    );
  }

  return (
    <pre className={`${sizeClasses[size]} font-mono bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto ${className}`}>
      {language && <div className="text-xs text-gray-500 mb-2">{language}</div>}
      <code>{children}</code>
    </pre>
  );
};
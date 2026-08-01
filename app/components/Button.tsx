import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'glass' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  disabled = false,
  type = 'button',
}) => {
  const baseClasses = 'relative inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 overflow-hidden group';

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg hover:shadow-primary-500/40',
    secondary: 'bg-white/10 border border-white/20 text-white backdrop-blur-xl hover:bg-white/20 hover:border-white/40',
    outline: 'border-2 border-primary-400 text-primary-300 hover:bg-primary-500/10 hover:border-primary-300',
    glass: 'glass text-white hover:shadow-glow-primary',
    gradient: 'animated-gradient-bg text-white shadow-lg hover:shadow-accent-500/40',
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className} rounded-full`}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
};

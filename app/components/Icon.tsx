import React, { JSX } from 'react';
import Image from 'next/image';

type IconProps = {
  name?: string;
  src?: string;
  alt?: string;
  className?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  ariaHidden?: boolean;
};

export const Icon: React.FC<IconProps> = ({
  name,
  src,
  alt = '',
  className = '',
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  ariaHidden = true,
}) => {
  // SVG Icon implementation
  if (name) {
    // Icon paths for common icons
    const iconPaths: Record<string, JSX.Element> = {
      // Social icons
      github: (
        <path
          d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ),
      linkedin: (
        <>
          <path
            d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="9" r="1" fill={color} />
          <path
            d="M8 17v-5a4 4 0 0 1 4-4h4"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ),
      twitter: (
        <path
          d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5.8c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ),
      // UI icons
      menu: (
        <path
          d="M4 6h16M4 12h16M4 18h16"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ),
      close: (
        <path
          d="M6 18L18 6M6 6l12 12"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ),
      chevronDown: (
        <path
          d="M6 9l6 6 6-6"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ),
      chevronUp: (
        <path
          d="M18 15l-6-6-6 6"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ),
      chevronLeft: (
        <path
          d="M15 18l-6-6 6-6"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ),
      chevronRight: (
        <path
          d="M9 18l6-6-6-6"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ),
    };

    return (
      <svg
        className={`w-${size} h-${size} ${className}`}
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden={ariaHidden}
      >
        {iconPaths[name] || null}
      </svg>
    );
  }
  
  // Image Icon implementation
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={`dark:invert ${className}`}
      />
    );
  }
  
  return null;
};
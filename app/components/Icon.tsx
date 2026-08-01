import React from 'react';
import Image from 'next/image';

type IconProps = {
  src: string;
  alt: string;
  className?: string;
};

export const Icon: React.FC<IconProps> = ({ src, alt, className = '' }) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={24}
      height={24}
      className={`dark:invert ${className}`}
    />
  );
};
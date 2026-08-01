"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../components/Icon';

interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

type SocialLinksProps = {
  links: SocialLink[];
  className?: string;
};

export const SocialLinks: React.FC<SocialLinksProps> = ({ links, className = '' }) => {
  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {links.map((link, index) => (
        <motion.a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
          aria-label={`Visit my ${link.name} profile`}
        >
          <Icon name={link.icon} size={20} className="text-text-primary-light dark:text-text-primary-dark" />
        </motion.a>
      ))}
    </div>
  );
};
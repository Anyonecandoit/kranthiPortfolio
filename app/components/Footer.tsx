import React from 'react';
import { Icon } from './Icon';

const socialLinks = [
  { 
    name: 'GitHub', 
    href: 'https://github.com', 
    icon: '/github.svg' // Will need to add this icon
  },
  { 
    name: 'LinkedIn', 
    href: 'https://linkedin.com', 
    icon: '/linkedin.svg' // Will need to add this icon
  },
  { 
    name: 'Twitter', 
    href: 'https://twitter.com', 
    icon: '/twitter.svg' // Will need to add this icon
  },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-light dark:bg-surface-dark py-8 border-t border-border-light dark:border-border-dark">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              © {new Date().getFullYear()} Kranthi Kumar Katta. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-fast"
                aria-label={link.name}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
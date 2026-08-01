"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from './Button';
import { Icon } from './Icon';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/experience', label: 'Experience' },
  { href: '/skills', label: 'Skills' },
  { href: '/portfolio', label: 'Projects' },
  { href: '/contact', label: 'Contact' },
];

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMobileMenuOpen]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-sm shadow-lg' : 'bg-surface-light/80 dark:bg-surface-dark/80'}`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-heading-md font-semibold text-text-primary-light dark:text-text-primary-dark transition-colors duration-normal"
        >
          Kranthi Kumar Katta
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label={link.label}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        {/* Mobile Menu Button */}
        <Button
          variant="primary"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <Icon name={isMobileMenuOpen ? 'close' : 'menu'} size={20} />
        </Button>
      </div>
      
      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-gray-700"
          >
            <div className="px-4 py-4 space-y-4" role="menu">
              {navLinks.map((link) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: navLinks.indexOf(link) * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="block py-2 text-lg text-text-primary-light dark:text-text-primary-dark hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                    role="menuitem"
                    aria-label={link.label}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
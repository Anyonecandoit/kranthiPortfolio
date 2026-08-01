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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-xl shadow-2xl border-b border-gray-800' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold text-white hover:text-purple-400 transition-all duration-300 flex items-center gap-2"
        >
          <span className="bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">KK</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-1" aria-label="Main navigation">
          {navLinks.map((link) => (
            <motion.div key={link.href} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href={link.href}
                className="px-4 py-2 text-gray-300 hover:text-white hover:bg-purple-500/10 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 relative group"
                aria-label={link.label}
              >
                <span className="relative">{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300 group-hover:w-full" />
              </Link>
            </motion.div>
          ))}
        </nav>
        
        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden p-2 rounded-full bg-gray-800/50 border border-gray-700 hover:bg-purple-500/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Icon name={isMobileMenuOpen ? 'close' : 'menu'} size={24} className="text-white" />
        </motion.button>
      </div>
      
      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-black/90 backdrop-blur-xl border-t border-gray-800"
          >
            <div className="px-6 py-4 space-y-2" role="menu">
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
                    className="block py-3 px-4 text-lg text-gray-300 hover:text-white hover:bg-purple-500/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-lg"
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
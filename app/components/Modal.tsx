"use client";

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from './Icon';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
};

export const Modal: React.FC<ModalProps> = ({ 
  isOpen,
  onClose,
  children,
  title,
  className = ''
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className={`bg-surface-light dark:bg-surface-dark rounded-lg shadow-xl overflow-hidden w-full max-w-2xl mx-4 ${className}`}
            onClick={(e) => e.stopPropagation()}
            ref={modalRef}
            role="document"
            aria-labelledby={title ? 'modal-title' : undefined}
          >
            {(title || onClose !== undefined) && (
              <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                {title && (
                  <h3 id="modal-title" className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
                    {title}
                  </h3>
                )}
                {onClose && (
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    aria-label="Close modal"
                  >
                    <Icon name="close" size={24} />
                  </button>
                )}
              </div>
            )}
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Text } from '../components/typography/Text';
import { Button } from '../components/Button';
import { Toast } from '../components/Toast';

interface FormData {
  name: string;
  email: string;
  message: string;
}

type ContactFormProps = {
  className?: string;
};

export const ContactForm: React.FC<ContactFormProps> = ({ className = '' }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const onSubmit = async (data: FormData) => {
    try {
      // Call the API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setToastMessage('Message sent successfully! I will get back to you soon.');
        setToastType('success');
        reset();
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
    } catch (error) {
      setToastMessage('Failed to send message. Please try again later.');
      setToastType('error');
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" aria-labelledby="contact-form-heading" noValidate>
        <h2 id="contact-form-heading" className="sr-only">Contact Form</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name *
            </label>
            <input
              id="name"
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Your name"
              aria-required="true"
              aria-invalid={errors.name ? 'true' : 'false'}
              aria-describedby={errors.name ? 'name-error' : undefined}
              autoComplete="name"
            />
            {errors.name && (
              <Text size="sm" className="text-red-500 mt-1" role="alert">
                {errors.name.message}
              </Text>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email *
            </label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="your@email.com"
              aria-required="true"
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
              autoComplete="email"
            />
            {errors.email && (
              <Text size="sm" className="text-red-500 mt-1" role="alert">
                {errors.email.message}
              </Text>
            )}
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Message *
            </label>
            <textarea
              id="message"
              rows={5}
              {...register('message', { required: 'Message is required' })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Your message..."
              aria-required="true"
              aria-invalid={errors.message ? 'true' : 'false'}
              aria-describedby={errors.message ? 'message-error' : undefined}
            />
            {errors.message && (
              <Text size="sm" className="text-red-500 mt-1" role="alert">
                {errors.message.message}
              </Text>
            )}
          </div>
        </div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="w-full"
            aria-disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </motion.div>
      </form>

      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onDismiss={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};
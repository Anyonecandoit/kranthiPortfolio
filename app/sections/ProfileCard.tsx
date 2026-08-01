"use client";

import React from 'react';
import Image from 'next/image';
import { Card } from '../components/Card';
import { Text } from '../components/typography/Text';
import { Heading } from '../components/typography/Heading';
import { motion } from 'framer-motion';

interface QuickFact {
  label: string;
  value: string;
}

type ProfileCardProps = {
  name: string;
  title: string;
  imageSrc: string;
  quickFacts: QuickFact[];
  className?: string;
};

export const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  title,
  imageSrc,
  quickFacts,
  className = ''
}) => {
  return (
    <Card className={`flex flex-col md:flex-row items-center ${className}`}>
      <div className="md:w-1/3 mb-6 md:mb-0 md:mr-6">
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="relative w-48 h-48 rounded-full overflow-hidden mx-auto glass"
        >
          <Image
            src={imageSrc}
            alt={`Portrait of ${name}`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 12rem, 12rem"
            quality={85}
          />
        </motion.div>
      </div>
      <div className="md:w-2/3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Heading level={2} className="mb-2 gradient-text">
            {name}
          </Heading>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Text size="lg" className="text-accent-500 mb-6">
            {title}
          </Text>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickFacts.map((fact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className="p-4 glass rounded-xl hover:shadow-glow transition-all duration-normal"
            >
              <Text size="sm" className="text-text-secondary mb-1">
                {fact.label}
              </Text>
              <Text size="md" className="font-medium">
                {fact.value}
              </Text>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
};
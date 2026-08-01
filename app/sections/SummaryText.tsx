"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Text } from '../components/typography/Text';
import { Heading } from '../components/typography/Heading';

interface SummarySection {
  title: string;
  content: string;
}

type SummaryTextProps = {
  sections: SummarySection[];
  className?: string;
};

export const SummaryText: React.FC<SummaryTextProps> = ({
  sections,
  className = ''
}) => {
  return (
    <div className={`space-y-12 ${className}`}>
      {sections.map((section, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="glass p-6 rounded-xl"
        >
          <Heading level={3} className="mb-4 gradient-text">
            {section.title}
          </Heading>
          <Text size="md" className="whitespace-pre-line text-text-secondary">
            {section.content}
          </Text>
        </motion.div>
      ))}
    </div>
  );
};
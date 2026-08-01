"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/Card';
import { Text } from '../components/typography/Text';
import { Icon } from '../components/Icon';

interface SkillBadgeProps {
  name: string;
  proficiency: number;
  icon: string;
  delay?: number;
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({
  name,
  proficiency,
  icon,
  delay = 0
}) => {
  return (
    <Card className="p-4 flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: delay + 0.2, duration: 0.3 }}
        className="mb-3"
      >
        <Icon name={icon} size={40} className="text-primary-500" />
      </motion.div>
      
      <Text size="md" className="font-medium mb-2">
        {name}
      </Text>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${proficiency}%` }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.4, duration: 1, ease: 'easeOut' }}
          className="bg-primary-500 h-2.5 rounded-full"
          style={{ width: `${proficiency}%` }}
        />
      </div>
      
      <Text size="sm" className="text-text-secondary-light dark:text-text-secondary-dark">
        {proficiency}% proficiency
      </Text>
    </Card>
  );
};
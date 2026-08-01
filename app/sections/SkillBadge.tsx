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

export const SkillBadge: React.FC<SkillBadgeProps> = ({ name, proficiency, icon, delay = 0 }) => {
  return (
    <Card className="p-5 flex flex-col items-center text-center hover:shadow-glow-primary transition-all hover-tilt">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: delay + 0.2, duration: 0.3 }}
        className="mb-3 bg-white/10 rounded-full p-3"
      >
        <Icon name={icon} size={36} className="text-primary-400" />
      </motion.div>

      <Text size="md" className="font-medium mb-2">{name}</Text>

      <div className="w-full bg-white/10 rounded-full h-2.5 mb-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${proficiency}%` }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.4, duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #a78bfa, #22d3ee)' }}
        />
      </div>

      <Text size="sm" className="text-text-secondary">{proficiency}% proficiency</Text>
    </Card>
  );
};

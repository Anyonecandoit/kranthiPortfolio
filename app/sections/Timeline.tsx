"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/Card';
import { Heading } from '../components/typography/Heading';
import { Text } from '../components/typography/Text';
import { Button } from '../components/Button';

interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
  location: string;
}

type TimelineProps = {
  experiences: ExperienceItem[];
  className?: string;
};

export const Timeline: React.FC<TimelineProps> = ({ experiences, className = '' }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {experiences.map((experience, index) => (
        <motion.div
          key={experience.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="relative"
        >
          {/* Timeline line */}
          <div className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-accent-500 to-secondary-500" />

          <div className="flex flex-col md:flex-row">
            <div className="hidden md:block relative z-10">
              <motion.div
                className="w-4 h-4 rounded-full bg-primary-500 absolute left-6 top-8"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </div>

            <Card className="w-full md:w-11/12 md:ml-12 hover-tilt">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div className="mb-4 md:mb-0">
                  <Heading level={3} className="mb-1">{experience.role}</Heading>
                  <Text size="lg" className="text-primary-500">{experience.company}</Text>
                  <Text size="sm" className="text-text-secondary-light dark:text-text-secondary-dark">
                    {experience.location} | {experience.startDate} - {experience.endDate}
                  </Text>
                </div>
                <Button variant="secondary" onClick={() => toggleExpand(experience.id)} className="shrink-0">
                  {expandedId === experience.id ? 'Show Less' : 'Show More'}
                </Button>
              </div>

              <Text size="md" className="mb-4">{experience.description}</Text>

              {expandedId === experience.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-3">
                    <Heading level={4} className="mt-4 mb-2">Key Achievements</Heading>
                    <ul className="list-disc list-inside space-y-2">
                      {experience.achievements.map((achievement, idx) => (
                        <li key={idx}>
                          <Text size="md">{achievement}</Text>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </Card>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

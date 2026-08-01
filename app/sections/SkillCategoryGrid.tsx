"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heading } from '../components/typography/Heading';
import { SkillBadge } from './SkillBadge';

interface Skill {
  name: string;
  proficiency: number;
  icon: string;
}

interface SkillCategory {
  title: string;
  skills: Skill[];
}

type SkillCategoryGridProps = {
  categories: SkillCategory[];
  className?: string;
};

export const SkillCategoryGrid: React.FC<SkillCategoryGridProps> = ({
  categories,
  className = ''
}) => {
  return (
    <div className={`space-y-16 ${className}`}>
      {categories.map((category, categoryIndex) => (
        <motion.div
          key={category.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: categoryIndex * 0.1 }}
        >
          <Heading level={2} className="mb-8">
            {category.title}
          </Heading>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {category.skills.map((skill, skillIndex) => (
              <SkillBadge
                key={skill.name}
                name={skill.name}
                proficiency={skill.proficiency}
                icon={skill.icon}
                delay={skillIndex * 0.05}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
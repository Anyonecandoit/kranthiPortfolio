"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ProjectCard } from './ProjectCard';

interface Project {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
}

type ProjectGridProps = {
  projects: Project[];
  className?: string;
};

export const ProjectGrid: React.FC<ProjectGridProps> = ({
  projects,
  className = ''
}) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </div>
  );
};
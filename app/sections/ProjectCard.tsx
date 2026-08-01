"use client";

import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Heading } from '../components/typography/Heading';
import { Text } from '../components/typography/Text';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { Modal } from '../components/Modal';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Project {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
}

type ProjectCardProps = { project: Project };

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div whileHover={{ y: -8 }} className="h-full">
        <Card className="h-full flex flex-col overflow-hidden group hover:border-primary-500/50 hover:shadow-glow-primary transition-all">
          <div className="relative w-full h-48 overflow-hidden">
            <Image
              src={project.imageSrc || '/images/project-placeholder.jpg'}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={85}
              priority={false}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
          </div>

          <div className="flex-1 p-5">
            <Heading level={3} className="mb-2 group-hover:text-accent-400 transition-colors">
              {project.title}
            </Heading>
            <Text size="sm" className="text-text-secondary mb-4 line-clamp-3">
              {project.description}
            </Text>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.slice(0, 4).map((tech, index) => (
                <span key={index} className="px-3 py-1 text-xs rounded-full bg-white/10 border border-white/10 text-white/80">
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="px-3 py-1 text-xs rounded-full bg-white/10 border border-white/10 text-white/60">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>
            <div className="flex justify-end">
              <Button variant="glass" size="sm" onClick={() => setIsModalOpen(true)} aria-label={`View details for ${project.title}`}>
                View Details
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={project.title}>
        <div className="space-y-6">
          <div className="relative w-full h-64 overflow-hidden rounded-lg">
            <Image
              src={project.imageSrc || '/images/project-placeholder.jpg'}
              alt={project.title}
              fill
              className="object-cover"
              sizes="100vw"
              quality={85}
              priority={false}
              loading="lazy"
            />
          </div>
          <Text size="md" className="whitespace-pre-line">{project.description}</Text>
          <div>
            <Heading level={4} className="mb-3">Technologies</Heading>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span key={index} className="px-3 py-1 text-sm rounded-full bg-white/10 border border-white/10 text-white/80">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            {project.githubUrl && (
              <Button variant="primary" size="sm">
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} code on GitHub`}>
                  <Icon name="github" size={16} className="mr-2" />
                  View Code
                </a>
              </Button>
            )}
            {project.demoUrl && (
              <Button variant="secondary" size="sm">
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" aria-label={`View live demo of ${project.title}`}>
                  <Icon name="chevronRight" size={16} className="mr-2" />
                  Live Demo
                </a>
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

"use client";

import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Heading } from '../components/typography/Heading';
import { Text } from '../components/typography/Text';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { Modal } from '../components/Modal';
import Image from 'next/image';

interface Project {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
}

type ProjectCardProps = {
  project: Project;
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card className="h-full flex flex-col hover:shadow-xl transition-shadow">
        <div className="relative w-full h-48 mb-4 overflow-hidden rounded-t-lg">
          <Image
            src={project.imageSrc || '/images/project-placeholder.jpg'}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={85}
            priority={false}
            loading="lazy"
          />
        </div>
        
        <div className="flex-1 p-4">
          <Heading level={3} className="mb-2">
            {project.title}
          </Heading>
          
          <Text size="sm" className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
            {project.description}
          </Text>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
          
          <div className="flex justify-end">
            <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(true)} aria-label={`View details for ${project.title}`}>
              View Details
            </Button>
          </div>
        </div>
      </Card>

      {/* Project Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={project.title}
      >
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
          
          <Text size="md" className="whitespace-pre-line">
            {project.description}
          </Text>
          
          <div className="space-y-4">
            <Heading level={4}>Technologies Used</Heading>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-sm rounded-full"
                >
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
                  <Icon name="external" size={16} className="mr-2" />
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
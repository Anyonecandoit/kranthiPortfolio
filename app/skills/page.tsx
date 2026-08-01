"use client";

import { Section } from '../components/layout/Section';
import { Container } from '../components/layout/Container';
import { Heading } from '../components/typography/Heading';
import { Text } from '../components/typography/Text';
import { SkillCategoryGrid } from '../sections/SkillCategoryGrid';
import { motion } from 'framer-motion';

const skillCategories = [
  {
    title: 'Programming Languages',
    skills: [
      { name: 'TypeScript', proficiency: 95, icon: 'typescript' },
      { name: 'JavaScript', proficiency: 95, icon: 'javascript' },
      { name: 'Python', proficiency: 85, icon: 'python' },
      { name: 'Java', proficiency: 80, icon: 'java' },
      { name: 'C#', proficiency: 75, icon: 'csharp' },
      { name: 'Go', proficiency: 70, icon: 'go' }
    ]
  },
  {
    title: 'Frontend Development',
    skills: [
      { name: 'React', proficiency: 95, icon: 'react' },
      { name: 'Next.js', proficiency: 90, icon: 'nextjs' },
      { name: 'Redux', proficiency: 85, icon: 'redux' },
      { name: 'HTML5', proficiency: 95, icon: 'html' },
      { name: 'CSS3', proficiency: 90, icon: 'css' },
      { name: 'Tailwind CSS', proficiency: 85, icon: 'tailwind' }
    ]
  },
  {
    title: 'Backend Development',
    skills: [
      { name: 'Node.js', proficiency: 90, icon: 'nodejs' },
      { name: 'Express', proficiency: 85, icon: 'express' },
      { name: 'NestJS', proficiency: 80, icon: 'nestjs' },
      { name: 'REST API', proficiency: 95, icon: 'api' },
      { name: 'GraphQL', proficiency: 80, icon: 'graphql' },
      { name: 'WebSockets', proficiency: 75, icon: 'websocket' }
    ]
  },
  {
    title: 'Cloud & DevOps',
    skills: [
      { name: 'AWS', proficiency: 85, icon: 'aws' },
      { name: 'Docker', proficiency: 80, icon: 'docker' },
      { name: 'Kubernetes', proficiency: 75, icon: 'kubernetes' },
      { name: 'CI/CD', proficiency: 85, icon: 'cicd' },
      { name: 'Terraform', proficiency: 70, icon: 'terraform' },
      { name: 'Serverless', proficiency: 75, icon: 'serverless' }
    ]
  },
  {
    title: 'Testing & QA',
    skills: [
      { name: 'Jest', proficiency: 90, icon: 'jest' },
      { name: 'Cypress', proficiency: 85, icon: 'cypress' },
      { name: 'Playwright', proficiency: 80, icon: 'playwright' },
      { name: 'Mocha', proficiency: 85, icon: 'mocha' },
      { name: 'Chai', proficiency: 85, icon: 'chai' },
      { name: 'Selenium', proficiency: 80, icon: 'selenium' }
    ]
  },
  {
    title: 'Databases',
    skills: [
      { name: 'PostgreSQL', proficiency: 85, icon: 'postgresql' },
      { name: 'MongoDB', proficiency: 80, icon: 'mongodb' },
      { name: 'Redis', proficiency: 75, icon: 'redis' },
      { name: 'MySQL', proficiency: 80, icon: 'mysql' },
      { name: 'DynamoDB', proficiency: 70, icon: 'dynamodb' }
    ]
  }
];

export default function SkillsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background-dark">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background-dark via-background-dark-secondary to-background-dark-tertiary" />
        <motion.div
          className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-3xl"
          animate={{ y: [0, 40, -10, 0], x: [0, -20, 20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 -right-40 h-[450px] w-[450px] rounded-full bg-cyan-500/20 blur-3xl"
          animate={{ y: [0, -30, 10, 0], x: [0, 30, -20, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.6)_100%)]" />
      </div>

      <Section className="relative z-10 py-16 md:py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Heading level={1} className="mb-4 gradient-text">
              Technical Skills
            </Heading>
            <Text size="lg" className="max-w-2xl mx-auto text-gray-300">
              Technologies and tools I use to build world-class products
            </Text>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="glass rounded-3xl p-6 md:p-10">
              <SkillCategoryGrid categories={skillCategories} />
            </div>
          </motion.div>
        </Container>
      </Section>
    </main>
  );
}

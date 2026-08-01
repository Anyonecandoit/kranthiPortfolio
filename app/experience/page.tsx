"use client";

import { Section } from '../components/layout/Section';
import { Container } from '../components/layout/Container';
import { Heading } from '../components/typography/Heading';
import { Text } from '../components/typography/Text';
import { Timeline } from '../sections/Timeline';
import { motion } from 'framer-motion';

const experiences = [
  {
    id: 'senior-engineer-2020',
    company: 'Tech Solutions Inc.',
    role: 'Senior Software Engineer',
    startDate: '2020',
    endDate: 'Present',
    description: 'Leading the development of enterprise-level applications using React, Next.js, and TypeScript. Responsible for architectural decisions, code reviews, and mentoring junior developers.',
    achievements: [
      'Architected and implemented a scalable microservices architecture that reduced server response time by 40%',
      'Led a team of 5 developers to deliver a complex dashboard application within tight deadlines',
      'Implemented CI/CD pipelines that reduced deployment time from 30 minutes to under 5 minutes',
      'Mentored 3 junior developers, helping them grow into mid-level engineers',
      'Introduced TypeScript across the codebase, reducing runtime errors by 60%'
    ],
    location: 'Hyderabad, India'
  },
  {
    id: 'software-engineer-2017',
    company: 'InnovateTech Solutions',
    role: 'Software Engineer',
    startDate: '2017',
    endDate: '2020',
    description: 'Developed and maintained web applications for financial services clients. Focused on building responsive, accessible, and high-performance user interfaces.',
    achievements: [
      'Built a real-time data visualization dashboard using D3.js and React',
      'Optimized application performance, achieving 90+ Lighthouse scores',
      'Implemented comprehensive test coverage, increasing from 60% to 95%',
      'Collaborated with UX designers to create intuitive user experiences',
      'Reduced critical bugs by 70% through improved testing and monitoring'
    ],
    location: 'Hyderabad, India'
  },
  {
    id: 'associate-engineer-2014',
    company: 'WebTech Solutions',
    role: 'Associate Software Engineer',
    startDate: '2014',
    endDate: '2017',
    description: 'Started career as a frontend developer, working on various web applications using JavaScript, jQuery, and early React versions.',
    achievements: [
      'Developed and maintained multiple client websites and web applications',
      'Transitioned the team from jQuery to React, improving development efficiency',
      'Implemented responsive design principles across all projects',
      'Created reusable component libraries that reduced development time by 30%',
      'Received recognition for outstanding contributions to client projects'
    ],
    location: 'Hyderabad, India'
  }
];

export default function ExperiencePage() {
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
              Professional Experience
            </Heading>
            <Text size="lg" className="max-w-2xl mx-auto text-gray-300">
              My journey building impactful software
            </Text>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="glass rounded-3xl p-6 md:p-10">
              <Timeline experiences={experiences} />
            </div>
          </motion.div>
        </Container>
      </Section>
    </main>
  );
}

"use client";

import { Metadata } from 'next';
import { Section } from '../components/layout/Section';
import { Container } from '../components/layout/Container';
import { Heading } from '../components/typography/Heading';
import { ProfileCard } from '../sections/ProfileCard';
import { SummaryText } from '../sections/SummaryText';
import { motion } from 'framer-motion';

// Placeholder data from resume
const quickFacts = [
  { label: 'Experience', value: '10+ years' },
  { label: 'Location', value: 'Hyderabad, India' },
  { label: 'Certifications', value: 'AWS, Kubernetes, ISTQB' },
  { label: 'Education', value: 'M.Tech in Computer Science' },
  { label: 'Specialization', value: 'Full Stack Development' },
  { label: 'Current Role', value: 'Senior Software Engineer' }
];

const summarySections = [
  {
    title: 'Professional Summary',
    content: `Results-driven Senior Software Engineer with over 10 years of experience in designing, developing, and deploying scalable software solutions. Expertise in full-stack development with a strong focus on React, Next.js, TypeScript, and cloud technologies. Proven track record of delivering high-quality software in Agile environments with a passion for creating efficient, maintainable, and user-centric applications.`
  },
  {
    title: 'Technical Philosophy',
    content: `I believe in writing clean, maintainable code that solves real business problems. My approach combines technical excellence with user-centric design, ensuring that the software I build is both powerful and intuitive. I'm passionate about leveraging modern technologies to create scalable solutions that drive business growth and innovation.`
  }
];

export default function AboutPage() {
  return (
    <main>
      <Section className="py-16 md:py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Heading level={1} className="mb-4 gradient-text">
              About Me
            </Heading>
            <p className="text-body-lg max-w-2xl mx-auto text-text-secondary">
              Professional journey and expertise
            </p>
          </motion.div>
          
          <div className="mb-16">
            <ProfileCard
              name="Kranthi Kumar Katta"
              title="Senior Software Engineer | Full Stack Developer"
              imageSrc="/images/portrait.jpg"
              quickFacts={quickFacts}
            />
          </div>
          
          <SummaryText sections={summarySections} />
        </Container>
      </Section>
    </main>
  );
}
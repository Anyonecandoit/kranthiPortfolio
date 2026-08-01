"use client";

import { Section } from '../components/layout/Section';
import { Container } from '../components/layout/Container';
import { Heading } from '../components/typography/Heading';
import { Text } from '../components/typography/Text';
import { ProfileCard } from '../sections/ProfileCard';
import { SummaryText } from '../sections/SummaryText';
import { motion } from 'framer-motion';

const quickFacts = [
  { label: 'Experience', value: '5+ years' },
  { label: 'Location', value: 'Bangalore, India' },
  { label: 'Role', value: 'SDET 2 | QA Automation Engineer' },
  { label: 'Education', value: 'Master’s in Mechanical Engineering' },
  { label: 'Domain', value: 'Fintech / Payments' },
  { label: 'Certifications', value: 'DevOps, CI/CD, Docker, Kubernetes' },
];

const summarySections = [
  {
    title: 'Professional Summary',
    content: `Results-driven SDET and QA Automation Engineer with 5+ years of experience in Automation Testing, API Validation, Fintech/Payment Systems, and Distributed Microservices Architecture. Proven expertise in Selenium WebDriver, Rest Assured, Java, Kafka, CI/CD Pipelines, and End-to-End Transaction Validation across high-volume Remittance and Payment Gateway Applications. Skilled in designing scalable automation frameworks, validating event-driven systems, performing compliance testing, and ensuring production stability for mission-critical financial platforms. Strong experience in Agile/Scrum methodologies, defect lifecycle management, RCA, and cross-functional collaboration.`,
  },
  {
    title: 'Key Highlights',
    content: `• 5+ years of experience in QA Automation, API Testing, and Fintech Systems
• Expertise in Selenium, Rest Assured, Java, Kafka, Jenkins, and MySQL
• Strong experience in payment gateways, distributed microservices
• Hands-on experience with CI/CD pipelines, containerized deployments, and production validation
• Proven ability to manage end-to-end testing, RCA, integration testing, and release coordination
• Strong understanding of Agile/Scrum methodologies and SDLC/STLC processes
• UI, API, FinTech / Banking / Payments Domain, Enterprise SaaS / Learning Management Domain Testing Specialist`,
  },
];

export default function AboutPage() {
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
            className="text-center mb-16"
          >
            <Heading level={1} className="mb-4 gradient-text">
              About Me
            </Heading>
            <Text size="lg" className="max-w-2xl mx-auto text-gray-300">
              Professional journey and expertise
            </Text>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-16"
          >
            <div className="glass rounded-3xl p-6 md:p-10">
              <ProfileCard
                name="Kranthi Kumar Katta"
                title="SDET 2 | QA Automation Engineer"
                imageSrc="/images/portrait.jpg"
                quickFacts={quickFacts}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="glass rounded-3xl p-6 md:p-10">
              <SummaryText sections={summarySections} />
            </div>
          </motion.div>
        </Container>
      </Section>
    </main>
  );
}

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

const education = [
  {
    degree: 'Master’s in Mechanical Engineering',
    institution: 'Halmstad University, Sweden',
    year: '2021',
  },
  {
    degree: 'Bachelor’s in Mechanical Engineering',
    institution: 'Mahaveer Institute of Science and Technology, Hyderabad',
    year: '2013 – 2017',
  },
];

const certifications = [
  'DevOps Certification Training – Eureka (In Progress)',
  'Continuous Integration & Continuous Deployment (CI/CD)',
  'Docker, Jenkins, Kubernetes, Terraform & Configuration Management',
  'Git & Build Automation in SDLC',
];

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background-dark">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background-dark via-background-dark-secondary to-background-dark-tertiary" />
        <motion.div
          className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-3xl animation-aurora"
          animate={{ y: [0, 40, -10, 0], x: [0, -20, 20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 -right-40 h-[450px] w-[450px] rounded-full bg-cyan-500/20 blur-3xl animation-aurora"
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
            <Heading level={1} className="mb-4 gradient-text text-shine">
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
            <div className="glass rounded-3xl p-6 md:p-10 gradient-border">
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
            className="mb-16"
          >
            <div className="glass rounded-3xl p-6 md:p-10">
              <SummaryText sections={summarySections} />
            </div>
          </motion.div>

          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
          >
            <div className="glass rounded-3xl p-6 md:p-10 hover-tilt">
              <Heading level={2} className="mb-6 gradient-text">Education</Heading>
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <div key={index} className="border-l-2 border-primary-400/40 pl-4">
                    <Text size="md" className="font-semibold">{edu.degree}</Text>
                    <Text size="sm" className="text-text-secondary">{edu.institution}</Text>
                    <Text size="xs" className="text-text-muted">{edu.year}</Text>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-3xl p-6 md:p-10 hover-tilt">
              <Heading level={2} className="mb-6 gradient-text">Certifications</Heading>
              <ul className="space-y-3">
                {certifications.map((cert, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="flex items-start gap-2"
                  >
                    <span className="mt-1 h-2 w-2 rounded-full bg-accent-400 shrink-0" />
                    <Text size="sm">{cert}</Text>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </Container>
      </Section>
    </main>
  );
}

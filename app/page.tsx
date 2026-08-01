"use client";

import { Section } from './components/layout/Section';
import { Container } from './components/layout/Container';
import { Heading } from './components/typography/Heading';
import { Text } from './components/typography/Text';
import { Button } from './components/Button';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const heroContent = {
  name: 'Kranthi Kumar Katta',
  title: 'SDET 2 | QA Automation Engineer',
  subtitle:
    'Results-driven SDET and QA Automation Engineer with 5+ years of experience in Automation Testing, API Validation, Fintech/Payment Systems, and Distributed Microservices Architecture.',
  ctaPrimary: 'View My Work',
  ctaSecondary: 'Download Resume',
  animatedText: ['SDET 2', 'QA Automation Engineer', 'Fintech Quality Advocate', 'API Test Specialist'],
};

const stats = [
  { value: '5+', label: 'Years Experience' },
  { value: '10+', label: 'Projects Validated' },
  { value: '3', label: 'Industry Domains' },
  { value: '20+', label: 'Technologies Used' },
];

const marqueeSkills = [
  'Selenium WebDriver', 'Rest Assured', 'TestNG', 'Cucumber', 'Appium',
  'Kafka', 'Jenkins', 'Docker', 'Kubernetes', 'MySQL', 'Postman',
  'Java', 'SQL', 'GCP', 'Microservices', 'Agile', 'CI/CD', 'Terraform'
];

export default function Home() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % heroContent.animatedText.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main>
      <Section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-16 md:px-6">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background-dark via-background-dark-secondary to-background-dark-tertiary" />
          <motion.div
            className="absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-primary-500/30 blur-3xl animation-aurora"
            animate={{ x: [0, 40, -20], y: [0, 30, -10] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-1/3 -right-32 h-[500px] w-[500px] rounded-full bg-accent-500/30 blur-3xl animation-aurora"
            animate={{ x: [0, -30, 20], y: [0, -20, 10] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-secondary-500/20 blur-3xl animation-float-slow"
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Rotating ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full border border-white/5 animation-spin-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full border border-primary-400/20 animation-spin-slow" />

          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.7)_100%)]" />
        </div>

        <Container className="relative z-10 w-full max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="gradient-border glass w-full rounded-3xl border border-white/10 px-6 py-12 shadow-2xl backdrop-blur-xl md:px-16 md:py-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/80"
              whileHover={{ scale: 1.05 }}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary-400 opacity-75" />
                <span className="absolute inline-flex h-full w-full rounded-full bg-secondary-400 animation-pulse-ring" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary-500" />
              </span>
              Available for opportunities
            </motion.div>

            <Text size="lg" color="secondary" className="mb-2 font-medium tracking-wide">
              Hi, I&apos;m
            </Text>

            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
              <Heading level={1} className="mb-4 text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
                <span className="gradient-text text-shine">{heroContent.name}</span>
              </Heading>
            </motion.div>

            <div className="mb-6 flex h-12 items-center justify-center md:h-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTextIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Text size="lg" className="gradient-text text-2xl font-semibold md:text-4xl lg:text-5xl">
                    {heroContent.animatedText[currentTextIndex]}
                  </Text>
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.7 }}>
              <Text size="md" color="secondary" className="mx-auto mb-10 max-w-3xl text-lg md:text-xl">
                {heroContent.subtitle}
              </Text>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <Button variant="gradient" size="lg" className="glass w-full">
                  <Link href="/portfolio" aria-label="View portfolio projects">
                    {heroContent.ctaPrimary}
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <Button variant="glass" size="lg" className="w-full">
                  <Link href="/kranthi kumar katta resume may 2026.pdf" download aria-label="Download resume PDF" prefetch={false}>
                    {heroContent.ctaSecondary}
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-colors"
                >
                  <Text size="sm" className="text-text-secondary">{stat.label}</Text>
                  <Text size="lg" className="gradient-text font-bold text-3xl">{stat.value}</Text>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>

        <motion.div
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/50"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </Section>

      {/* Skills Marquee */}
      <div className="relative z-10 bg-black/20 border-y border-white/5 py-4 overflow-hidden">
        <div className="flex whitespace-nowrap animation-marquee w-max">
          {[...marqueeSkills, ...marqueeSkills].map((skill, index) => (
            <span key={index} className="mx-6 text-sm md:text-base text-white/60 hover:text-white transition-colors">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <Section className="py-16 md:py-24">
        <Container>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto">
            <Heading level={2} className="mb-6 gradient-text text-shine">About Me</Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="glass p-6 rounded-xl hover-tilt">
                <Text size="md">
                  Results-driven SDET and QA Automation Engineer with 5+ years of experience in Automation Testing, API Validation, Fintech/Payment Systems, and Distributed Microservices Architecture.
                </Text>
              </div>
              <div className="glass p-6 rounded-xl">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Experience', value: '5+ years' },
                    { label: 'Location', value: 'Bangalore, India' },
                    { label: 'Domain', value: 'Fintech / Payments' },
                    { label: 'Certifications', value: 'DevOps, CI/CD' },
                  ].map((fact, index) => (
                    <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="text-center p-4 rounded-lg bg-white/5 border border-white/10 hover:border-primary-400/50 transition-colors">
                      <Text size="sm" className="text-text-secondary mb-1">{fact.label}</Text>
                      <Text size="md" className="font-bold">{fact.value}</Text>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="primary" className="glass">
                <Link href="/about" aria-label="Learn more about me">Learn More</Link>
              </Button>
            </motion.div>
          </motion.div>
        </Container>
      </Section>
    </main>
  );
}

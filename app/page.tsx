"use client";

import { Section } from './components/layout/Section';
import { Container } from './components/layout/Container';
import { Heading } from './components/typography/Heading';
import { Text } from './components/typography/Text';
import { Button } from './components/Button';
import { FadeIn } from './components/animations/FadeIn';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const heroContent = {
  name: 'Kranthi Kumar Katta',
  title: 'Senior Software Engineer',
  subtitle: 'Building scalable, high-performance web applications with modern technologies',
  ctaPrimary: 'View My Work',
  ctaSecondary: 'Download Resume',
  animatedText: ['Full Stack Developer', 'React Specialist', 'TypeScript Enthusiast', 'Cloud Architect']
};

const aboutPreview = {
  title: 'About Me',
  content: 'Results-driven Senior Software Engineer with over 10 years of experience in designing, developing, and deploying scalable software solutions. Expertise in full-stack development with a strong focus on React, Next.js, TypeScript, and cloud technologies.',
  cta: 'Learn More',
  quickFacts: [
    { label: 'Experience', value: '10+ years' },
    { label: 'Technologies', value: 'React, Next.js, TypeScript, Node.js' },
    { label: 'Projects', value: '20+ completed' },
    { label: 'Certifications', value: 'AWS, Kubernetes, ISTQB' }
  ]
};

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
      {/* Hero Section — Premium Full-Screen Redesign */}
      <Section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-16 md:px-6">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          {/* Base dark gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800" />
          
          {/* Floating gradient orbs for depth */}
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
          <motion.div
            className="absolute -bottom-40 left-1/4 h-[400px] w-[400px] rounded-full bg-accent-500/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Subtle grid overlay */}
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }}
          />

          {/* Vignette / focus */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.6)_100%)]" />
        </div>

        {/* Main Content Card */}
        <Container className="relative z-10 w-full max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="glass w-full rounded-3xl border border-white/10 px-6 py-12 shadow-2xl backdrop-blur-xl md:px-16 md:py-16 lg:px-20 lg:py-20"
          >
            {/* Availability Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/80"
              whileHover={{ scale: 1.05 }}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Available for opportunities
            </motion.div>

            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Text size="lg" color="secondary" className="mb-2 font-medium tracking-wide">
                Hi, I&apos;m
              </Text>
            </motion.div>

            {/* Name — Hero Typography */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Heading level={1} className="mb-4 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {heroContent.name}
                </span>
              </Heading>
            </motion.div>

            {/* Rotating Roles */}
            <div className="mb-6 flex h-12 items-center justify-center md:h-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTextIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center justify-center"
                >
                  <Text size="lg" className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-2xl font-semibold text-transparent md:text-4xl lg:text-5xl">
                    {heroContent.animatedText[currentTextIndex]}
                  </Text>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
            >
              <Text size="md" color="secondary" className="mx-auto mb-12 max-w-2xl text-lg md:text-xl">
                {heroContent.subtitle}
              </Text>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="glass">
                  <Link href="/portfolio" aria-label="View portfolio projects">
                    {heroContent.ctaPrimary}
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <Button variant="glass" size="lg" className="glass">
                  <Link
                    href="/kranthi kumar katta resume may 2026.pdf"
                    download
                    aria-label="Download resume PDF"
                    prefetch={false}
                  >
                    {heroContent.ctaSecondary}
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </Container>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/50"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </Section>

      {/* About Preview Section */}
      <Section className="py-16 md:py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <Heading level={2} className="mb-6 gradient-text">
              {aboutPreview.title}
            </Heading>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="glass p-6 rounded-xl">
                <Text size="md" className="whitespace-pre-line">
                  {aboutPreview.content}
                </Text>
              </div>

              <div className="glass p-6 rounded-xl">
                <div className="grid grid-cols-2 gap-4">
                  {aboutPreview.quickFacts.map((fact, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="text-center p-4 rounded-lg bg-surface-light/50 dark:bg-surface-dark/50"
                    >
                      <Text size="sm" className="text-text-secondary mb-1">
                        {fact.label}
                      </Text>
                      <Text size="md" className="font-bold">
                        {fact.value}
                      </Text>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="primary" className="glass">
                <Link href="/about" aria-label="Learn more about me">
                  {aboutPreview.cta}
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </Container>
      </Section>

      {/* Quick Navigation */}
      <Section className="py-16 md:py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                title: 'Experience',
                description: '10+ years building enterprise applications',
                link: '/experience',
                linkText: 'View Experience'
              },
              {
                title: 'Skills',
                description: 'Full-stack expertise across modern technologies',
                link: '/skills',
                linkText: 'View Skills'
              },
              {
                title: 'Contact',
                description: 'Get in touch for collaborations or opportunities',
                link: '/contact',
                linkText: 'Contact Me'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="glass p-6 rounded-xl hover:shadow-glow transition-all duration-normal"
              >
                <Heading level={3} className="mb-4 gradient-text">
                  {item.title}
                </Heading>
                <Text size="md" className="mb-4">
                  {item.description}
                </Text>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="secondary" size="sm" className="glass">
                    <Link href={item.link} aria-label={`View ${item.title.toLowerCase()}`}>
                      {item.linkText}
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </Section>
    </main>
  );
}

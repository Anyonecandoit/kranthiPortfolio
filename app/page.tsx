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
      {/* Hero Section */}
      <Section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.1)_0%,_rgba(0,0,0,0)_70%)]" />
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full blur-3xl opacity-30" />
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl opacity-30" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 rounded-full blur-2xl opacity-20" />
          </div>
        </div>

        <Container className="text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Profile Avatar */}
            <motion.div
              className="mx-auto mb-8 w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 p-1 shadow-2xl shadow-purple-500/20"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">KK</span>
              </div>
            </motion.div>

            <Text size="lg" color="secondary" className="mb-4">Hi, I'm</Text>
            <Heading level={1} className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Kranthi Kumar Katta</span>
            </Heading>

            <div className="h-16 md:h-20 mb-6 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTextIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="absolute w-full text-center"
                >
                  <Text size="lg" color="gradient" className="font-semibold">
                    {heroContent.animatedText[currentTextIndex]}
                  </Text>
                </motion.div>
              </AnimatePresence>
            </div>

            <Text size="md" color="secondary" className="max-w-3xl mx-auto mb-12 text-lg md:text-xl">
              {heroContent.subtitle}
            </Text>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button variant="primary" size="lg">
                  <Link href="/portfolio" aria-label="View portfolio projects">
                    {heroContent.ctaPrimary}
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button variant="glass" size="lg">
                  <Link href="/kranthi kumar katta resume may 2026.pdf" download aria-label="Download resume PDF" prefetch={false}>
                    {heroContent.ctaSecondary}
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </Container>
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

"use client";

import { Section } from '../components/layout/Section';
import { Container } from '../components/layout/Container';
import { Heading } from '../components/typography/Heading';
import { Text } from '../components/typography/Text';
import { ContactForm } from '../sections/ContactForm';
import { SocialLinks } from '../sections/SocialLinks';
import { Button } from '../components/Button';
import Link from 'next/link';
import { motion } from 'framer-motion';

const socialLinks = [
  { name: 'LinkedIn', url: 'https://linkedin.com/in/kranthi-kumar-katta-a40093318', icon: 'linkedin' },
  { name: 'Email', url: 'mailto:kranthikumarkatta2006@gmail.com', icon: 'email' },
];

export default function ContactPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background-dark">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background-dark via-background-dark-secondary to-background-dark-tertiary" />
        <motion.div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-3xl animation-aurora" animate={{ y: [0, 40, -10, 0], x: [0, -20, 20, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute top-1/3 -right-40 h-[450px] w-[450px] rounded-full bg-cyan-500/20 blur-3xl animation-aurora" animate={{ y: [0, -30, 10, 0], x: [0, 30, -20, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} />
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.6)_100%)]" />
      </div>

      <Section className="relative z-10 py-16 md:py-24">
        <Container>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <Heading level={1} className="mb-4 gradient-text text-shine">Get In Touch</Heading>
            <Text size="lg" className="max-w-2xl mx-auto text-gray-300">Let&apos;s build something amazing together</Text>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="space-y-8">
              <div className="gradient-border glass rounded-3xl p-6 md:p-10 hover-tilt">
                <Heading level={2} className="mb-4">Contact Information</Heading>
                <Text size="md" className="mb-4">I&apos;m always open to discussing new projects, creative ideas, or opportunities to collaborate. Feel free to reach out through the form or connect with me on social media.</Text>
                <Text size="md" className="mb-2"><strong>Email:</strong> kranthikumarkatta2006@gmail.com</Text>
                <Text size="md" className="mb-2"><strong>Phone:</strong> +91 8466952706</Text>
                <Text size="md" className="mb-2"><strong>Location:</strong> Bangalore, India</Text>
              </div>
              <div className="gradient-border glass rounded-3xl p-6 md:p-10 hover-tilt">
                <Heading level={2} className="mb-4">Connect With Me</Heading>
                <SocialLinks links={socialLinks} />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="space-y-8">
              <div className="gradient-border glass rounded-3xl p-6 md:p-10">
                <Heading level={2} className="mb-4">Send Me a Message</Heading>
                <Text size="md" className="mb-4">Fill out the form below and I&apos;ll get back to you as soon as possible.</Text>
                <ContactForm />
              </div>
              <div className="text-center">
                <Button variant="secondary">
                  <Link href="/kranthi kumar katta resume may 2026.pdf" download>Download My Resume</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>
    </main>
  );
}

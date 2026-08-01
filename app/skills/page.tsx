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
      { name: 'Java', proficiency: 95, icon: 'java' },
      { name: 'SQL', proficiency: 85, icon: 'database' },
    ],
  },
  {
    title: 'Automation Testing',
    skills: [
      { name: 'Selenium WebDriver', proficiency: 95, icon: 'selenium' },
      { name: 'Hybrid Framework', proficiency: 90, icon: 'code' },
      { name: 'TestNG', proficiency: 90, icon: 'testng' },
      { name: 'Cucumber (BDD)', proficiency: 85, icon: 'cucumber' },
      { name: 'Appium', proficiency: 75, icon: 'appium' },
      { name: 'Data-Driven Framework', proficiency: 80, icon: 'file' },
    ],
  },
  {
    title: 'API Testing',
    skills: [
      { name: 'Rest Assured', proficiency: 92, icon: 'rest' },
      { name: 'Postman', proficiency: 90, icon: 'postman' },
      { name: 'Swagger UI', proficiency: 80, icon: 'swagger' },
    ],
  },
  {
    title: 'Performance Testing',
    skills: [{ name: 'JMeter', proficiency: 75, icon: 'jmeter' }],
  },
  {
    title: 'CI/CD & DevOps',
    skills: [
      { name: 'Jenkins', proficiency: 85, icon: 'jenkins' },
      { name: 'Docker', proficiency: 80, icon: 'docker' },
      { name: 'Kubernetes', proficiency: 75, icon: 'kubernetes' },
      { name: 'Terraform', proficiency: 70, icon: 'terraform' },
      { name: 'Maven', proficiency: 80, icon: 'maven' },
      { name: 'Nexus', proficiency: 70, icon: 'nexus' },
      { name: 'Argo CD', proficiency: 65, icon: 'argo' },
    ],
  },
  {
    title: 'Messaging & Event Systems',
    skills: [
      { name: 'Apache Kafka', proficiency: 80, icon: 'kafka' },
      { name: 'Temporal Workflows', proficiency: 65, icon: 'temporal' },
    ],
  },
  {
    title: 'Databases & Caching',
    skills: [
      { name: 'MySQL (Master-Slave Replication)', proficiency: 85, icon: 'mysql' },
      { name: 'Redis', proficiency: 70, icon: 'redis' },
    ],
  },
  {
    title: 'Version Control',
    skills: [
      { name: 'Git', proficiency: 90, icon: 'git' },
      { name: 'GitHub', proficiency: 85, icon: 'github' },
      { name: 'GitLab', proficiency: 80, icon: 'gitlab' },
      { name: 'Bitbucket', proficiency: 75, icon: 'bitbucket' },
    ],
  },
  {
    title: 'Monitoring & Logging',
    skills: [
      { name: 'Datadog', proficiency: 80, icon: 'datadog' },
      { name: 'Grafana', proficiency: 75, icon: 'grafana' },
    ],
  },
  {
    title: 'Cloud & Infrastructure',
    skills: [
      { name: 'GCP', proficiency: 85, icon: 'gcp' },
      { name: 'Microservices Architecture', proficiency: 80, icon: 'cloud' },
    ],
  },
  {
    title: 'Workflow & Collaboration Tools',
    skills: [
      { name: 'JIRA', proficiency: 90, icon: 'jira' },
      { name: 'Confluence', proficiency: 80, icon: 'confluence' },
      { name: 'MS Teams', proficiency: 85, icon: 'teams' },
      { name: 'Outlook', proficiency: 80, icon: 'outlook' },
      { name: 'Retool', proficiency: 60, icon: 'retool' },
      { name: 'Novu', proficiency: 55, icon: 'novu' },
    ],
  },
  {
    title: 'Test Platforms & Utilities',
    skills: [
      { name: 'LambdaTest', proficiency: 75, icon: 'lambdatest' },
      { name: 'TestFlight', proficiency: 65, icon: 'testflight' },
      { name: 'App Tester', proficiency: 60, icon: 'app' },
      { name: 'Airflow', proficiency: 65, icon: 'airflow' },
      { name: 'Syncthing', proficiency: 55, icon: 'syncthing' },
      { name: 'Swagger UI', proficiency: 75, icon: 'swagger' },
    ],
  },
  {
    title: 'Operating Systems',
    skills: [
      { name: 'Linux', proficiency: 90, icon: 'linux' },
      { name: 'Windows', proficiency: 85, icon: 'windows' },
      { name: 'macOS', proficiency: 80, icon: 'apple' },
    ],
  },
  {
    title: 'Productivity Tools',
    skills: [
      { name: 'MS Word', proficiency: 85, icon: 'word' },
      { name: 'MS Excel', proficiency: 85, icon: 'excel' },
      { name: 'Sublime Text', proficiency: 80, icon: 'sublime' },
    ],
  },
  {
    title: 'Methodologies',
    skills: [
      { name: 'Agile', proficiency: 90, icon: 'agile' },
      { name: 'Scrum', proficiency: 90, icon: 'scrum' },
      { name: 'SDLC', proficiency: 85, icon: 'sdlc' },
      { name: 'STLC', proficiency: 85, icon: 'stlc' },
    ],
  },
  {
    title: 'Web Technologies',
    skills: [
      { name: 'HTML', proficiency: 80, icon: 'html' },
      { name: 'XML', proficiency: 75, icon: 'xml' },
    ],
  },
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

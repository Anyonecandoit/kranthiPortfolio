"use client";

import { Section } from '../components/layout/Section';
import { Container } from '../components/layout/Container';
import { Heading } from '../components/typography/Heading';
import { Text } from '../components/typography/Text';
import { Timeline } from '../sections/Timeline';
import { motion } from 'framer-motion';

const experiences = [
  {
    id: 'barraq-sdet2-2025',
    company: 'Barraq Technology Lab India Private Limited',
    role: 'SDET 2',
    startDate: '03 June 2025',
    endDate: 'Present',
    description:
      'Project: BARQ – Cross-Border Remittance Platform. Performed End-to-End Testing of international remittance workflows across Distributed Microservices Architecture handling high-volume cross-border transactions.',
    achievements: [
      'Automated and validated REST APIs for beneficiary creation, FX rate validation, compliance checks, pre-commit, and transaction commit workflows using Rest Assured and Postman.',
      'Validated complete Remittance Transaction Lifecycle including OTP verification, IVR authentication, compliance screening, wallet debit, core banking processing, and MTO Integrations.',
      'Tested integrations with MoneyGram, TerraPay, Western Union, Thunes, XE, SAS, and FinScan, ensuring seamless transaction orchestration and data consistency.',
      'Validated Kafka-based asynchronous transaction processing, retry handling, fallback mechanisms, and eventual consistency across distributed services, reducing transaction reconciliation issues by 25%.',
      'Executed SQL Validations across compliance, remittance, core banking, and frontend systems to ensure 99.9% transactional data integrity.',
      'Designed and executed Edge-Case Test Scenarios covering compliance hold/reject flows, rollback handling, refunds, timeout recovery, and partial transaction failures.',
      'Validated Maker-Checker Workflows and multi-level approval hierarchy for FX rates, vendor onboarding, fees, and corridor configurations.',
      'Contributed to API Automation Framework Development using Java, Rest Assured, and TestNG, improving regression execution efficiency by 40% and reducing manual validation effort across critical remittance workflows.',
      'Developed and maintained automated validation suites for high-priority remittance APIs, improving release stability by 30% and accelerating sprint validation cycles.',
      'Collaborated with developers, QA teams, and DevOps engineers to support faster defect resolution, production readiness validation, and Agile sprint delivery.',
      'Integrated automated test suites with Jenkins CI/CD pipelines to support faster release validation and production stability.',
      'Performed Mobile Application Testing for BARQ applications using Appium, validating transaction workflows, UI responsiveness, authentication flows, and cross-device compatibility.',
      'Collaborated with product, backend, DevOps, and compliance teams for production issue validation, RCA, and defect resolution.',
    ],
    location: 'Bangalore, India',
  },
  {
    id: 'payu-qa-2025',
    company: 'PayU Digital Labs Private Limited (Wibmo)',
    role: 'QA Engineer',
    startDate: '03 March 2025',
    endDate: '02 June 2025',
    description:
      'Project: Payment Gateway Platform. Performed Functional, Regression, and Integration Testing for Payment Gateway Applications supporting domestic and international transactions.',
    achievements: [
      'Validated End-to-End Payment Transaction Lifecycle including payment initiation, routing, authorization, settlement, refunds, voids, and chargebacks.',
      'Tested Merchant Onboarding Workflows including MID/TID configuration, MCC validation, alert setup, and bulk onboarding processes.',
      'Automated API Testing for merchant-facing services using Rest Assured and Postman, validating request/response payloads and transaction stability.',
      'Validated Settlement Cycles (T+1/T+2), reconciliation workflows, ISO/IPM/NPCI settlement formats, and mismatch resolution processes.',
      'Verified Switch-Layer Routing Logic, ISO8583 message conversion, and transaction handoff between payment networks and issuer systems.',
      'Conducted Performance, Stress, and Load Testing to ensure application resilience under high transaction volumes, improving transaction processing stability by 35%.',
      'Supported regression and shakedown testing activities across multiple environments, improving production readiness and reducing post-release transaction issues by 25%.',
      'Participated in technical risk analysis, release planning, and deployment validation activities to ensure stable payment gateway releases.',
      'Collaborated with DevOps Teams for Helm deployments, patch management, and environment setup across UAT and production.',
      'Executed PCI-DSS Compliance Validations, fraud rule testing, tokenization checks, and 3DS Security Validations.',
      'Logged, tracked, and resolved Transaction-Related Defects and production issues using JIRA.',
    ],
    location: 'Bangalore, India',
  },
  {
    id: 'aha-impelsys-qa-2021',
    company: 'American Heart Association (Impelsys)',
    role: 'QA Engineer',
    startDate: '28 June 2021',
    endDate: '28 February 2025',
    description:
      'Project: Atlas – Unified Learning & Certification Platform. Led QA Activities for React-based production releases, including test planning, execution coordination, defect tracking, and go-live support.',
    achievements: [
      'Designed and implemented Selenium WebDriver Automation Frameworks for smoke, regression, and browser compatibility testing.',
      'Automated critical business workflows and regression scenarios, improving test execution efficiency by 45% and reducing repetitive manual testing efforts.',
      'Collaborated with Scrum teams during sprint planning, daily stand-ups, retrospectives, and release validation activities to ensure high-quality Agile deliveries.',
      'Developed Hybrid Automation Frameworks using Selenium, TestNG, and Apache POI, improving test coverage by 40% and framework maintainability.',
      'Performed API Functional and Integration Testing using Rest Assured and Postman across multiple enterprise integrations.',
      'Managed UAT Cycles, coordinated stakeholder validations, and ensured production readiness for user-facing features.',
      'Collaborated with DevOps Teams for Helm deployments, VPC migrations, database refreshes, and MySQL 8.0 Upgrades.',
      'Validated Enterprise Integrations including eCards, SSO, eLearning, MotionPoint, Google Maps, ShopCPR, and Instructor Network.',
      'Conducted Regression, Performance, Load, and Stress Testing to ensure system stability across pre-production and production environments, reducing critical production defects by 30%.',
      'Contributed to Root Cause Analysis (RCA), defect triaging, and release quality improvements in Agile delivery cycles.',
      'Worked closely with developers, business teams, and external stakeholders to resolve Critical Production and Integration Issues.',
      'Performed Security and Accessibility Validation for high-usage APIs and frontend workflows.',
      'Utilized Microsoft Dynamics 365 for training center management and user activity monitoring.',
    ],
    location: 'Bangalore, India',
  },
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

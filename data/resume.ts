export interface Experience {
  company: string;
  role: string;
  period: string;
  year?: string;
  project?: string;
  location?: string;
  description: string[];
  technologies?: string[];
  logo?: string;
  websiteUrl?: string;
}

export interface Project {
  title: string;
  company?: string;
  role?: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  image?: string;
  period?: string;
  logo?: string;
  websiteUrl?: string;
  /** Bullet points shown in the expanded "Key Contributions" section */
  keyContributions?: string[];
}

export interface Skill {
  name: string;
  category: string;
  level?: number;
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
  description?: string[];
}

export interface Certification {
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
}

export interface TechStack {
  ring1: string[];
  ring2: string[];
  ring3: string[];
  stats: { num: string; label: string }[];
  description: string;
}

export interface PricingTier {
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  cta: string;
  popular: boolean;
}

export interface FAQ {
  q: string;
  a: string;
}

export const resumeData = {
  name: "Kranthi Kumar Katta",
  title: "SDET 2 | QA Automation Engineer",
  email: "kranthikumarkatta2006@gmail.com",
  phone: "+91 8466952706",
  linkedin: "https://linkedin.com/in/kranthi-kumar-katta-a40093318",
  location: "Bangalore, India",
  summary: "Results-driven SDET and QA Automation Engineer with 5+ years of experience in Automation Testing, API Validation, Fintech/Payment Systems, and Distributed Microservices Architecture. Proven expertise in Selenium WebDriver, Rest Assured, Java, Kafka, CI/CD Pipelines, and End-to-End Transaction Validation across high-volume Remittance and Payment Gateway Applications. Skilled in designing scalable automation frameworks, validating event-driven systems, performing compliance testing, and ensuring production stability for mission-critical financial platforms. Strong experience in Agile/Scrum methodologies, defect lifecycle management, RCA, and cross-functional collaboration.",
  technicalExpertise: [
    {
      category: "Automation Testing",
      skills: ["Selenium WebDriver", "Hybrid Framework", "TestNG", "Cucumber (BDD)", "Appium", "Page Object Model (POM)"],
    },
    {
      category: "API & Event Systems",
      skills: ["Rest Assured", "Postman", "Swagger UI", "Apache Kafka", "Temporal Workflows"],
    },
    {
      category: "Performance Testing",
      skills: ["JMeter", "10,000+ Virtual Users", "Latency Profiling", "Stress & Load Testing"],
    },
    {
      category: "CI/CD & DevOps",
      skills: ["Jenkins", "Docker", "Kubernetes", "Terraform", "Maven", "Nexus", "Argo CD"],
    },
    {
      category: "Databases & Infrastructure",
      skills: ["Java", "SQL", "MySQL (Master-Slave Replication)", "Redis", "GCP", "Microservices Architecture"],
    },
    {
      category: "Monitoring & Utilities",
      skills: ["Datadog", "Grafana", "Git", "GitHub", "GitLab", "Bitbucket", "JIRA", "Confluence"],
    },
  ],

  experience: [
    {
      company: "Barraq Technology Lab India Private Limited",
      role: "SDET 2",
      period: "03 June 2025 – Present",
      year: "2025 – PRESENT",
      project: "BARQ – Cross-Border Remittance Platform",
      location: "Bangalore, India",
      logo: "/logos/barq-logo.png",
      websiteUrl: "https://www.fintechfutures.com/paytech/new-fintech-barq-led-by-former-stc-pay-ceo-launches-in-saudi-arabia",
      description: [
        "Led end-to-end testing of international remittance workflows across distributed microservices architecture handling high-volume cross-border transactions.",
        "Automated and validated REST APIs for beneficiary creation, FX rate validation, compliance checks, pre-commit, and transaction commit workflows using Rest Assured and Postman.",
        "Validated complete remittance transaction lifecycle including OTP verification, IVR authentication, compliance screening, wallet debit, core banking processing, and MTO integrations.",
        "Tested integrations with MoneyGram, TerraPay, Western Union, Thunes, XE, SAS, and FinScan, ensuring seamless transaction orchestration and data consistency.",
        "Validated Kafka-based asynchronous transaction processing, retry handling, fallback mechanisms, and eventual consistency across distributed services, reducing transaction reconciliation issues by 25%.",
        "Executed SQL validations across compliance, remittance, core banking, and frontend systems to ensure 99.9% transactional data integrity.",
      ],
      technologies: ["Playwright", "Java", "REST Assured", "Kafka", "MySQL", "Jenkins", "Postman", "Kubernetes", "Docker", "Datadog"],
    },
    {
      company: "PayU Digital Labs Private Limited (Wibmo)",
      role: "QA Engineer",
      period: "03 March 2025 – 02 June 2025",
      year: "2025",
      project: "Payment Gateway Platform",
      location: "Bangalore, India",
      logo: "/logos/wibmo-icon.png",
      websiteUrl: "https://wibmo.com/",
      description: [
        "Performed functional, regression, and integration testing for Payment Gateway Applications supporting domestic and international transactions.",
        "Validated end-to-end payment transaction lifecycle including payment initiation, routing, authorization, settlement (T+1/T+2), refunds, voids, and chargebacks.",
        "Tested merchant onboarding workflows including MID/TID configuration, MCC validation, alert setup, and bulk onboarding processes.",
        "Automated API testing for merchant-facing services using Rest Assured and Postman, validating request/response payloads and transaction stability.",
        "Verified switch-layer routing logic, ISO8583 message conversion, and transaction handoff between payment networks and issuer systems.",
        "Executed PCI-DSS compliance validations, fraud rule testing, tokenization checks, and 3DS security validations.",
      ],
      technologies: ["Selenium", "REST Assured", "Postman", "Jenkins", "JIRA", "Kubernetes", "Helm", "MySQL", "JMeter"],
    },
    {
      company: "American Heart Association (Impelsys)",
      role: "QA Engineer",
      period: "28 June 2021 – 28 February 2025",
      year: "2021 – 2025",
      project: "Atlas – Unified Learning & Certification Platform",
      location: "Bangalore, India",
      logo: "/logos/atlas-logo.png",
      websiteUrl: "https://atlas.heart.org/",
      description: [
        "Led QA activities for React-based enterprise production releases, including test planning, execution coordination, defect tracking, and go-live support.",
        "Designed and implemented Selenium WebDriver hybrid automation frameworks using TestNG and Apache POI for smoke, regression, and browser compatibility testing.",
        "Automated critical business workflows and regression scenarios, improving test execution efficiency by 45% and reducing repetitive manual testing efforts.",
        "Performed API functional and integration testing using Rest Assured and Postman across multiple enterprise integrations (eCards, SSO, MotionPoint, Google Maps).",
        "Conducted regression, performance, load, and stress testing, reducing critical production defects by 30%.",
        "Collaborated with DevOps teams for Helm deployments, VPC migrations, database refreshes, and MySQL 8.0 upgrades.",
      ],
      technologies: ["Selenium WebDriver", "Java", "TestNG", "REST Assured", "ReactJS", "Angular", "MySQL", "Jenkins", "JIRA"],
    },
  ] as Experience[],

  projects: [
    {
      title: "BARQ – Cross-Border Remittance Platform",
      company: "Barraq Technology Lab India Private Limited",
      role: "SDET 2",
      period: "03 June 2025 – Present",
      logo: "/logos/barq-logo.png",
      websiteUrl: "https://www.fintechfutures.com/paytech/new-fintech-barq-led-by-former-stc-pay-ceo-launches-in-saudi-arabia",
      description: "High-volume cross-border international remittance platform built on a distributed microservices architecture. Engineered end-to-end automated test suites, validated REST APIs, Kafka asynchronous transaction pipelines, multi-vendor MTO integrations, and mobile applications.",
      technologies: ["Java", "Rest Assured", "TestNG", "Kafka", "MySQL", "Jenkins", "Postman", "Kubernetes", "Docker", "Datadog", "Appium"],
      keyContributions: [
        "Performed End-to-End Testing of international remittance workflows across Distributed Microservices Architecture handling high-volume cross-border transactions.",
        "Automated and validated REST APIs for beneficiary creation, FX rate validation, compliance checks, pre-commit, and transaction commit workflows using Rest Assured and Postman.",
        "Validated complete Remittance Transaction Lifecycle including OTP verification, IVR authentication, compliance screening, wallet debit, core banking processing, and MTO Integrations (MoneyGram, TerraPay, Western Union, Thunes, XE, SAS, FinScan).",
        "Validated Kafka-based asynchronous transaction processing, retry handling, fallback mechanisms, and eventual consistency across distributed services, reducing transaction reconciliation issues by 25%.",
        "Executed SQL Validations across compliance, remittance, core banking, and frontend systems to ensure 99.9% transactional data integrity.",
        "Designed and executed Edge-Case Test Scenarios covering compliance hold/reject flows, rollback handling, refunds, timeout recovery, and partial transaction failures.",
        "Validated Maker-Checker Workflows and multi-level approval hierarchy for FX rates, vendor onboarding, fees, and corridor configurations.",
        "Contributed to API Automation Framework Development using Java, Rest Assured, and TestNG, improving regression execution efficiency by 40% and reducing manual validation effort.",
        "Developed and maintained automated validation suites for high-priority remittance APIs, improving release stability by 30% and accelerating sprint validation cycles.",
        "Performed Mobile Application Testing for BARQ applications using Appium, validating transaction workflows, UI responsiveness, authentication flows, and cross-device compatibility.",
        "Integrated automated test suites with Jenkins CI/CD pipelines to support faster release validation and production stability.",
      ],
    },
    {
      title: "Payment Gateway Platform",
      company: "PayU Digital Labs Private Limited (Wibmo)",
      role: "QA Engineer",
      period: "03 March 2025 – 02 June 2025",
      logo: "/logos/wibmo-icon.png",
      websiteUrl: "https://wibmo.com/",
      description: "Mission-critical payment gateway platform supporting domestic and international transactions, high-throughput switch-layer routing, settlement cycles, and merchant onboarding workflows.",
      technologies: ["Selenium", "Rest Assured", "Postman", "Jenkins", "JIRA", "Kubernetes", "Helm", "MySQL", "JMeter", "PCI-DSS", "3DS"],
      keyContributions: [
        "Performed Functional, Regression, and Integration Testing for Payment Gateway Applications supporting domestic and international transactions.",
        "Validated End-to-End Payment Transaction Lifecycle including payment initiation, routing, authorization, settlement (T+1/T+2), refunds, voids, and chargebacks.",
        "Tested Merchant Onboarding Workflows including MID/TID configuration, MCC validation, alert setup, and bulk onboarding processes.",
        "Automated API Testing for merchant-facing services using Rest Assured and Postman, validating request/response payloads and transaction stability.",
        "Validated Settlement Cycles (T+1/T+2), reconciliation workflows, ISO/IPM/NPCI settlement formats, and mismatch resolution processes.",
        "Verified Switch-Layer Routing Logic, ISO8583 message conversion, and transaction handoff between payment networks and issuer systems.",
        "Conducted Performance, Stress, and Load Testing to ensure application resilience under high transaction volumes, improving transaction processing stability by 35%.",
        "Supported regression and shakedown testing activities across multiple environments, improving production readiness and reducing post-release transaction issues by 25%.",
        "Collaborated with DevOps Teams for Helm deployments, patch management, and environment setup across UAT and production.",
        "Executed PCI-DSS Compliance Validations, fraud rule testing, tokenization checks, and 3DS Security Validations.",
        "Logged, tracked, and resolved Transaction-Related Defects and production issues using JIRA.",
      ],
    },
    {
      title: "Atlas – Unified Learning & Certification Platform",
      company: "American Heart Association (Impelsys)",
      role: "QA Engineer",
      period: "28 June 2021 – 28 February 2025",
      logo: "/logos/atlas-logo.png",
      websiteUrl: "https://atlas.heart.org/",
      description: "Global enterprise learning management, certification, and training administration platform serving millions of healthcare professionals worldwide with multi-system integrations.",
      technologies: ["Selenium WebDriver", "Java", "TestNG", "Rest Assured", "Apache POI", "ReactJS", "Angular", "MySQL", "Jenkins", "JMeter", "Dynamics 365"],
      keyContributions: [
        "Led QA Activities for React-based production releases, including test planning, execution coordination, defect tracking, and go-live support.",
        "Designed and implemented Selenium WebDriver Automation Frameworks for smoke, regression, and browser compatibility testing.",
        "Developed Hybrid Automation Frameworks using Selenium, TestNG, and Apache POI, improving test coverage by 40% and framework maintainability.",
        "Automated critical business workflows and regression scenarios, improving test execution efficiency by 45% and reducing repetitive manual testing efforts.",
        "Performed API Functional and Integration Testing using Rest Assured and Postman across multiple enterprise integrations (eCards, SSO, eLearning, MotionPoint, Google Maps, ShopCPR, Instructor Network).",
        "Managed UAT Cycles, coordinated stakeholder validations, and ensured production readiness for user-facing features.",
        "Collaborated with DevOps Teams for Helm deployments, VPC migrations, database refreshes, and MySQL 8.0 Upgrades.",
        "Conducted Regression, Performance, Load, and Stress Testing to ensure system stability across pre-production and production environments, reducing critical production defects by 30%.",
        "Contributed to Root Cause Analysis (RCA), defect triaging, and release quality improvements in Agile delivery cycles.",
        "Performed Security and Accessibility Validation for high-usage APIs and frontend workflows.",
        "Utilized Microsoft Dynamics 365 for training center management and user activity monitoring.",
      ],
    },
  ] as Project[],

  skills: [
    { name: "Selenium WebDriver", category: "Automation", level: 95 },
    { name: "Hybrid Framework", category: "Automation", level: 92 },
    { name: "TestNG", category: "Automation", level: 90 },
    { name: "Cucumber (BDD)", category: "Automation", level: 88 },
    { name: "Appium", category: "Automation", level: 85 },
    { name: "Java", category: "Programming", level: 92 },
    { name: "SQL", category: "Programming", level: 90 },
    { name: "Rest Assured", category: "API Testing", level: 94 },
    { name: "Postman", category: "API Testing", level: 92 },
    { name: "Swagger UI", category: "API Testing", level: 90 },
    { name: "JMeter", category: "Performance", level: 90 },
    { name: "Apache Kafka", category: "Messaging & Events", level: 88 },
    { name: "Temporal Workflows", category: "Messaging & Events", level: 82 },
    { name: "Jenkins", category: "DevOps", level: 90 },
    { name: "Docker", category: "DevOps", level: 88 },
    { name: "Kubernetes", category: "DevOps", level: 85 },
    { name: "Terraform", category: "DevOps", level: 82 },
    { name: "Maven & Nexus", category: "Build Tools", level: 88 },
    { name: "Argo CD", category: "DevOps", level: 80 },
    { name: "MySQL (Master-Slave)", category: "Databases", level: 88 },
    { name: "Redis", category: "Databases", level: 85 },
    { name: "Datadog", category: "Monitoring", level: 86 },
    { name: "Grafana", category: "Monitoring", level: 86 },
    { name: "GCP", category: "DevOps", level: 82 },
    { name: "Git & GitLab", category: "DevOps", level: 92 },
  ] as Skill[],

  education: [
    {
      institution: "Halmstad University, Sweden",
      degree: "Master's in Mechanical Engineering",
      period: "2021",
      description: ["Advanced computational modeling, analytical research & engineering systems."],
    },
    {
      institution: "Mahaveer Institute of Science and Technology, Hyderabad",
      degree: "Bachelor's in Mechanical Engineering",
      period: "2013 – 2017",
      description: ["Engineering mathematics, structured problem solving & systems engineering."],
    },
  ] as Education[],

  certifications: [
    {
      title: "DevOps Certification Training – Eureka",
      issuer: "Eureka (In Progress)",
      date: "2025",
    },
    {
      title: "Continuous Integration & Continuous Deployment (CI/CD)",
      issuer: "DevOps / SDLC Academy",
      date: "2024",
    },
    {
      title: "Docker, Jenkins, Kubernetes, Terraform & Configuration Management",
      issuer: "Cloud & Container Systems",
      date: "2024",
    },
    {
      title: "Git & Build Automation in SDLC",
      issuer: "Software Delivery Lifecycle",
      date: "2023",
    },
  ] as Certification[],

  achievements: [
    "5+ years of experience in QA Automation, API Testing, and Fintech Systems.",
    "Expertise in Selenium, Rest Assured, Java, Kafka, Jenkins, and MySQL.",
    "Strong domain expertise in Payment Gateways, Cross-Border Remittances & Microservices.",
    "Automated REST APIs reducing manual regression execution time by 40-60%.",
    "Validated Kafka asynchronous transaction workflows, reducing reconciliation defects by 25%.",
    "Conducted JMeter load testing for high transaction volumes, boosting system stability by 35%.",
    "Proven track record in PCI-DSS compliance, 3DS authentication, and ISO8583 message switch validation.",
    "Hands-on experience with Docker, Kubernetes, Helm deployments, and zero-defect CI/CD pipelines.",
  ],

  contact: {
    email: "kranthikumarkatta2006@gmail.com",
    phone: "+91 8466952706",
    linkedin: "https://linkedin.com/in/kranthi-kumar-katta-a40093318",
  },

  testimonials: [
    {
      name: "Priya Sharma",
      role: "Engineering Manager, PayU",
      text: "Kranthi completely transformed our QA pipeline. The automation framework he built reduced our regression cycle from 3 days to under 4 hours. His technical depth and communication are outstanding.",
      rating: 5,
    },
    {
      name: "Rajesh Varma",
      role: "CTO, Barraq Technology Lab",
      text: "One of the most disciplined engineers I have worked with. Kranthi built a cross-border remittance test suite from scratch that caught critical bugs before production. His attention to edge cases is remarkable.",
      rating: 5,
    },
    {
      name: "Ananya Patel",
      role: "Product Lead, Impelsys",
      text: "Kranthi's performance engineering work on our healthcare platform was game-changing. Load test results directly informed architecture decisions that improved throughput by 60%.",
      rating: 5,
    },
    {
      name: "Suresh Reddy",
      role: "VP Engineering, Wibmo",
      text: "Kranthi brings a rare combination of automation expertise and genuine curiosity. He does not just write tests — he understands the product deeply and finds issues nobody else catches.",
      rating: 5,
    },
    {
      name: "Deepa Nair",
      role: "QA Director, GlobalEdge",
      text: "Kranthi mentored our junior QA team with patience and clarity. Within three months, the team was writing production-grade automation independently. His documentation is also exemplary.",
      rating: 5,
    },
  ] as Testimonial[],

  techStack: {
    ring1: ["Next.js", "React", "TypeScript", "Selenium", "Playwright", "Cypress"],
    ring2: ["Java", "Python", "PostgreSQL", "AWS", "Docker", "Redis"],
    ring3: ["GraphQL", "Tailwind", "Jenkins", "Supabase", "Prisma"],
    stats: [
      { num: "17+", label: "TECHNOLOGIES" },
      { num: "5+", label: "CLOUD PLATFORMS" },
      { num: "10+", label: "FRAMEWORKS" },
      { num: "3+", label: "CI/CD TOOLS" },
    ],
    description: "I CONNECT TOOLS INTO ONE SYSTEM, ELIMINATING MANUAL WORK AND SAVING TIME.",
  } as TechStack,

  pricing: [
    {
      name: "CONSULTATION",
      description: "FOR TEAMS NEEDING\nQUICK EXPERT ADVICE",
      monthlyPrice: 1500,
      annualPrice: 1200,
      features: [
        "1-on-1 strategy session",
        "QA audit & recommendations",
        "Framework selection guidance",
        "Email support",
      ],
      cta: "BOOK A SESSION",
      popular: false,
    },
    {
      name: "PROJECT",
      description: "FOR COMPANIES\nREADY FOR AUTOMATION",
      monthlyPrice: 8500,
      annualPrice: 7200,
      features: [
        "End-to-end test automation",
        "CI/CD pipeline setup",
        "Custom framework build",
        "Priority support",
      ],
      cta: "START A PROJECT",
      popular: true,
    },
    {
      name: "RETAINER",
      description: "FOR ORGANIZATIONS\nWITH ONGOING NEEDS",
      monthlyPrice: 15000,
      annualPrice: 12500,
      features: [
        "Dedicated QA engineering",
        "Continuous test maintenance",
        "Performance monitoring",
        "Enterprise integrations",
      ],
      cta: "GET THE PLAN",
      popular: false,
    },
  ] as PricingTier[],

  faqs: [
    {
      q: "What types of projects do you take on?",
      a: "I specialize in test automation frameworks, performance engineering, full-stack web applications, and AI/LLM integrations. I work best on projects that need reliable, scalable quality infrastructure — from greenfield builds to legacy modernization.",
    },
    {
      q: "Do clients need technical knowledge to get started?",
      a: "Not at all. I translate business requirements into technical solutions. You describe what you need — faster releases, better test coverage, a new feature — and I handle the architecture, implementation, and documentation.",
    },
    {
      q: "Which tools and platforms do you work with?",
      a: "My core stack includes Java, Python, TypeScript, Selenium, Playwright, Cypress, Next.js, React, AWS, Docker, PostgreSQL, and Redis. I adapt to whatever your team already uses and recommend additions where they add real value.",
    },
    {
      q: "How long does a typical project take?",
      a: "A focused test automation framework: 2-4 weeks. A full-stack web application: 6-12 weeks. Performance engineering engagement: 2-6 weeks. Every project starts with a clear scope and milestone plan so there are no surprises.",
    },
    {
      q: "Can you work with our existing software and workflows?",
      a: "Yes — that is actually where I add the most value. I integrate into your existing CI/CD pipelines, extend current test suites, and improve what is already there rather than forcing a rewrite. The goal is to enhance, not replace.",
    },
    {
      q: "What is your approach to documentation?",
      a: "Every framework I build ships with comprehensive documentation: architecture diagrams, setup guides, contribution guidelines, and runbooks. I believe code that cannot be understood by your team in 6 months is code that will eventually be replaced.",
    },
  ] as FAQ[],
};

/**
 * Serialize the typed resume data into markdown for the AI assistant's system
 * prompt. Single source of truth — the UI and the AI can no longer diverge.
 */
export function resumeToMarkdown(): string {
  const {
    name,
    title,
    summary,
    skills,
    experience,
    projects,
    certifications,
    education,
    achievements,
    contact,
  } = resumeData;

  const lines: string[] = [];

  lines.push(`# ${name} — ${title}`);
  lines.push("");
  lines.push("## Contact");
  lines.push(`- Email: ${contact.email}`);
  lines.push(`- Phone: ${contact.phone}`);
  lines.push(`- LinkedIn: ${contact.linkedin}`);
  lines.push(`- Location: ${resumeData.location}`);
  lines.push("");
  lines.push("## Summary");
  lines.push(summary);
  lines.push("");
  lines.push("## Technical Skills");
  const byCategory = new Map<string, string[]>();
  for (const skill of skills ?? []) {
    const cat = byCategory.get(skill.category) ?? [];
    cat.push(`${skill.name}${skill.level ? ` (${skill.level}%)` : ""}`);
    byCategory.set(skill.category, cat);
  }
  for (const [category, skillNames] of byCategory) {
    lines.push(`- **${category}:** ${skillNames.join(", ")}`);
  }
  lines.push("");
  lines.push("## Experience");
  for (const exp of experience ?? []) {
    lines.push(`### ${exp.role} — ${exp.company}`);
    lines.push(`**${exp.period}${exp.location ? `, ${exp.location}` : ""}**`);
    lines.push("");
    for (const bullet of exp.description) {
      lines.push(`- ${bullet}`);
    }
    lines.push("");
  }
  lines.push("## Projects");
  (projects ?? []).forEach((project, i) => {
    lines.push(`### ${i + 1}. ${project.title}`);
    lines.push(`**${project.period ?? "N/A"}**`);
    lines.push(`- Tech Stack: ${project.technologies.join(", ")}`);
    lines.push("");
    lines.push(project.description);
    if (project.keyContributions?.length) {
      lines.push("");
      lines.push("Key Contributions:");
      for (const detail of project.keyContributions) {
        lines.push(`- ${detail}`);
      }
    }
    lines.push("");
  });
  lines.push("## Certifications");
  for (const cert of certifications ?? []) {
    lines.push(`- ${cert.title} – ${cert.issuer} (${cert.date})`);
  }
  lines.push("");
  lines.push("## Education");
  for (const edu of education ?? []) {
    lines.push(`**${edu.degree}**`);
    lines.push(`${edu.institution}`);
    lines.push(`Graduated: ${edu.period}${edu.description?.length ? ` | ${edu.description.join(" | ")}` : ""}`);
  }
  lines.push("");
  if (achievements?.length) {
    lines.push("## Key Achievements");
    for (const a of achievements) {
      lines.push(`- ${a}`);
    }
    lines.push("");
  }

  return lines.join("\n").trim() + "\n";
}

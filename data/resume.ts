export interface Experience {
  company: string;
  role: string;
  period: string;
  location?: string;
  description: string[];
  technologies?: string[];
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  image?: string;
  period?: string;
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

export const resumeData = {
  name: "Kranthi Kumar Katta",
  title: "Senior SDET | Automation Expert",
  email: "kranthikumarkattatech@gmail.com",
  phone: "+91 7013782652",
  github: "https://github.com/kranthi946",
  linkedin: "https://linkedin.com/in/kranthikumarkatta",
  location: "Bangalore, India",
  summary: "Senior SDET with 5+ years of experience in designing, developing, and executing comprehensive test automation frameworks for enterprise-grade web, mobile, API, and microservices applications. Proven expertise in Selenium, Playwright, API testing (Postman, REST Assured), performance testing (JMeter), and building CI/CD-integrated test pipelines.",

  experience: [
    {
      company: "Barraq Technology Lab India Private Limited",
      role: "SDET 2",
      period: "June 2025 – Present",
      location: "Bangalore",
      description: [
        "Led end-to-end test automation for cross-border remittance workflows using Playwright and Java across distributed microservices.",
        "Designed and executed functional, regression, integration, and UAT test suites for ISO8583 message flows, switch-layer routing, and T+1/T+2 settlement reconciliation.",
        "Validated PCI-DSS compliance and SWIFT messaging integration, ensuring zero critical defects in production.",
        "Automated transaction lifecycle testing from initiation through settlement with Kafka event-driven validation.",
        "Implemented data-driven testing with parameterized suites, reducing manual testing effort by 60%.",
      ],
      technologies: ["Playwright", "Java", "REST Assured", "Docker", "Jenkins", "Kafka", "ISO8583", "SWIFT", "PCI-DSS"],
    },
    {
      company: "American Heart Association (Impelsys)",
      role: "QA Engineer",
      period: "June 2021 – February 2025",
      location: "Remote",
      description: [
        "Managed QA pipelines and validation processes for digital platform releases in healthcare domain.",
        "Developed and maintained automation frameworks for web applications.",
        "Performed regression, functional, and integration testing across multiple browser environments.",
        "Automated critical user journeys for learning management systems and certification platforms.",
      ],
      technologies: ["Selenium", "Java", "Docker", "Jenkins", "JIRA"],
    },
    {
      company: "PayU Digital Labs Private Limited (Wibmo)",
      role: "QA Engineer",
      period: "March 2022 – June 2025",
      location: "Bangalore",
      description: [
        "Performed Functional, Regression, and Integration Testing for Payment Gateway Applications.",
        "Validated payment lifecycle, settlement reconciliation (T+1, T+2), switch-layer routing logic, and PCI-DSS compliance.",
        "Developed JMeter test scripts simulating 10,000+ concurrent users for load testing.",
        "Reduced manual testing effort by 60% through comprehensive automation frameworks.",
        "Reduced infrastructure costs by 30% through performance engineering.",
      ],
      technologies: ["Selenium", "JMeter", "REST Assured", "Postman", "Java", "SQL", "Jenkins"],
    },
  ] as Experience[],

  projects: [
    {
      title: "Cross-Border Remittance Test Automation Suite",
      description: "Built comprehensive end-to-end automation framework for high-throughput international remittance workflows. Automated ISO8583/SWIFT message validation, Kafka event-driven flows, and multi-vendor MTO integrations. Reduced manual testing by 60%.",
      technologies: ["Playwright", "Java", "REST Assured", "Docker", "Jenkins", "Kafka"],
      period: "Mar 2025 – Jun 2025",
    },
    {
      title: "Microservices Test Automation Framework",
      description: "Designed contract testing frameworks with REST Assured for API validation. Automated end-to-end regression testing with Selenium across 1000+ test suites. Docker-based test environments reduced release cycle time by 40%.",
      technologies: ["Spring Boot", "REST Assured", "Java", "Docker", "Selenium", "JUnit"],
      period: "Oct 2022 – Feb 2025",
    },
    {
      title: "Performance Engineering Framework",
      description: "Created performance engineering framework for payment gateway handling millions of daily transactions. JMeter scripts simulating 10,000+ concurrent users. Grafana dashboards for real-time monitoring. Reduced infrastructure costs by 30%.",
      technologies: ["JMeter", "Grafana", "k6", "SQL", "Jenkins"],
      period: "Mar 2022 – Jun 2025",
    },
    {
      title: "API Test Automation Framework",
      description: "Built comprehensive API test automation for 200+ endpoints using REST Assured. Contract testing with Pact framework. Reduced production API defects by 35%.",
      technologies: ["REST Assured", "Postman", "Java", "SQL", "Jenkins"],
      period: "Jun 2023 – Jun 2025",
    },
  ] as Project[],

  skills: [
    { name: "Selenium", category: "Automation", level: 90 },
    { name: "Playwright", category: "Automation", level: 88 },
    { name: "TestNG", category: "Automation", level: 85 },
    { name: "JUnit", category: "Automation", level: 82 },
    { name: "Java", category: "Programming", level: 92 },
    { name: "Python", category: "Programming", level: 75 },
    { name: "SQL", category: "Programming", level: 80 },
    { name: "Postman", category: "API Testing", level: 88 },
    { name: "REST Assured", category: "API Testing", level: 90 },
    { name: "JMeter", category: "Performance", level: 87 },
    { name: "Grafana", category: "Performance", level: 80 },
    { name: "k6", category: "Performance", level: 78 },
    { name: "Maven", category: "Build Tools", level: 85 },
    { name: "Docker", category: "DevOps", level: 82 },
    { name: "Jenkins", category: "DevOps", level: 85 },
    { name: "Git", category: "DevOps", level: 90 },
    { name: "GitHub Actions", category: "DevOps", level: 80 },
    { name: "Linux", category: "DevOps", level: 78 },
  ] as Skill[],

  education: [
    {
      institution: "JNTUK (Jawaharlal Nehru Technological University, Kakinada)",
      degree: "Bachelor of Technology (B.Tech) — Computer Science and Engineering",
      period: "2014 – 2018",
      description: ["CGPA: 8.1"],
    },
  ] as Education[],

  certifications: [
    {
      title: "AWS Cloud Practitioner",
      issuer: "Amazon Web Services",
      date: "2024",
    },
    {
      title: "ISTQB Certified Tester Foundation Level (CTFL)",
      issuer: "ISTQB",
      date: "2023",
    },
    {
      title: "Oracle Certified Professional: Java SE11 Developer",
      issuer: "Oracle",
      date: "2022",
    },
    {
      title: "Microsoft Certified: Azure AI Fundamentals",
      issuer: "Microsoft",
      date: "2024",
    },
  ] as Certification[],

  contact: {
    email: "kranthikumarkattatech@gmail.com",
    phone: "+91 7013782652",
    github: "https://github.com/kranthi946",
    linkedin: "https://linkedin.com/in/kranthikumarkatta",
  },
};

/**
 * Full resume data extracted from Kranthi Kumar Katta's resume.
 * Used as context for the AI assistant.
 */
export const fullResume = `
# Kranthi Kumar Katta — Senior SDET

## Contact
- Email: kranthikumarkattatech@gmail.com
- Phone: +91 7013782652
- LinkedIn: linkedin.com/in/kranthikumarkatta
- GitHub: github.com/kranthi946
- Location: Bangalore, India

## Summary
Senior SDET with 5+ years of experience in designing, developing, and executing comprehensive test automation frameworks for enterprise-grade web, mobile, API, and microservices applications. Proven expertise in Selenium, Playwright, API testing (Postman, REST Assured), performance testing (JMeter), and building CI/CD-integrated test pipelines.

## Technical Skills
- **Programming:** Java (Expert), Python, SQL
- **Automation:** Selenium WebDriver (Advanced), Playwright, TestNG, JUnit, Maven
- **API Testing:** Postman, REST Assured
- **Performance Testing:** JMeter, Grafana, k6
- **CI/CD Tools:** Jenkins, GitHub Actions, Docker, Git
- **Other Tools:** Linux, MySQL, Postman, Swagger, JIRA

## Experience

### SDET 2 — Barraq Technology Lab India Private Limited
**June 2025 – Present, Bangalore**

- Led end-to-end test automation for cross-border remittance workflows using Playwright and Java across distributed microservices handling high-volume money transfers internationally.
- Designed and executed functional, regression, integration, and UAT test suites for ISO8583 message flows, switch-layer routing logic, and T+1/T+2 settlement reconciliation.
- Validated PCI-DSS compliance and SWIFT messaging integration, ensuring zero critical defects in production.
- Automated transaction lifecycle testing from initiation through settlement with Kafka event-driven validation.
- Collaborated with cross-functional teams in a SAFe Agile environment, participating in sprint planning, backlog grooming, and release coordination.
- Implemented data-driven testing with parameterized suites, reducing manual testing effort by 60%.

### QA Engineer — American Heart Association (Impelsys)
**June 2021 – February 2025, Remote**

- Managed QA pipelines and validation processes for digital platform releases in healthcare domain.
- Developed and maintained automation frameworks for web applications.
- Performed regression, functional, and integration testing across multiple browser environments.
- Participated in sprint planning, backlog grooming, and release coordination.
- Automated critical user journeys for learning management systems and certification platforms.

### QA Engineer — PayU Digital Labs Private Limited (Wibmo)
**March 2022 – June 2025, Bangalore**

- Performed Functional, Regression, and Integration Testing for Payment Gateway Applications.
- Validated payment lifecycle, settlement reconciliation (T+1, T+2), switch-layer routing logic, and PCI-DSS compliance.
- Automated critical business flows for payment gateway and card management systems.
- Designed and executed test plans, test cases, and defect tracking using JIRA.
- Reduced manual testing effort by 60% through comprehensive automation frameworks.

## Projects

### 1. Cross-Border Remittance Test Automation Suite
**Barraq Technology Lab | Mar 2025 – Jun 2025**
- Tech Stack: Playwright, Java, REST Assured, Docker, Jenkins, Kafka

Built comprehensive end-to-end automation framework designed for high-throughput international remittance workflows, supporting asynchronous Kafka event streams, compliance checks, and multi-vendor MTO integrations.

Key Contributions:
- Architected a modular keyword-driven test framework using Playwright and Java for ISO8583 and SWIFT message validation.
- Automated transaction lifecycle testing from initiation through settlement with Kafka event-driven validation.
- Developed REST API test suites for switch-layer routing, ensuring compliance with PCI-DSS and SWIFT integration.
- Integrated automated tests into Jenkins CI/CD pipeline for continuous validation on every build.
- Created data-driven testing framework with parameterized test suites, reducing manual testing effort by 60%.
- Collaborated with cross-functional teams across time zones in a SAFe Agile environment.

### 2. Microservices Test Automation Framework
**Impelsys | Oct 2022 – Feb 2025**
- Tech Stack: Spring Boot, REST Assured, Java, Docker, Selenium, JUnit

Developed scalable, independent, and maintainable test automation frameworks for a microservices-based digital platform supporting healthcare learning solutions.

Key Contributions:
- Designed and implemented contract testing frameworks using REST Assured for API validation.
- Automated end-to-end regression testing with Selenium across 1000+ test suites.
- Developed Docker-based test environments ensuring consistent test execution across development, staging, and production.
- Created data-driven test frameworks using JUnit and TestNG for parameterized testing.
- Implemented CI/CD integration using Jenkins, reducing release cycle time by 40%.

### 3. Performance Engineering Framework
**PayU | Mar 2022 – Jun 2025**
- Tech Stack: JMeter, Grafana, k6, SQL, Jenkins

Created performance engineering framework for payment gateway platform handling millions of daily transactions.

Key Contributions:
- Developed JMeter test scripts simulating 10,000+ concurrent users for payment processing load testing.
- Automated performance regression testing integrated with CI/CD pipeline using Jenkins.
- Created Grafana dashboards for real-time performance monitoring and alerting.
- Implemented k6 scripts for cloud-native load testing of microservices.
- Identified and resolved performance bottlenecks, reducing infrastructure costs by 30%.

### 4. API Test Automation Framework
**PayU | Jun 2023 – Jun 2025**
- Tech Stack: REST Assured, Postman, Java, SQL, Jenkins

Built comprehensive API test automation framework for payment gateway services.

Key Contributions:
- Developed REST Assured-based test suites covering 200+ API endpoints.
- Created Postman collections for API validation and documentation.
- Implemented contract testing between microservices using Pact framework.
- Automated API performance testing with JMeter for critical payment flows.
- Reduced production API defects by 35% through systematic test automation.

## Certifications
- AWS Cloud Practitioner – Amazon Web Services (2024)
- ISTQB Certified Tester Foundation Level (CTFL) – ISTQB (2023)
- Oracle Certified Professional: Java SE11 Developer – Oracle (2022)
- Microsoft Certified: Azure AI Fundamentals – Microsoft (2024)

## Education
**Bachelor of Technology (B.Tech) — Computer Science and Engineering**
JNTUK (Jawaharlal Nehru Technological University, Kakinada)
Graduated: 2014–2018 | CGPA: 8.1

## Key Achievements
- Scaled test suites from 150 to 1000+ scripts with 95% pass rate.
- Reduced manual testing effort by 60% through end-to-end automation frameworks.
- Automated 25 critical business flows, accelerating release cycles by 40%.
- Designed frameworks handling 10,000+ concurrent virtual users for load testing.
- Reduced production defect leakage by 35% through proactive API test automation.
- Improved system efficiency by 40% through performance engineering at PayU.
`;

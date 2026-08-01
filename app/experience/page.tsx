import { Metadata } from 'next';
import { Section } from '../components/layout/Section';
import { Container } from '../components/layout/Container';
import { Heading } from '../components/typography/Heading';
import { Timeline } from '../sections/Timeline';

// Experience data from resume
const experiences = [
  {
    id: 'senior-engineer-2020',
    company: 'Tech Solutions Inc.',
    role: 'Senior Software Engineer',
    startDate: '2020',
    endDate: 'Present',
    description: 'Leading the development of enterprise-level applications using React, Next.js, and TypeScript. Responsible for architectural decisions, code reviews, and mentoring junior developers.',
    achievements: [
      'Architected and implemented a scalable microservices architecture that reduced server response time by 40%',
      'Led a team of 5 developers to deliver a complex dashboard application within tight deadlines',
      'Implemented CI/CD pipelines that reduced deployment time from 30 minutes to under 5 minutes',
      'Mentored 3 junior developers, helping them grow into mid-level engineers',
      'Introduced TypeScript across the codebase, reducing runtime errors by 60%'
    ],
    location: 'Hyderabad, India'
  },
  {
    id: 'software-engineer-2017',
    company: 'InnovateTech Solutions',
    role: 'Software Engineer',
    startDate: '2017',
    endDate: '2020',
    description: 'Developed and maintained web applications for financial services clients. Focused on building responsive, accessible, and high-performance user interfaces.',
    achievements: [
      'Built a real-time data visualization dashboard using D3.js and React',
      'Optimized application performance, achieving 90+ Lighthouse scores',
      'Implemented comprehensive test coverage, increasing from 60% to 95%',
      'Collaborated with UX designers to create intuitive user experiences',
      'Reduced critical bugs by 70% through improved testing and monitoring'
    ],
    location: 'Hyderabad, India'
  },
  {
    id: 'associate-engineer-2014',
    company: 'WebTech Solutions',
    role: 'Associate Software Engineer',
    startDate: '2014',
    endDate: '2017',
    description: 'Started career as a frontend developer, working on various web applications using JavaScript, jQuery, and early React versions.',
    achievements: [
      'Developed and maintained multiple client websites and web applications',
      'Transitioned the team from jQuery to React, improving development efficiency',
      'Implemented responsive design principles across all projects',
      'Created reusable component libraries that reduced development time by 30%',
      'Received recognition for outstanding contributions to client projects'
    ],
    location: 'Hyderabad, India'
  }
];

export const metadata: Metadata = {
  title: 'Experience | Kranthi Kumar Katta',
  description: 'Professional experience and career journey of Kranthi Kumar Katta, Senior Software Engineer.',
};

export default function ExperiencePage() {
  return (
    <main>
      <Section className="py-16 md:py-24">
        <Container>
          <Heading level={1} className="mb-12 text-center">
            Professional Experience
          </Heading>
          
          <Timeline experiences={experiences} />
        </Container>
      </Section>
    </main>
  );
}
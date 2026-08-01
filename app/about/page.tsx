import { Metadata } from 'next';
import { Section } from '../components/layout/Section';
import { Container } from '../components/layout/Container';
import { Heading } from '../components/typography/Heading';
import { ProfileCard } from '../sections/ProfileCard';
import { SummaryText } from '../sections/SummaryText';

// Placeholder data from resume
const quickFacts = [
  { label: 'Experience', value: '10+ years' },
  { label: 'Location', value: 'Hyderabad, India' },
  { label: 'Certifications', value: 'AWS, Kubernetes, ISTQB' },
  { label: 'Education', value: 'M.Tech in Computer Science' },
  { label: 'Specialization', value: 'Full Stack Development' },
  { label: 'Current Role', value: 'Senior Software Engineer' }
];

const summarySections = [
  {
    title: 'Professional Summary',
    content: `Results-driven Senior Software Engineer with over 10 years of experience in designing, developing, and deploying scalable software solutions. Expertise in full-stack development with a strong focus on React, Next.js, TypeScript, and cloud technologies. Proven track record of delivering high-quality software in Agile environments with a passion for creating efficient, maintainable, and user-centric applications.`
  },
  {
    title: 'Technical Philosophy',
    content: `I believe in writing clean, maintainable code that solves real business problems. My approach combines technical excellence with user-centric design, ensuring that the software I build is both powerful and intuitive. I'm passionate about leveraging modern technologies to create scalable solutions that drive business growth and innovation.`
  }
];

export const metadata: Metadata = {
  title: 'About | Kranthi Kumar Katta',
  description: 'Learn more about Kranthi Kumar Katta, a Senior Software Engineer with expertise in React, Next.js, TypeScript, and cloud technologies.',
};

export default function AboutPage() {
  return (
    <main>
      <Section className="py-16 md:py-24">
        <Container>
          <Heading level={1} className="mb-12 text-center">
            About Me
          </Heading>
          
          <div className="mb-16">
            <ProfileCard
              name="Kranthi Kumar Katta"
              title="Senior Software Engineer | Full Stack Developer"
              imageSrc="/images/portrait.jpg"
              quickFacts={quickFacts}
            />
          </div>
          
          <SummaryText sections={summarySections} />
        </Container>
      </Section>
    </main>
  );
}
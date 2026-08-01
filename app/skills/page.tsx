import { Metadata } from 'next';
import { Section } from '../components/layout/Section';
import { Container } from '../components/layout/Container';
import { Heading } from '../components/typography/Heading';
import { SkillCategoryGrid } from '../sections/SkillCategoryGrid';

// Skills data from resume
const skillCategories = [
  {
    title: 'Programming Languages',
    skills: [
      { name: 'TypeScript', proficiency: 95, icon: 'typescript' },
      { name: 'JavaScript', proficiency: 95, icon: 'javascript' },
      { name: 'Python', proficiency: 85, icon: 'python' },
      { name: 'Java', proficiency: 80, icon: 'java' },
      { name: 'C#', proficiency: 75, icon: 'csharp' },
      { name: 'Go', proficiency: 70, icon: 'go' }
    ]
  },
  {
    title: 'Frontend Development',
    skills: [
      { name: 'React', proficiency: 95, icon: 'react' },
      { name: 'Next.js', proficiency: 90, icon: 'nextjs' },
      { name: 'Redux', proficiency: 85, icon: 'redux' },
      { name: 'HTML5', proficiency: 95, icon: 'html' },
      { name: 'CSS3', proficiency: 90, icon: 'css' },
      { name: 'Tailwind CSS', proficiency: 85, icon: 'tailwind' }
    ]
  },
  {
    title: 'Backend Development',
    skills: [
      { name: 'Node.js', proficiency: 90, icon: 'nodejs' },
      { name: 'Express', proficiency: 85, icon: 'express' },
      { name: 'NestJS', proficiency: 80, icon: 'nestjs' },
      { name: 'REST API', proficiency: 95, icon: 'api' },
      { name: 'GraphQL', proficiency: 80, icon: 'graphql' },
      { name: 'WebSockets', proficiency: 75, icon: 'websocket' }
    ]
  },
  {
    title: 'Cloud & DevOps',
    skills: [
      { name: 'AWS', proficiency: 85, icon: 'aws' },
      { name: 'Docker', proficiency: 80, icon: 'docker' },
      { name: 'Kubernetes', proficiency: 75, icon: 'kubernetes' },
      { name: 'CI/CD', proficiency: 85, icon: 'cicd' },
      { name: 'Terraform', proficiency: 70, icon: 'terraform' },
      { name: 'Serverless', proficiency: 75, icon: 'serverless' }
    ]
  },
  {
    title: 'Testing & QA',
    skills: [
      { name: 'Jest', proficiency: 90, icon: 'jest' },
      { name: 'Cypress', proficiency: 85, icon: 'cypress' },
      { name: 'Playwright', proficiency: 80, icon: 'playwright' },
      { name: 'Mocha', proficiency: 85, icon: 'mocha' },
      { name: 'Chai', proficiency: 85, icon: 'chai' },
      { name: 'Selenium', proficiency: 80, icon: 'selenium' }
    ]
  },
  {
    title: 'Databases',
    skills: [
      { name: 'PostgreSQL', proficiency: 85, icon: 'postgresql' },
      { name: 'MongoDB', proficiency: 80, icon: 'mongodb' },
      { name: 'Redis', proficiency: 75, icon: 'redis' },
      { name: 'MySQL', proficiency: 80, icon: 'mysql' },
      { name: 'DynamoDB', proficiency: 70, icon: 'dynamodb' }
    ]
  }
];

export const metadata: Metadata = {
  title: 'Skills | Kranthi Kumar Katta',
  description: 'Technical skills and proficiencies of Kranthi Kumar Katta, Senior Software Engineer.',
};

export default function SkillsPage() {
  return (
    <main>
      <Section className="py-16 md:py-24">
        <Container>
          <Heading level={1} className="mb-12 text-center">
            Technical Skills
          </Heading>
          
          <SkillCategoryGrid categories={skillCategories} />
        </Container>
      </Section>
    </main>
  );
}
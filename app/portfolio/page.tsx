import { Metadata } from 'next';
import { Section } from '../components/layout/Section';
import { Container } from '../components/layout/Container';
import { Heading } from '../components/typography/Heading';
import { ProjectGrid } from '../sections/ProjectGrid';

import projects from '../data/projects.json';

export const metadata: Metadata = {
  title: 'Portfolio | Kranthi Kumar Katta',
  description: 'Explore the projects and work of Kranthi Kumar Katta, Senior Software Engineer.',
};

export default function PortfolioPage() {
  return (
    <main>
      <Section className="py-16 md:py-24">
        <Container>
          <Heading level={1} className="mb-12 text-center">
            My Projects
          </Heading>
          
          <ProjectGrid projects={projects} />
        </Container>
      </Section>
    </main>
  );
}
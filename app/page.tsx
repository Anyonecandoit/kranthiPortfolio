import { Metadata } from 'next';
import { Section } from './components/layout/Section';
import { Container } from './components/layout/Container';
import { Heading } from './components/typography/Heading';
import { Text } from './components/typography/Text';
import { Button } from './components/Button';
import { FadeIn } from './components/animations/FadeIn';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Kranthi Kumar Katta | Senior Software Engineer',
  description: 'Senior Software Engineer specializing in React, Next.js, TypeScript, and cloud technologies. Building scalable, high-performance web applications.',
};

const heroContent = {
  name: 'Kranthi Kumar Katta',
  title: 'Senior Software Engineer',
  subtitle: 'Building scalable, high-performance web applications with modern technologies',
  ctaPrimary: 'View My Work',
  ctaSecondary: 'Download Resume'
};

const aboutPreview = {
  title: 'About Me',
  content: 'Results-driven Senior Software Engineer with over 10 years of experience in designing, developing, and deploying scalable software solutions. Expertise in full-stack development with a strong focus on React, Next.js, TypeScript, and cloud technologies.',
  cta: 'Learn More'
};

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <Section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <Container className="text-center">
          <FadeIn delay={0.2}>
            <Heading level={1} className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              {heroContent.name}
            </Heading>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <Text size="lg" className="text-accent-500 mb-4">
              {heroContent.title}
            </Text>
          </FadeIn>
          
          <FadeIn delay={0.6}>
            <Text size="lg" className="max-w-2xl mx-auto mb-8">
              {heroContent.subtitle}
            </Text>
          </FadeIn>
          
          <FadeIn delay={0.8}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg">
                <Link href="/portfolio" aria-label="View portfolio projects">
                  {heroContent.ctaPrimary}
                </Link>
              </Button>
              <Button variant="secondary" size="lg">
                <Link href="/kranthi kumar katta resume may 2026.pdf" download aria-label="Download resume PDF" prefetch={false}>
                  {heroContent.ctaSecondary}
                </Link>
              </Button>
            </div>
          </FadeIn>
        </Container>
      </Section>

      {/* About Preview Section */}
      <Section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <Container>
          <FadeIn delay={0.2}>
            <div className="max-w-4xl mx-auto">
              <Heading level={2} className="mb-6">
                {aboutPreview.title}
              </Heading>
              <Text size="md" className="mb-8 whitespace-pre-line">
                {aboutPreview.content}
              </Text>
              <Button variant="primary">
                <Link href="/about" aria-label="Learn more about me">
                  {aboutPreview.cta}
                </Link>
              </Button>
            </div>
          </FadeIn>
        </Container>
      </Section>

      {/* Quick Navigation */}
      <Section className="py-16 md:py-24">
        <Container>
          <FadeIn delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-shadow">
                <Heading level={3} className="mb-4">
                  Experience
                </Heading>
                <Text size="md" className="mb-4">
                  10+ years building enterprise applications
                </Text>
                <Button variant="secondary" size="sm">
                  <Link href="/experience" aria-label="View professional experience">
                    View Experience
                  </Link>
                </Button>
              </div>
              
              <div className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-shadow">
                <Heading level={3} className="mb-4">
                  Skills
                </Heading>
                <Text size="md" className="mb-4">
                  Full-stack expertise across modern technologies
                </Text>
                <Button variant="secondary" size="sm">
                  <Link href="/skills" aria-label="View technical skills">
                    View Skills
                  </Link>
                </Button>
              </div>
              
              <div className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-shadow">
                <Heading level={3} className="mb-4">
                  Contact
                </Heading>
                <Text size="md" className="mb-4">
                  Get in touch for collaborations or opportunities
                </Text>
                <Button variant="secondary" size="sm">
                  <Link href="/contact" aria-label="Contact me for opportunities">
                    Contact Me
                  </Link>
                </Button>
              </div>
            </div>
          </FadeIn>
        </Container>
      </Section>
    </main>
  );
}

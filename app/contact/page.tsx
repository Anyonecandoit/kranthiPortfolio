import { Metadata } from 'next';
import { Section } from '../components/layout/Section';
import { Container } from '../components/layout/Container';
import { Heading } from '../components/typography/Heading';
import { Text } from '../components/typography/Text';
import { ContactForm } from '../sections/ContactForm';
import { SocialLinks } from '../sections/SocialLinks';
import { Button } from '../components/Button';
import Link from 'next/link';

// Social links data
const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/kranthikatta',
    icon: 'github'
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/kranthikatta',
    icon: 'linkedin'
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/kranthikatta',
    icon: 'twitter'
  },
  {
    name: 'Email',
    url: 'mailto:kranthi.katta@example.com',
    icon: 'email'
  }
];

export const metadata: Metadata = {
  title: 'Contact | Kranthi Kumar Katta',
  description: 'Get in touch with Kranthi Kumar Katta, Senior Software Engineer. Reach out for collaborations, opportunities, or just to say hello.',
  openGraph: {
    title: 'Contact | Kranthi Kumar Katta',
    description: 'Get in touch with Kranthi Kumar Katta, Senior Software Engineer. Reach out for collaborations, opportunities, or just to say hello.',
    url: 'https://kranthikatta.com/contact',
    siteName: 'Kranthi Kumar Katta Portfolio',
    images: [
      {
        url: 'https://kranthikatta.com/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kranthi Kumar Katta Portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact | Kranthi Kumar Katta',
    description: 'Get in touch with Kranthi Kumar Katta, Senior Software Engineer. Reach out for collaborations, opportunities, or just to say hello.',
    images: ['https://kranthikatta.com/images/twitter-image.jpg'],
  },
};

export default function ContactPage() {
  return (
    <main>
      <Section className="py-16 md:py-24">
        <Container>
          <Heading level={1} className="mb-12 text-center">
            Get In Touch
          </Heading>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <Heading level={2} className="mb-4">
                  Contact Information
                </Heading>
                <Text size="md" className="mb-4">
                  I'm always open to discussing new projects, creative ideas, or opportunities to collaborate. Feel free to reach out through the form or connect with me on social media.
                </Text>
                
                <Text size="md" className="mb-2">
                  <strong>Email:</strong> kranthi.katta@example.com
                </Text>
                <Text size="md" className="mb-2">
                  <strong>Phone:</strong> +91 98765 43210
                </Text>
                <Text size="md" className="mb-2">
                  <strong>Location:</strong> Hyderabad, India
                </Text>
              </div>
              
              <div>
                <Heading level={2} className="mb-4">
                  Connect With Me
                </Heading>
                <SocialLinks links={socialLinks} />
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <Heading level={2} className="mb-4">
                  Send Me a Message
                </Heading>
                <Text size="md" className="mb-4">
                  Fill out the form below and I'll get back to you as soon as possible.
                </Text>
                
                <ContactForm />
              </div>
              
              <div className="text-center">
                <Button variant="secondary">
                  <Link href="/kranthi kumar katta resume may 2026.pdf" download>
                    Download My Resume
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
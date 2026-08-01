import React from 'react';
import Link from 'next/link';

const socialLinks = [
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/kranthi-kumar-katta-a40093318',
  },
  {
    name: 'Email',
    href: 'mailto:kranthikumarkatta2006@gmail.com',
  },
];

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl py-8">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} Kranthi Kumar Katta. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          {socialLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-purple-300 transition-colors duration-300 text-sm"
              aria-label={`Visit my ${link.name} profile`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

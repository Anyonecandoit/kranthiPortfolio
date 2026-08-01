"use client";

import React from 'react';
import { Text } from '../components/typography/Text';
import { Heading } from '../components/typography/Heading';

interface SummarySection {
  title: string;
  content: string;
}

type SummaryTextProps = {
  sections: SummarySection[];
  className?: string;
};

export const SummaryText: React.FC<SummaryTextProps> = ({
  sections,
  className = ''
}) => {
  return (
    <div className={`space-y-8 ${className}`}>
      {sections.map((section, index) => (
        <div key={index}>
          <Heading level={3} className="mb-3">
            {section.title}
          </Heading>
          <Text size="md" className="whitespace-pre-line">
            {section.content}
          </Text>
        </div>
      ))}
    </div>
  );
};
"use client";

import React from 'react';
import Image from 'next/image';
import { Card } from '../components/Card';
import { Text } from '../components/typography/Text';
import { Heading } from '../components/typography/Heading';

interface QuickFact {
  label: string;
  value: string;
}

type ProfileCardProps = {
  name: string;
  title: string;
  imageSrc: string;
  quickFacts: QuickFact[];
  className?: string;
};

export const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  title,
  imageSrc,
  quickFacts,
  className = ''
}) => {
  return (
    <Card className={`flex flex-col md:flex-row items-center ${className}`}>
      <div className="md:w-1/3 mb-6 md:mb-0 md:mr-6">
        <div className="relative w-48 h-48 rounded-full overflow-hidden mx-auto">
          <Image
            src={imageSrc}
            alt={`Portrait of ${name}`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 12rem, 12rem"
            quality={85}
          />
        </div>
      </div>
      <div className="md:w-2/3">
        <Heading level={2} className="mb-2">
          {name}
        </Heading>
        <Text size="lg" className="text-accent-500 mb-6">
          {title}
        </Text>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickFacts.map((fact, index) => (
            <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Text size="sm" className="text-text-secondary-light dark:text-text-secondary-dark">
                {fact.label}
              </Text>
              <Text size="md" className="font-medium">
                {fact.value}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
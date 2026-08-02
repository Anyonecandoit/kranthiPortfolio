'use client';

import { Cpu, Layers, ShieldCheck } from 'lucide-react';

export default function Skills() {
  const skillCategories = [
    {
      title: 'Automation & Frameworks',
      icon: <Cpu className="text-blue-400" size={20} />,
      skills: ['Java', 'Selenium WebDriver', 'Rest Assured', 'Appium', 'Cucumber (BDD)', 'TestNG']
    },
    {
      title: 'Event-Driven Architecture',
      icon: <Layers className="text-indigo-400" size={20} />,
      skills: ['Apache Kafka', 'Asynchronous Retries', 'Temporal Workflows', 'Microservices']
    },
    {
      title: 'Fintech & Compliance',
      icon: <ShieldCheck className="text-emerald-400" size={20} />,
      skills: ['PCI-DSS', '3DS Security', 'ISO8583 Routing', 'MoneyGram', 'Western Union']
    }
  ];

  return (
      <section className="max-w-5xl mx-auto px-6 py-8">
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-6">Core Competencies</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {skillCategories.map((category, index) => (
              <div
                  key={index}
                  className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/80 transition-all group backdrop-blur-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  {category.icon}
                </div>
                <h4 className="text-base font-semibold text-slate-200 mb-4">{category.title}</h4>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, sIdx) => (
                      <span
                          key={sIdx}
                          className="text-xs px-2.5 py-1 rounded-md bg-slate-800/50 text-slate-300 border border-slate-700/40"
                      >
                  {skill}
                </span>
                  ))}
                </div>
              </div>
          ))}
        </div>
      </section>
  );
}
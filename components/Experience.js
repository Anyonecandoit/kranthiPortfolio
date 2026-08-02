export default function Experience() {
  const experiences = [
    {
      company: 'Barraq Technology Lab India Pvt. Ltd.',
      role: 'SDET 2',
      location: 'Bangalore, India',
      period: '03 June 2025 – Present',
      project: 'BARQ – Cross-Border Remittance Platform',
      bullets: [
        'Performed E2E testing of international remittance workflows across Distributed Microservices Architecture.',
        'Automated REST APIs for beneficiary creation, FX rates, compliance, pre-commit, and commit workflows using Rest Assured.',
        'Validated Kafka-based asynchronous transaction processing, reducing transaction reconciliation issues by 25%.',
        'Tested integrations with MoneyGram, TerraPay, Western Union, Thunes, XE, and FinScan.',
        'Automated mobile application workflows using Appium and integrated suites with Jenkins CI/CD pipelines.'
      ]
    },
    {
      company: 'PayU Digital Labs Pvt. Ltd. (Wibmo)',
      role: 'QA Engineer',
      location: 'Bangalore, India',
      period: '03 March 2025 – 02 June 2025',
      project: 'Payment Gateway Platform',
      bullets: [
        'Validated full payment transaction lifecycle: initiation, routing, authorization, settlement (T+1/T+2), refunds, and chargebacks.',
        'Conducted Performance, Stress, and Load Testing with JMeter, improving stability by 35%.',
        'Executed PCI-DSS compliance validations, fraud rule checks, tokenization, and 3DS Security testing.',
        'Verified Switch-Layer Routing Logic and ISO8583 message conversion.'
      ]
    },
    {
      company: 'American Heart Association (Impelsys)',
      role: 'QA Engineer',
      location: 'Bangalore, India',
      period: '28 June 2021 – 28 February 2025',
      project: 'Atlas – Unified Learning & Certification Platform',
      bullets: [
        'Developed Hybrid Automation Frameworks using Selenium, TestNG, and Apache POI, boosting test coverage by 40%.',
        'Led QA for React-based releases, reducing critical production defects by 30%.',
        'Collaborated with DevOps teams for Helm deployments, VPC migrations, and MySQL 8.0 upgrades.'
      ]
    }
  ];

  return (
    <section className="py-16 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
          Professional Experience
        </h2>
        <div className="space-y-8">
          {experiences.map((exp, idx) => (
            <div key={idx} className="p-6 bg-slate-800/30 rounded-xl border border-slate-800">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                <h3 className="text-xl font-bold text-blue-400">{exp.role} <span className="text-white">@ {exp.company}</span></h3>
                <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full">{exp.period}</span>
              </div>
              <p className="text-sm font-semibold text-slate-300 mb-4">{exp.project}</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-slate-300">
                {exp.bullets.map((b, bIdx) => (
                  <li key={bIdx}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import React from 'react';

const benefits = [
  {
    icon: '🚀',
    title: '10x Faster Analysis',
    desc: 'Analyze BPMN in minutes, not weeks.',
  },
  {
    icon: '🎯',
    title: '95% Issue Detection',
    desc: 'AI finds what humans miss.',
  },
  {
    icon: '🔧',
    title: 'Automated Repairs',
    desc: 'Smart fixes with built-in validation.',
  },
  {
    icon: '📊',
    title: 'Multi-Format Support',
    desc: 'Works with all major BPMN tools.',
  },
  {
    icon: '🔄',
    title: 'Real-time Collaboration',
    desc: 'Team workflows made easy.',
  },
];

const KeyBenefits: React.FC = () => {
  return (
    <section className="w-full bg-white dark:bg-darkmode py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-black dark:text-white">Create fast, robust, and standarized BPMN</h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 font-semibold">
          <span className="block font-normal text-gray-700 dark:text-gray-200 mt-1">
            Our intelligent platform leverages AI to instantly analyze, detect, and repair BPMN processes—so your team can focus on what matters most.
          </span>
        </p>
      </div>
      {/* Grid 3 kartu di baris pertama */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-8">
        {benefits.slice(0, 3).map((b, i) => (
          <div key={i} className="flex flex-col items-center bg-gray dark:bg-darkmode border border-gray-100 rounded-xl p-6 shadow hover:shadow-lg transition">
            <div className="text-4xl mb-3">{b.icon}</div>
            <h3 className="font-semibold text-lg text-primary dark:text-white mb-1">{b.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{b.desc}</p>
          </div>
        ))}
      </div>
      {/* Grid 2 kartu di baris kedua, center */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mt-8 justify-center">
        {benefits.slice(3).map((b, i) => (
          <div key={i+3} className="flex flex-col items-center border border-gray-100 bg-gray dark:bg-darkmode  rounded-xl p-6 shadow hover:shadow-lg transition">
            <div className="text-4xl mb-3">{b.icon}</div>
            <h3 className="font-semibold text-lg text-primary dark:text-white mb-1">{b.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default KeyBenefits; 
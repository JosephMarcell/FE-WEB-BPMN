'use client';

import React from 'react';

const models = [
  {
    name: 'BPMN Validator',
    desc: 'Validasi diagram BPMN Anda secara otomatis untuk memastikan kesesuaian standar.',
  },
  {
    name: 'Process Optimizer',
    desc: 'Optimasi proses bisnis dengan analisis otomatis dan rekomendasi perbaikan.',
  },
  {
    name: 'API Integration',
    desc: 'Integrasikan BPMN engine ke aplikasi Anda melalui RESTful API yang mudah digunakan.',
  },
  {
    name: 'Simulation Engine',
    desc: 'Simulasikan alur proses bisnis untuk menguji performa dan skenario.',
  },
];

const ToolsandAPI = () => (
  <section id="API" className="min-h-screen bg-gradient-to-r from-primary to-primary dark:from-darkmode-secondary dark:to-darkmode py-20 px-4 sm:px-8">
    <div className="max-w-3xl mx-auto text-center mb-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-white dark:text-white mb-4">
        Tools & API
      </h1>
      <p className="text-white dark:text-gray-300">
        Pilih model dan tools yang sesuai kebutuhan pengembangan dan analisis BPMN Anda.
      </p>
    </div>
    <div className="mx-auto max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-8">
      {models.map(model => (
        <div
          key={model.name}
          className="rounded-2xl bg-white dark:bg-darkmode-secondary shadow-md border border-gray-100 dark:border-primary p-8 flex flex-col items-start transition hover:shadow-lg"
        >
          <h2 className="text-xl font-semibold text-primary dark:text-white mb-2">{model.name}</h2>
          <p className="text-gray-700 dark:text-gray-200 mb-4">{model.desc}</p>
          <button className="mt-auto rounded-full bg-primary text-white px-6 py-2 font-semibold shadow hover:bg-darkmode-secondary transition">
            Coba Sekarang
          </button>
        </div>
      ))}
    </div>
  </section>
);

export default ToolsandAPI;
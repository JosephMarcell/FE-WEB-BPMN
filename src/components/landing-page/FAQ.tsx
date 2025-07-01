'use client';

import React, { useState } from 'react';

const faqs = [
  {
    question: 'Apa itu BPMN dan mengapa penting?',
    answer:
      'BPMN (Business Process Model and Notation) adalah standar grafis untuk memodelkan proses bisnis. BPMN membantu memvisualisasikan, menganalisis, dan mengoptimalkan proses bisnis secara efisien.',
  },
  {
    question: 'Apakah tools ini gratis digunakan?',
    answer:
      'Sebagian fitur dapat digunakan secara gratis. Untuk fitur premium dan API, tersedia paket berlangganan.',
  },
  {
    question: 'Bagaimana cara mengintegrasikan API ke aplikasi saya?',
    answer:
      'Anda dapat membaca dokumentasi API kami dan mengikuti contoh integrasi yang tersedia untuk berbagai bahasa pemrograman.',
  },
  {
    question: 'Apakah data saya aman di platform ini?',
    answer:
      'Kami menggunakan enkripsi dan standar keamanan industri untuk melindungi data Anda.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="FAQ" className="min-h-screen bg-white dark:bg-darkmode py-20 px-4 sm:px-8">
      <div className="max-w-2xl mx-auto text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-3">
          FAQ
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Temukan jawaban atas pertanyaan yang sering diajukan tentang platform kami.
        </p>
      </div>
      <div className="max-w-2xl mx-auto space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-gray-200 dark:border-[#2c3e50] bg-primary dark:bg-primary shadow transition"
          >
            <button
              className="w-full flex justify-between items-center px-6 py-4 text-left text-lg font-medium text-white dark:text-white focus:outline-none"
              onClick={() => handleToggle(idx)}
              aria-expanded={openIndex === idx}
            >
              <span>{faq.question}</span>
              <span className="ml-4 text-2xl">
                {openIndex === idx ? '−' : '+'}
              </span>
            </button>
            {openIndex === idx && (
              <div className="px-6 pb-4 text-white dark:text-gray-200 animate-fade-in">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </section>
  );
};

export default FAQ;
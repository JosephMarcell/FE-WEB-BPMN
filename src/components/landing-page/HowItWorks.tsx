'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

import { getTranslation } from '@/lib/lang/i18n';

const HowItWorksSection = () => {
  const { t } = getTranslation();

  const steps = [
    {
      title: t('how_step1_title'),
      description: t('how_step1_description'),
      icon: '📡',
      image: null,
    },
    {
      title: t('how_step2_title'),
      description: t('how_step2_description'),
      icon: '📤',
      image: null,
    },
    {
      title: t('how_step3_title'),
      description: t('how_step3_description'),
      icon: '🧠',
      image: null,
    },
    {
      title: t('how_step4_title'),
      description: t('how_step4_description'),
      icon: '📈',
      image: null,
    },
    {
      title: t('how_step5_title'),
      description: t('how_step5_description'),
      icon: '🛠️',
      image: null,
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    hover: { scale: 1.02 },
  };

  return (
    <section className='how-it-works-section relative overflow-hidden bg-white px-6 py-20 text-[#030303] dark:bg-darkmode dark:text-white'>
      {/* Background elements */}
      <div className='pointer-events-none absolute inset-0 z-0'>
        <div className='absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#0078C1] opacity-10 opacity-10 dark:bg-[#112e52]'></div>
      </div>

      {/* Main content */}
      <div className='relative z-10 mx-auto max-w-7xl'>
        {/* Title & Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='mb-16 text-center'
        >
          <h2 className='mb-4 text-3xl font-bold text-gray-800 md:text-4xl dark:text-white'>
            {t('how_title')}{' '}
            <span className='text-primary dark:text-primary'>BPMN</span>
          </h2>
          <p className='mx-auto max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-300'>
            {t('how_subtitle')}
          </p> {/* Horizontal slider */}
          <div className='mx-auto mt-6 h-1.5 w-20 rounded-full bg-primary dark:bg-primary'></div>
        </motion.div>

        {/* Steps timeline */}
        <motion.div
          variants={container}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true }}
          className='relative'
        >
          {/* Timeline line */}
          <div className='absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 transform bg-[#0078C1]/20 md:block dark:bg-[#00a1ff]/20'></div>

          {/* Steps container */}
          <div className='space-y-12 md:space-y-12'>
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={item}
                className='group relative'
              >
                {/* Step card */}
                <div
                  className={`mx-auto flex max-w-5xl flex-col items-center gap-6 rounded-xl border border-gray-100 bg-gray-50/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md md:flex-row dark:border-white dark:bg-darkmode-secondary/80 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Number indicator (mobile) */}
                  <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#0078C1] text-xl font-bold text-white md:hidden'>
                    {index + 1}
                  </div>

                  {/* Image/Icon container */}
                  <div className='w-full flex-shrink-0 md:w-2/5'>
                    <div className='relative flex h-48 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-[#00a1ff]/10 md:h-64 dark:from-[#0a2540]/10 dark:to-[#112e52]/10'>
                      {step.image ? (
                        <Image
                          src={step.image}
                          alt={step.title}
                          className='h-full w-full object-contain p-6'
                          width={500}
                          height={500}
                        />
                      ) : (
                        <div className='text-8xl opacity-80'>{step.icon}</div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className='w-full md:w-2/3'>
                    {/* Number indicator (desktop) */}
                    <div className='mb-4 hidden items-center md:flex'>
                      <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-white'>
                        {index + 1}
                      </div>
                      <div
                        className={`h-0.5 w-8 bg-[#0078C1]/50 dark:bg-[#00a1ff]/50 ${
                          index === steps.length - 1 ? 'opacity-0' : ''
                        }`}
                      ></div>
                    </div>

                    <h3 className='mb-3 text-xl font-semibold text-gray-800 md:text-2xl dark:text-white'>
                      {step.title}
                    </h3>
                    <p className='leading-relaxed text-gray-600 dark:text-gray-300'>
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className='mt-16 text-center'
        ></motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

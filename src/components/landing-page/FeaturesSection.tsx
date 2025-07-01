'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

import { getTranslation } from '@/lib/lang/i18n';

const FeaturesSection = () => {
  const { t } = getTranslation();

  const features = [
    {
      icon: '🚀',
      image: null,
      title: t('10x Faster Analysis'),
      desc: t('Minutes instead of weeks'),
      more: t('real_time_monitoring_more'),
    },
    {
      icon: '🎯',
      image: null,
      title: t('95% Issue Detection'),
      desc: t('AI finds what humans miss'),
      more: t('smart_alerts_more'),
    },
    {
      icon: '🔧',
      image: null,
      title: t('Automated Repairs'),
      desc: t('lorem_ipsum_parag'),
      more: t('in_depth_analytics_more'),
    },
    {
      icon: '📊',
      image: null,
      title: t('Multi-Format Support'),
      desc: t('lorem_ipsum_parag'),
      more: t('compliance_reports_more'),
    },
    {
      icon: '🔄',
      image: null,
      title: t('Real-time Collaboration'),
      desc: t('lorem_ipsum_parag'),
      more: t('compliance_reports_more'),
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
    hover: { y: -5 },
  };

  return (
    <section className='relative overflow-hidden bg-white px-4 py-20 transition-all duration-500 sm:px-6 lg:px-8 dark:bg-darkmode'>
      {/* Decorative elements */}
      <div className='pointer-events-none absolute inset-0 z-0'>
        <div className='absolute -bottom-52 -left-16 h-72 w-72 rounded-full bg-[#0078C1] opacity-10 dark:bg-[#1e3c64]'></div>
      </div>

      <div className='relative z-10 mx-auto max-w-screen-xl'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='mb-16 text-center'
        >
          <h2 className='mb-4 text-3xl font-bold text-gray-800 sm:text-4xl dark:text-white'>
            <span className='text-black dark:text-white'>
              {t('Create fast, robust, and standarized BPMN')}
            </span>
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-black dark:text-gray-300'>
            {t('Our AI-powered suite analyzes, detects issues, and repairs BPMN processes in minutes')}
          </p>
          <div className='mx-auto mt-6 h-1.5 w-20 rounded-full bg-primary dark:bg-primary'></div>
        </motion.div>

        {/* Grid baris pertama: 3 kartu */}
        <motion.div
          variants={container}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true }}
          className='grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8'
        >
          {features.slice(0, 3).map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover='hover'
              className='group rounded-xl border border-gray-100 bg-white dark:bg-darkmode-secondary p-6 shadow-md transition-all duration-300 hover:border-primary/30 hover:shadow-lg sm:p-8 dark:border-[#2c3e50] dark:bg-[#112e52] dark:hover:border-[#00a1ff]/30'
            >
              <div className='mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20 dark:bg-primary/10 dark:group-hover:bg-primary/20'>
                {feature.image ? (
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    className='h-12 w-12 object-contain'
                    width={48}
                    height={48}
                  />
                ) : (
                  <span className='text-4xl'>{feature.icon}</span>
                )}
              </div>

              <h3 className='mb-3 flex min-h-[3.5rem] items-center justify-center text-center text-xl font-semibold text-gray-800 dark:text-white'>
                {feature.title}
              </h3>
              <p className='mb-4 text-sm leading-relaxed text-gray-600 sm:text-base dark:text-gray-300'>
                {feature.desc}
              </p>
              <div className="flex justify-center mt-4">
                <button className='xs:text-sm transform rounded-full bg-primary px-5 py-2 text-xs font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-gray-100 hover:shadow-xl sm:px-8 sm:py-3 sm:text-base dark:bg-primary dark:text-white dark:hover:bg-darkmode-secondary'>
                  {t('hero_cta_primary')}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
        {/* Grid baris kedua: 2 kartu, center */}
        <motion.div
          variants={container}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true }}
          className='grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto mt-8 justify-center'
        >
          {features.slice(3).map((feature, index) => (
            <motion.div
              key={index+3}
              variants={item}
              whileHover='hover'
              className='group rounded-xl border border-gray-100 bg-white dark:bg-darkmode-secondary p-6 shadow-md transition-all duration-300 hover:border-primary/30 hover:shadow-lg sm:p-8 dark:border-[#2c3e50] dark:bg-[#112e52] dark:hover:border-[#00a1ff]/30'
            >
              <div className='mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20 dark:bg-primary/10 dark:group-hover:bg-primary/20'>
                {feature.image ? (
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    className='h-12 w-12 object-contain'
                    width={48}
                    height={48}
                  />
                ) : (
                  <span className='text-4xl'>{feature.icon}</span>
                )}
              </div>

              <h3 className='mb-3 flex min-h-[3.5rem] items-center justify-center text-center text-xl font-semibold text-gray-800 dark:text-white'>
                {feature.title}
              </h3>
              <p className='mb-4 text-sm leading-relaxed text-gray-600 sm:text-base dark:text-gray-300'>
                {feature.desc}
              </p>
              <div className="flex justify-center mt-4">
                <button className='xs:text-sm transform rounded-full bg-primary px-5 py-2 text-xs font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-gray-100 hover:shadow-xl sm:px-8 sm:py-3 sm:text-base dark:bg-primary dark:text-white dark:hover:bg-darkmode-secondary'>
                  {t('hero_cta_primary')}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
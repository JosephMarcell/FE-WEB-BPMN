'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

import { getTranslation } from '@/lib/lang/i18n';

const FeaturesSection = () => {
  const { t } = getTranslation();

  const features = [
    {
      icon: '🌊',
      image: null,
      title: t('real_time_monitoring'),
      desc: t('real_time_monitoring_desc'),
      more: t('real_time_monitoring_more'),
    },
    {
      icon: '🔔',
      image: null,
      title: t('smart_alerts'),
      desc: t('smart_alerts_desc'),
      more: t('smart_alerts_more'),
    },
    {
      icon: '📊',
      image: null,
      title: t('in_depth_analytics'),
      desc: t('in_depth_analytics_desc'),
      more: t('in_depth_analytics_more'),
    },
    {
      icon: '📄',
      image: null,
      title: t('compliance_reports'),
      desc: t('compliance_reports_desc'),
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
    <section className='relative overflow-hidden bg-white px-4 py-20 transition-all duration-500 sm:px-6 lg:px-8 dark:bg-[#0a2540]'>
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
            <span className='text-[#0078C1] dark:text-[#00a1ff]'>
              {t('our')}
            </span>{' '}
            {t('key_features')}
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300'>
            {t('features_subtitle')}
          </p>
          <div className='mx-auto mt-6 h-1.5 w-20 rounded-full bg-[#0078C1] dark:bg-[#00a1ff]'></div>
        </motion.div>

        <motion.div
          variants={container}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true }}
          className='grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4'
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover='hover'
              className='group rounded-xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:border-[#0078C1]/30 hover:shadow-lg sm:p-8 dark:border-[#2c3e50] dark:bg-[#112e52] dark:hover:border-[#00a1ff]/30'
            >
              <div className='mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-xl bg-[#0078C1]/10 transition-colors duration-300 group-hover:bg-[#0078C1]/20 dark:bg-[#00a1ff]/10 dark:group-hover:bg-[#00a1ff]/20'>
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
              {feature.more && (
                <p className='flex items-center text-sm font-medium text-[#0078C1] dark:text-[#00a1ff]'>
                  <svg
                    className='mr-1 h-4 w-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                  {feature.more}
                </p>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;

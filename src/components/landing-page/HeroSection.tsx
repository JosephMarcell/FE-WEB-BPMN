'use client';

import { motion } from 'framer-motion';
import React from 'react';

import { getTranslation } from '@/lib/lang/i18n';

import BpmnBgAnimation from './BpmnBgAnimation';


const HeroSection: React.FC<HeroSectionProps> = () => {
  const { t } = getTranslation();

  return (
    <section className='hero-section relative overflow-hidden bg-gradient-to-r from-primary to-primary px-4 pb-16 pt-24 text-white sm:px-6 md:py-24 lg:py-32 dark:from-darkmode dark:to-darkmode'>
      {/* Background elements */}
      <div className='absolute top-1/2 right-0 -translate-y-1/2 pr-8 md:pr-16 lg:pr-24'>
        {/* <BpmnBgAnimation />*/}
        <BpmnBgAnimation />
        <div className="absolute left-0 top-0 h-full w-full bg-[url('/assets/images/landing-page/water-pattern.svg')] bg-cover opacity-10 dark:opacity-5"></div>
      
      </div>

      <div className='relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:px-6 md:flex-row md:gap-12 lg:px-8'>
        {/* Kiri: Tulisan, upload, tombol, trust indicator */}
        <motion.div
          className='md:w-1/2 text-left flex flex-col items-start'
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
        <motion.h1
          className="text-5xl xs:text-3xl xs:leading-tight mb-3 font-bold leading-snug sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {t('hero_title')}
          <span className="mt-3 block text-2xl sm:text-3xl md:text-4xl dark:text-primary lg:text-2xl font-semibold">
            {t('hero_highlight')}
          </span>
          <div className="hero_highlight">
        {/* ...existing highlight content... */}
      </div>

      {/* Deskripsi Section 
      <section className="mt-6 text-lg text-left  max-w-2xl mx-auto">
        <p>
          {t('lorem_ipsum_parag')}
        </p>
        <p>
          {t('lorem_ipsum_parag')}
        </p>
        <p>
         {t('lorem_ipsum_parag')}
        </p>
      </section>*/}
      
        </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className='flex flex-col items-start justify-center gap-4 sm:flex-row'
          >
            <button className='xs:text-sm transform rounded-full bg-white px-5 py-2 text-xs font-bold text-primary shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:text-white hover:shadow-xl sm:px-8 sm:py-3 sm:text-base dark:bg-white dark:text-primary'>
              {t('hero_cta_primary')}
            </button>
            <button className='xs:text-sm transform rounded-full border-2 border-white px-5 py-2 text-xs font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 sm:px-8 sm:py-3 sm:text-base dark:border-white dark:text-white dark:hover:bg-primary/40'>
              {t('hero_cta_secondary')}
            </button>
            <button className='xs:text-sm transform rounded-full border-2 border px-5 py-2 text-xs font-bold text-primary bg-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:text-white sm:px-8 sm:py-3 dark:bg-white sm:text-base dark:text-primary'>
              {t('hero_cta_tertiary')}
            </button>
          </motion.div>

          
        </motion.div>

        {/* Kanan: Kosong (bisa diisi ilustrasi lain jika perlu) */}
        <div className="md:w-1/2"></div>
      </div>

      {/* Scroll Hint Icon */}
      <motion.div
        className='absolute bottom-6 left-1/2 z-20 -translate-x-1/2 transform'
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <svg
          className='h-6 w-6 text-white opacity-70'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </motion.div>

      {/* Wave transition */}
      <div className='absolute bottom-0 left-0 w-full rotate-180 overflow-hidden leading-[0]'>
        <svg
          className='relative block h-[100px] w-[calc(100%+1.3px)]'
          xmlns='http://www.w3.org/2000/svg'
          preserveAspectRatio='none'
          viewBox='0 0 1200 120'
        >
          <path
            d='M0,0V46.29c47.6,22,103.54,29.22,158.48,17,70.92-16.38,136.79-58.73,207.71-65.56C468.19-10.3,538.38,23.8,614.67,40c72.66,15.44,142.59,3.38,211.17-16.27C909.93,4.45,985.62,17.55,1048,35.1c58.51,16.69,114.17,30.4,152,37.38V0Z'
            className='fill-white dark:fill-darkmode'
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

import { getTranslation } from '@/lib/lang/i18n';

interface HeroSectionProps {
  imageSrc?: string;
  imageAlt?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  imageSrc = '/assets/images/landing-page/hero-illustration.png',
  imageAlt = 'Ilustrasi Pemantauan Air',
}) => {
  const { t } = getTranslation();

  const descriptionLines = [
    t('hero_description_line1'),
    t('hero_description_line2'),
    t('hero_description_line3'),
  ];

  return (
    <section className='hero-section relative overflow-hidden bg-gradient-to-r from-[#0078C1] to-[#00a1ff] px-4 pb-16 pt-24 text-white sm:px-6 md:py-24 lg:py-32 dark:from-[#0a2540] dark:to-[#112e52]'>
      {/* Background elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className="absolute left-0 top-0 h-full w-full bg-[url('/assets/images/landing-page/water-pattern.svg')] bg-cover opacity-10 dark:opacity-5"></div>
        <motion.div
          className='absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white opacity-10 sm:-right-20 sm:-top-20 sm:h-64 sm:w-64 dark:bg-white/10'
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className='absolute -bottom-5 -left-5 h-48 w-48 rounded-full bg-white opacity-10 sm:-bottom-10 sm:-left-10 sm:h-80 sm:w-80 dark:bg-white/10'
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </div>

      <div className='relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:px-6 md:flex-row md:gap-12 lg:px-8'>
        <motion.div
          className='text-center md:w-1/2 md:text-left'
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.h1
            className='xs:text-3xl xs:leading-tight mb-3 text-2xl font-bold leading-snug sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {t('hero_title')}{' '}
            <span className='block text-[#b3e0ff] md:inline dark:text-[#5dc3ff]'>
              {t('hero_highlight')}
            </span>
          </motion.h1>
          <motion.p
            className='xs:text-base mb-4 space-y-2 text-sm text-white/90 sm:mb-8 sm:text-lg md:text-xl dark:text-gray-300'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {descriptionLines.map((line, index) => (
              <span
                key={index}
                className={`block ${
                  index === descriptionLines.length - 1
                    ? 'font-semibold text-[#b3e0ff] dark:text-[#5dc3ff]'
                    : ''
                }`}
              >
                {line}
              </span>
            ))}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className='flex flex-col justify-center gap-4 sm:flex-row md:justify-start'
          >
            <button className='xs:text-sm transform rounded-full bg-white px-5 py-2 text-xs font-bold text-[#0078C1] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-gray-100 hover:shadow-xl sm:px-8 sm:py-3 sm:text-base dark:bg-[#0b3c5d] dark:text-white dark:hover:bg-[#155d89]'>
              {t('hero_cta_primary')}
            </button>
            <button className='xs:text-sm transform rounded-full border-2 border-white px-5 py-2 text-xs font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 sm:px-8 sm:py-3 sm:text-base dark:border-[#5dc3ff] dark:text-[#5dc3ff] dark:hover:bg-[#155d89]/40'>
              {t('hero_cta_secondary')}
            </button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            className='mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className='flex items-center'>
              <div className='mr-2 flex -space-x-2'>
                {[1, 2, 3].map(item => (
                  <div
                    key={item}
                    className='flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-white/20 text-xs font-bold dark:border-[#5dc3ff] dark:bg-[#5dc3ff]/20'
                  >
                    {item}
                  </div>
                ))}
              </div>
              <span className='text-xs sm:text-sm'>
                {t('hero_users_count')}
              </span>
            </div>
            <div className='flex items-center'>
              <svg
                className='mr-1 h-5 w-5 text-yellow-400'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
              </svg>
              <span className='text-xs sm:text-sm'>
                {t('hero_review_score')}
              </span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className='mt-10 flex justify-center md:mt-0 md:w-1/2'
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <div className='relative w-full max-w-md lg:max-w-lg'>
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={600}
              height={600}
              className='h-auto w-full drop-shadow-2xl'
              priority
            />
            <motion.div
              className='absolute left-0 top-0 -z-10 h-full w-full rounded-full bg-[#0078C1] dark:bg-[#155d89]'
              animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
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
            className='fill-white dark:fill-[#0a2540]'
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;

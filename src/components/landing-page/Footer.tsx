'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

import { getTranslation } from '@/lib/lang/i18n';

const Footer = () => {
  const { t } = getTranslation();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className='relative'>
      {/* Transition Section */}
      <div className='relative h-48 w-full overflow-hidden'>
        <svg
          viewBox='0 0 1200 120'
          preserveAspectRatio='none'
          className='absolute left-0 top-0 h-full w-full'
        >
          <path
            d='M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z'
            className='fill-[#f1f5f9] dark:fill-[#111827]'
          />
          <path
            d='M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z'
            opacity='.5'
            className='fill-[#f1f5f9] dark:fill-[#111827]'
          />
          <path
            d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z'
            opacity='.25'
            className='fill-[#f1f5f9] dark:fill-[#111827]'
          />
        </svg>

        <div className='absolute left-0 top-0 h-full w-full bg-[#0078C1]/5 dark:bg-[#0a2540]/5'></div>

        <div className='absolute top-1/4 z-10 w-full px-4 text-center'>
          <motion.h3
            className='mb-4 text-2xl font-bold text-gray-700 md:text-3xl dark:text-white'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t('footer_cta_title')}
          </motion.h3>
        </div>

        <div className='absolute bottom-0 z-10 flex w-full flex-col items-center justify-center gap-4 pb-8'>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='rounded-full bg-primary px-8 py-4 font-bold text-white shadow-xl transition-all hover:shadow-2xl'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {t('get_started')}
          </motion.button>
        </div>
      </div>

      {/* Footer Section */}
      <footer className='relative overflow-hidden bg-[#0078C1]/5 text-[#030303] dark:bg-[#0a2540]/5 dark:text-white'>
        <div className="absolute left-0 top-0 h-32 w-full bg-[url('/assets/images/landing-page/wave-pattern.svg')] bg-cover bg-repeat-x opacity-20 dark:opacity-40"></div>

        <div className='relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-20 sm:px-6 md:grid-cols-3 lg:px-8'>
          {/* Column 1: Logo and description */}
          <motion.div
            variants={container}
            initial='hidden'
            whileInView='show'
            viewport={{ once: true }}
            className='space-y-6'
          >
            <motion.div variants={item}>
              <h4 className='flex items-center text-xl font-bold text-[#0078C1] dark:text-[#00a1ff]'>
                <Image
                  src='/assets/images/logo_title_new_bm.png'
                  alt='LecSens Logo'
                  width={120}
                  height={30}
                />
              </h4>
            </motion.div>
            <motion.p
              variants={item}
              className='text-sm text-gray-600 dark:text-gray-300'
            >
              {t('lorem_ipsum_parag')}
            </motion.p>
            <motion.div variants={item} className='flex gap-4'>
              {['twitter', 'facebook', 'linkedin', 'instagram'].map(social => (
                <a
                  key={social}
                  href='#'
                  className='flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition-all hover:text-[#0078C1] hover:shadow-md dark:bg-[#112e52] dark:hover:text-[#00a1ff]'
                >
                  <span className='text-lg'>
                    {social === 'twitter'
                      ? '𝕏'
                      : social.charAt(0).toUpperCase()}
                  </span>
                </a>
              ))}
            </motion.div>
          </motion.div>

          {/* Column 2: Navigation */}
          <motion.div
            variants={container}
            initial='hidden'
            whileInView='show'
            viewport={{ once: true }}
            className='space-y-4'
          >
            <motion.h4 variants={item} className='text-md mb-2 font-semibold'>
              {t('navigation')}
            </motion.h4>
            <motion.ul variants={container} className='space-y-2'>
              {['hero', 'Upload', 'features', 'how', 'API', 'FAQ'].map(link => (
                <motion.li key={link} variants={item}>
                  <a
                    href={`#${link}`}
                    className='flex items-center text-sm text-gray-600 transition-all hover:text-[#0078C1] dark:text-gray-300 dark:hover:text-[#00a1ff]'
                  >
                    <span className='mr-2 h-2 w-2 rounded-full bg-[#0078C1] opacity-0 transition-opacity group-hover:opacity-100'></span>
                    {t(link)}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Column 3: Contact */}
          <motion.div
            variants={container}
            initial='hidden'
            whileInView='show'
            viewport={{ once: true }}
            className='space-y-4'
          >
            <motion.h4 variants={item} className='text-md mb-2 font-semibold'>
              {t('contact')}
            </motion.h4>
            <motion.p
              variants={item}
              className='text-sm text-gray-600 dark:text-gray-300'
            >
              {t('email')}: info@BPMN.com
            </motion.p>
            <motion.p
              variants={item}
              className='text-sm text-gray-600 dark:text-gray-300'
            >
              {t('phone')}: +62 812 3456 7890
            </motion.p>
            <motion.form variants={item} className='mt-6 space-y-3'>
              <label
                htmlFor='email'
                className='text-sm font-medium text-gray-700 dark:text-gray-300'
              >
                {t('newsletter')}
              </label>
              <div className='flex gap-2'>
                <input
                  type='email'
                  placeholder={t('enter_your_email')}
                  className='flex-1 rounded-full border border-gray-300 px-4 py-2 transition-all focus:border-[#0078C1] focus:outline-none focus:ring-1 focus:ring-[#0078C1]/50 dark:border-primary dark:bg-darkmode dark:text-white'
                />
                <button
                  type='submit'
                  className='rounded-full bg-primary px-6 py-2 text-white shadow-md transition-all duration-300 hover:bg-primary hover:shadow-lg dark:bg-darkmode'
                >
                  {t('subscribe')}
                </button>
              </div>
            </motion.form>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <div className='border-t border-gray-200/50 dark:border-[#00a1ff]/50'>
          <div className='mx-auto max-w-7xl px-4 py-6 text-center text-sm text-gray-500 sm:px-6 lg:px-8 dark:text-gray-300'>
            © {new Date().getFullYear()} LecSens. {t('all_rights_reserved')}.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;

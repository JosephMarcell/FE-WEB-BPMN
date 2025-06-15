'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { getTranslation } from '@/lib/lang/i18n';

const VerifyAccountCard = ({ children }: { children: React.ReactNode }) => {
  const { t } = getTranslation();

  return (
    <div className='relative z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800'>
      <div className='flex flex-col items-center'>
        <div className='relative mb-6'>
          <div
            className='absolute inset-0 animate-pulse rounded-full bg-[#0078C1]/10'
            style={{
              top: '-10px',
              left: '-10px',
              right: '-10px',
              bottom: '-10px',
            }}
          ></div>
          <div className='relative z-10 rounded-full bg-gradient-to-br from-[#0078C1]/20 to-[#00a1ff]/10 p-4'>
            <Image
              src='/assets/images/auth/email-verif.svg'
              alt={t('email_verif_alt')}
              width={80}
              height={80}
              className='drop-shadow-md'
            />
          </div>
        </div>

        <h1 className='mb-2 text-3xl font-bold text-gray-800 dark:text-white'>
          {t('verify_email')}
        </h1>

        <p className='mb-8 max-w-md text-center text-gray-600 dark:text-gray-300'>
          {t('enter_verification_code')}
        </p>

        {children}

        <div className='mt-8 w-full'>
          <Link
            href='/auth/login'
            className='group inline-flex items-center font-medium text-[#0078C1] transition-all hover:text-[#00a1ff]'
          >
            <span className='mr-2 transition-transform group-hover:-translate-x-1'>
              &lt;
            </span>
            {t('back_to_login')}
          </Link>
        </div>
      </div>

      <div className='absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-[#00a1ff]/10 blur-md'></div>
      <div className='absolute -right-4 -top-4 h-20 w-20 rounded-full bg-[#0078C1]/10 blur-md'></div>
    </div>
  );
};

export default VerifyAccountCard;

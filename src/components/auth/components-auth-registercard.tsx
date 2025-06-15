'use client';

import Image from 'next/image';
import Link from 'next/link';

import { getTranslation } from '@/lib/lang/i18n';

import ComponentsAuthRegisterForm from './components-auth-register-form';

const SignUpCard = () => {
  const { t } = getTranslation();

  return (
    <div className='relative z-10 w-full max-w-2xl'>
      {/* Logo positioned above the card */}
      <div className='absolute -top-20 left-0 right-0 z-10 flex justify-center'>
        <div className='mt-8 rounded-full bg-white p-2 shadow-xl dark:bg-gray-800'>
          <Image
            src='/assets/images/lecsens-logo.png'
            alt='LecSens Logo'
            width={230}
            height={230}
            priority
            className='object-contain'
          />
        </div>
      </div>

      {/* Main card */}
      <div className='w-full overflow-hidden rounded-xl border border-white/20 bg-white/95 shadow-2xl backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/90'>
        {/* Decorative top accent */}
        <div className='h-2 bg-gradient-to-r from-[#0078C1] to-[#00a1ff]'></div>

        {/* Content area */}
        <div className='p-8 pt-14'>
          <h1 className='mb-6 text-center text-2xl font-bold text-gray-800 dark:text-white'>
            {t('register_title')}
          </h1>

          {/* Register form component */}
          <ComponentsAuthRegisterForm />

          {/* Login link */}
          <div className='mt-4 text-center text-sm text-gray-600 dark:text-gray-400'>
            {t('register_have_account')} &nbsp;
            <Link
              href='/auth/login'
              className='font-medium text-[#0078C1] transition-colors hover:text-[#00a1ff]'
            >
              {t('register_login_link')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpCard;

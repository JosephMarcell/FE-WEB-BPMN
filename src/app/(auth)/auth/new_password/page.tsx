import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

import ComponentsAuthNewPassword from '@/components/auth/components-auth-new-password';

export const metadata: Metadata = {
  title: 'Reset Password',
};

const NewPassword = () => {
  return (
    <div>
      <div className='relative flex min-h-screen items-center justify-center bg-[#edf2fe] px-6 py-10 sm:px-16 dark:bg-[#04103A]'>
        <div className='relative overflow-hidden rounded-lg bg-white p-8 shadow-lg md:p-12 dark:bg-gray-800'>
          <h1 className='mb-6 text-center text-3xl font-bold text-gray-800 dark:text-white'>
            Buat Kata Sandi Baru
          </h1>
          <p className='mb-8 text-center text-gray-600 dark:text-gray-300'>
            Kata sandi baru harus berbeda dengan kata sandi sebelumnya
          </p>

          <div className='mx-auto max-w-lg'>
            <ComponentsAuthNewPassword />
          </div>

          <div className='mt-6 text-center'>
            <Link
              href='/auth/login'
              className='text-sm font-medium text-[#0078C1] hover:text-[#00a1ff]'
            >
              &lt; Kembali ke halaman login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;

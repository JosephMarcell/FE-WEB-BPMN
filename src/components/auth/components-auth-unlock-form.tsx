'use client';
import { useRouter } from 'next/navigation';
import React from 'react';

import IconLockDots from '@/components/icon/icon-lock-dots';

const ComponentsAuthUnlockForm = () => {
  const router = useRouter();

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push('/');
  };

  return (
    <form className='space-y-5' onSubmit={submitForm}>
      <div>
        <label htmlFor='Password' className='dark:text-white'>
          Password
        </label>
        <div className='text-white-dark relative'>
          <input
            id='Password'
            type='password'
            placeholder='Enter Password'
            className='form-input placeholder:text-white-dark ps-10'
          />
          <span className='absolute start-4 top-1/2 -translate-y-1/2'>
            <IconLockDots fill={true} />
          </span>
        </div>
      </div>
      <button
        type='submit'
        className='btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]'
      >
        UNLOCK
      </button>
    </form>
  );
};

export default ComponentsAuthUnlockForm;

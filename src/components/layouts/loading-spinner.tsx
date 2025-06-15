/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';

interface LoadingSpinnerProps {
  isError?: boolean;
  onRetry?: () => Promise<void>;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  isError,
  onRetry,
}) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (onRetry) {
      setIsRetrying(true);
      try {
        await onRetry();
      } catch (error) {
        console.error('Retry failed', error); // Log any error
      }
      setIsRetrying(false);
    }
  };

  return (
    <div className='flex h-screen items-center justify-center'>
      {isError ? (
        <div className='flex flex-col justify-center text-center'>
          <svg
            width='89'
            height='75'
            viewBox='0 0 89 75'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='w-full'
          >
            <path
              d='M27.2663 14.2733L0.133911 34.2236L7.36838 17.2505L34.5405 5.34058e-05L27.2663 14.2733Z'
              fill='#D2D2D2'
            />
            <path
              d='M6.91699 17.6008L34.5405 0.307983V47.4701L9.21895 65.2232L6.91699 17.6008Z'
              fill='#E8E8E8'
            />
            <path
              d='M34.5405 0.307983L76.8966 10.2173V57.3966L34.5405 47.4873V0.307983Z'
              fill='#D2D2D2'
            />
            <path
              d='M6.91699 17.5985L50.1938 27.7122V74.8916L9.21895 65.4824L6.91699 17.5985Z'
              fill='white'
            />
            <path
              d='M49.2725 27.7294L76.896 10.4366V57.5987L49.2725 74.8915V27.7294Z'
              fill='#E8E8E8'
            />
            <path
              d='M61.694 41.7433L88.8662 24.4929L76.4446 10.4366L49.2725 27.6871L61.694 41.7433Z'
              fill='white'
            />
          </svg>
          <div className='my-4 text-center'>
            <p className='text-lg font-semibold text-black'>
              Gagal memuat data, silahkan coba ulang.
            </p>
          </div>
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className='flex items-center justify-center gap-2 rounded bg-white px-4 py-2 text-black hover:bg-gray-200 disabled:opacity-50'
          >
            {isRetrying && (
              <svg
                aria-hidden='true'
                className='mr-2 h-5 w-5 animate-spin fill-white text-white dark:text-gray-600'
                viewBox='0 0 100 101'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M100 50.5C100 78.2132 77.6142 100 50 100C22.3868 100 0 78.2132 0 50.5C0 22.7868 22.3868 0 50 0C77.6142 0 100 22.7868 100 50.5ZM9.08157 50.5C9.08157 74.0914 28.4086 92.9184 50 92.9184C71.5914 92.9184 90.9184 74.0914 90.9184 50.5C90.9184 26.9086 71.5914 8.08157 50 8.08157C28.4086 8.08157 9.08157 26.9086 9.08157 50.5Z'
                  fill='currentColor'
                />
                <path
                  d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 96.9482 33.607C94.1372 26.1016 89.9005 19.2334 84.4823 13.4427C78.5277 7.05177 71.0479 2.51931 63.0015 0.211492C60.6358 -0.548848 58.1417 1.0127 57.4736 3.51414C56.8055 6.01558 58.3871 8.52942 60.7655 9.29255C67.6847 11.5037 73.9315 15.2126 79.1599 20.1712C83.9826 24.7066 87.6438 30.2508 89.8564 36.4775C90.656 38.7983 93.5422 39.6781 93.9676 39.0409Z'
                  fill='currentFill'
                />
              </svg>
            )}
            {isRetrying ? 'Memuat...' : 'Memuat Ulang'}
          </button>
        </div>
      ) : (
        <div className='text-center' role='status'>
          <svg
            aria-hidden='true'
            className='mr-2 h-12 w-full animate-spin fill-white text-white dark:text-gray-600'
            viewBox='0 0 100 101'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M100 50.5C100 78.2132 77.6142 100 50 100C22.3868 100 0 78.2132 0 50.5C0 22.7868 22.3868 0 50 0C77.6142 0 100 22.7868 100 50.5ZM9.08157 50.5C9.08157 74.0914 28.4086 92.9184 50 92.9184C71.5914 92.9184 90.9184 74.0914 90.9184 50.5C90.9184 26.9086 71.5914 8.08157 50 8.08157C28.4086 8.08157 9.08157 26.9086 9.08157 50.5Z'
              fill='currentColor'
            />
            <path
              d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 96.9482 33.607C94.1372 26.1016 89.9005 19.2334 84.4823 13.4427C78.5277 7.05177 71.0479 2.51931 63.0015 0.211492C60.6358 -0.548848 58.1417 1.0127 57.4736 3.51414C56.8055 6.01558 58.3871 8.52942 60.7655 9.29255C67.6847 11.5037 73.9315 15.2126 79.1599 20.1712C83.9826 24.7066 87.6438 30.2508 89.8564 36.4775C90.656 38.7983 93.5422 39.6781 93.9676 39.0409Z'
              fill='currentFill'
            />
          </svg>
          <div className='mt-2 text-center'>
            <p className='text-lg font-bold text-white dark:text-black'>
              Sedang memproses data...
            </p>
            <p className='text-base text-white dark:text-black'>
              Harap menunggu...
            </p>
          </div>
          <span className='sr-only'>Loading...</span>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
